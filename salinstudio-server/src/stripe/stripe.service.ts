import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import * as geoip from 'geoip-lite';
import { PurchasableService } from '../purchasable/purchasable.service';
import { MailerService } from '../mailer/mailer.service';
import { SETTING_KEYS, SettingsService } from '../settings/settings.service';

@Injectable()
export class StripePaymentService {
  private _stripe: InstanceType<typeof Stripe> | null = null;

  constructor(
    private configService: ConfigService,
    private purchasableService: PurchasableService,
    private mailerService: MailerService,
    private settingsService: SettingsService,
  ) {}

  private get stripe(): InstanceType<typeof Stripe> {
    if (!this._stripe) {
      const key = this.configService.getOrThrow<string>('STRIPE_SECRET_KEY');
      this._stripe = new Stripe(key);
    }
    return this._stripe;
  }

  async createCheckoutSession(
    nanoId: string,
    locale?: string,
    clientIp?: string,
  ): Promise<string> {
    const allowedCountries = (await this.settingsService.get<string[]>(
      SETTING_KEYS.ALLOWED_COUNTRIES,
    )) ?? ['FI'];

    if (clientIp) {
      const geo = geoip.lookup(clientIp);
      if (geo && !allowedCountries.includes(geo.country)) {
        throw new ForbiddenException('Store is not available in your region');
      }
    }

    const purchasable = await this.purchasableService.findByNanoId(nanoId);
    const frontendUrl = this.configService.get<string>(
      'FRONTEND_URL',
      'http://localhost:5173',
    );

    if (purchasable.quantity < 1)
      throw new UnprocessableEntityException('This item is out of stock');

    const isFi = locale === 'fi';
    const localePrefix = locale ? `/${locale}` : '';
    const title = isFi ? purchasable.titleFi : purchasable.titleEn;
    const rawDescription = isFi ? purchasable.infoFi : purchasable.infoEn;
    const description =
      rawDescription?.length > 150
        ? rawDescription.slice(0, 150) + '…'
        : rawDescription;
    const images =
      purchasable.images.length > 0 ? [purchasable.images[0].desktopUrl] : [];

    const session = await this.stripe.checkout.sessions.create({
      mode: 'payment',
      locale: isFi ? 'fi' : 'en',
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: { name: title, description, images },
            unit_amount: Math.round(purchasable.currentPrice * 100),
          },
          quantity: 1,
        },
      ],
      shipping_address_collection: {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        allowed_countries: allowedCountries as any,
      },
      metadata: { nanoId },
      success_url: `${frontendUrl}${localePrefix}/checkout/complete/${nanoId}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontendUrl}${localePrefix}/store/${nanoId}`,
    });

    return session.url;
  }

  async handleWebhook(rawBody: Buffer, signature: string): Promise<void> {
    const webhookSecret = this.configService.getOrThrow<string>(
      'STRIPE_WEBHOOK_SECRET',
    );

    const event = (() => {
      try {
        return this.stripe.webhooks.constructEvent(
          rawBody,
          signature,
          webhookSecret,
        );
      } catch {
        throw new BadRequestException('Invalid webhook signature');
      }
    })();

    if (event.type !== 'checkout.session.completed') return;

    const session = event.data.object;
    const nanoId = session.metadata?.nanoId;
    if (!nanoId) return;

    const purchasable = await this.purchasableService.findByNanoId(nanoId);
    await this.purchasableService.decrementQuantity(nanoId);
    const sendToAddress = this.configService.getOrThrow<string>(
      'MAIL_SEND_TO_ADDRESS',
    );

    const customer = session.customer_details;
    const shipping = session.collected_information?.shipping_details;
    const amount = Intl.NumberFormat('fi-FI', {
      style: 'currency',
      currency: 'EUR',
    }).format((session.amount_total ?? 0) / 100);

    const addressLines = [
      shipping?.address?.line1,
      shipping?.address?.line2,
      shipping?.address?.postal_code && shipping?.address?.city
        ? `${shipping.address.postal_code} ${shipping.address.city}`
        : shipping?.address?.city,
      shipping?.address?.country,
    ]
      .filter(Boolean)
      .join('<br>');

    await this.mailerService.sendRawEmail({
      to: sendToAddress,
      subject: `New order: ${purchasable.titleEn}`,
      html: `
        <p>Hi Miia,</p>
        <p>You have a new order!</p>
        <table>
          <tr><td><strong>Item</strong></td><td>${purchasable.titleEn} / ${purchasable.titleFi}</td></tr>
          <tr><td><strong>Amount</strong></td><td>${amount}</td></tr>
          <tr><td><strong>Customer</strong></td><td>${customer?.name ?? '-'} (${customer?.email ?? '-'})</td></tr>
          <tr><td><strong>Ship to</strong></td><td>${shipping?.name ?? '-'}<br>${addressLines}</td></tr>
        </table>
        <p>You can view the full order in your <a href="https://dashboard.stripe.com">Stripe Dashboard</a>.</p>
      `,
    });
  }
}
