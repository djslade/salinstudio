import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  ForbiddenException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as geoip from 'geoip-lite';
import { StripePaymentService } from './stripe.service';
import { PurchasableService } from '../purchasable/purchasable.service';
import { MailerService } from '../mailer/mailer.service';
import { SettingsService } from '../settings/settings.service';

jest.mock('geoip-lite');
jest.mock('stripe');

import Stripe from 'stripe';

describe('StripePaymentService', () => {
  let service: StripePaymentService;
  let purchasableService: jest.Mocked<
    Pick<PurchasableService, 'findByNanoId' | 'decrementQuantity'>
  >;
  let mailerService: jest.Mocked<Pick<MailerService, 'sendRawEmail'>>;
  let settingsService: jest.Mocked<Pick<SettingsService, 'get'>>;

  let mockSessionCreate: jest.Mock;
  let mockConstructEvent: jest.Mock;

  const makePurchasable = (overrides: Record<string, unknown> = {}) => ({
    id: 'p-1',
    nanoId: 'nano1234',
    titleEn: 'Nice Painting',
    titleFi: 'Hieno Maalaus',
    infoEn: 'A great piece of art.',
    infoFi: 'Hienoa taidetta.',
    currentPrice: 250,
    quantity: 1,
    images: [{ desktopUrl: 'https://cdn.example.com/image.jpg' }],
    ...overrides,
  });

  beforeEach(async () => {
    jest.clearAllMocks();

    mockSessionCreate = jest.fn();
    mockConstructEvent = jest.fn();

    (Stripe as unknown as jest.Mock).mockImplementation(() => ({
      checkout: { sessions: { create: mockSessionCreate } },
      webhooks: { constructEvent: mockConstructEvent },
    }));

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StripePaymentService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string, fallback?: unknown) => {
              const values: Record<string, string> = {
                STRIPE_SECRET_KEY: 'sk_test_fake',
                FRONTEND_URL: 'http://localhost:5173',
              };
              return values[key] ?? fallback;
            }),
            getOrThrow: jest.fn((key: string) => {
              const values: Record<string, string> = {
                STRIPE_SECRET_KEY: 'sk_test_fake',
                STRIPE_WEBHOOK_SECRET: 'whsec_fake',
                MAIL_SEND_TO_ADDRESS: 'owner@example.com',
              };
              if (!values[key]) throw new Error(`Missing env var: ${key}`);
              return values[key];
            }),
          },
        },
        {
          provide: PurchasableService,
          useValue: {
            findByNanoId: jest.fn(),
            decrementQuantity: jest.fn(),
          },
        },
        {
          provide: MailerService,
          useValue: { sendRawEmail: jest.fn() },
        },
        {
          provide: SettingsService,
          useValue: { get: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<StripePaymentService>(StripePaymentService);
    purchasableService = module.get(PurchasableService);
    mailerService = module.get(MailerService);
    settingsService = module.get(SettingsService);
  });

  describe('createCheckoutSession', () => {
    it('throws ForbiddenException when the client IP is from a blocked country', async () => {
      settingsService.get.mockResolvedValue(['FI']);
      (geoip.lookup as jest.Mock).mockReturnValue({ country: 'US' });
      purchasableService.findByNanoId.mockResolvedValue(
        makePurchasable() as any,
      );

      await expect(
        service.createCheckoutSession('nano1234', 'en', '1.2.3.4'),
      ).rejects.toThrow(ForbiddenException);
    });

    it('proceeds when client IP is from an allowed country', async () => {
      settingsService.get.mockResolvedValue(['FI']);
      (geoip.lookup as jest.Mock).mockReturnValue({ country: 'FI' });
      purchasableService.findByNanoId.mockResolvedValue(
        makePurchasable() as any,
      );
      mockSessionCreate.mockResolvedValue({
        url: 'https://checkout.stripe.com/pay/cs_test',
      });

      const result = await service.createCheckoutSession(
        'nano1234',
        'en',
        '195.148.127.1',
      );
      expect(result).toBe('https://checkout.stripe.com/pay/cs_test');
    });

    it('throws UnprocessableEntityException when item is out of stock', async () => {
      settingsService.get.mockResolvedValue(['FI']);
      purchasableService.findByNanoId.mockResolvedValue(
        makePurchasable({ quantity: 0 }) as any,
      );

      await expect(service.createCheckoutSession('nano1234')).rejects.toThrow(
        UnprocessableEntityException,
      );
    });

    it('creates a Stripe checkout session and returns its URL', async () => {
      settingsService.get.mockResolvedValue(['FI']);
      purchasableService.findByNanoId.mockResolvedValue(
        makePurchasable() as any,
      );
      mockSessionCreate.mockResolvedValue({
        url: 'https://checkout.stripe.com/pay/cs_test',
      });

      const url = await service.createCheckoutSession('nano1234');

      expect(mockSessionCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          mode: 'payment',
          metadata: { nanoId: 'nano1234' },
        }),
      );
      expect(url).toBe('https://checkout.stripe.com/pay/cs_test');
    });

    it('uses Finnish locale and title when locale is fi', async () => {
      settingsService.get.mockResolvedValue(['FI']);
      purchasableService.findByNanoId.mockResolvedValue(
        makePurchasable() as any,
      );
      mockSessionCreate.mockResolvedValue({
        url: 'https://checkout.stripe.com/pay/cs_fi',
      });

      await service.createCheckoutSession('nano1234', 'fi');

      /* eslint-disable @typescript-eslint/no-unsafe-assignment */
      expect(mockSessionCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          locale: 'fi',
          line_items: expect.arrayContaining([
            expect.objectContaining({
              price_data: expect.objectContaining({
                product_data: expect.objectContaining({
                  name: 'Hieno Maalaus',
                }),
              }),
            }),
          ]),
        }),
      );
      /* eslint-enable @typescript-eslint/no-unsafe-assignment */
    });

    it('truncates description to 150 chars with ellipsis when too long', async () => {
      const longDesc = 'A'.repeat(200);
      settingsService.get.mockResolvedValue(['FI']);
      purchasableService.findByNanoId.mockResolvedValue(
        makePurchasable({ infoEn: longDesc }) as any,
      );
      mockSessionCreate.mockResolvedValue({
        url: 'https://checkout.stripe.com/pay/cs_test',
      });

      await service.createCheckoutSession('nano1234', 'en');

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const callArgs = mockSessionCreate.mock.calls[0][0] as Record<
        string,
        unknown
      >;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const desc = (callArgs['line_items'] as any[])[0].price_data.product_data
        .description as string;
      expect(desc).toHaveLength(151); // 150 chars + '…'
      expect(desc.endsWith('…')).toBe(true);
    });

    it('skips geo check when no client IP is provided', async () => {
      settingsService.get.mockResolvedValue(['FI']);
      purchasableService.findByNanoId.mockResolvedValue(
        makePurchasable() as any,
      );
      mockSessionCreate.mockResolvedValue({
        url: 'https://checkout.stripe.com/pay/cs_test',
      });

      await expect(
        service.createCheckoutSession('nano1234'),
      ).resolves.not.toThrow();
      expect(geoip.lookup).not.toHaveBeenCalled();
    });
  });

  describe('handleWebhook', () => {
    it('throws BadRequestException when the webhook signature is invalid', async () => {
      mockConstructEvent.mockImplementation(() => {
        throw new Error('invalid signature');
      });

      await expect(
        service.handleWebhook(Buffer.from('body'), 'bad-sig'),
      ).rejects.toThrow(BadRequestException);
    });

    it('returns without action for non-checkout.session.completed events', async () => {
      mockConstructEvent.mockReturnValue({
        type: 'payment_intent.created',
        data: { object: {} },
      });

      await expect(
        service.handleWebhook(Buffer.from('body'), 'sig'),
      ).resolves.toBeUndefined();
      expect(purchasableService.decrementQuantity).not.toHaveBeenCalled();
    });

    it('returns without action when the session has no nanoId metadata', async () => {
      mockConstructEvent.mockReturnValue({
        type: 'checkout.session.completed',
        data: {
          object: {
            metadata: {},
            customer_details: {},
            shipping_details: {},
            amount_total: 25000,
          },
        },
      });

      await expect(
        service.handleWebhook(Buffer.from('body'), 'sig'),
      ).resolves.toBeUndefined();
      expect(purchasableService.decrementQuantity).not.toHaveBeenCalled();
    });

    it('decrements quantity and sends an order email on successful checkout', async () => {
      const session = {
        metadata: { nanoId: 'nano1234' },
        customer_details: { name: 'Jane Doe', email: 'jane@example.com' },
        shipping_details: {
          name: 'Jane Doe',
          address: {
            line1: 'Mannerheimintie 1',
            line2: null,
            postal_code: '00100',
            city: 'Helsinki',
            country: 'FI',
          },
        },
        amount_total: 25000,
      };
      mockConstructEvent.mockReturnValue({
        type: 'checkout.session.completed',
        data: { object: session },
      });
      purchasableService.findByNanoId.mockResolvedValue(
        makePurchasable() as any,
      );
      purchasableService.decrementQuantity.mockResolvedValue(undefined);
      mailerService.sendRawEmail.mockResolvedValue(undefined);

      await service.handleWebhook(Buffer.from('body'), 'sig');

      expect(purchasableService.decrementQuantity).toHaveBeenCalledWith(
        'nano1234',
      );
      /* eslint-disable @typescript-eslint/no-unsafe-assignment */
      expect(mailerService.sendRawEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: 'owner@example.com',
          subject: expect.stringContaining('Nice Painting'),
        }),
      );
      /* eslint-enable @typescript-eslint/no-unsafe-assignment */
    });
  });
});
