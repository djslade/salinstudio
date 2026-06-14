import { Body, Controller, Headers, HttpCode, Post, Req } from '@nestjs/common';
import { StripePaymentService } from './stripe.service';
import { CreateCheckoutSessionDto } from './dtos/create-checkout-session.dto';
import { RawBodyRequest } from '@nestjs/common';
import { Request } from 'express';

@Controller('stripe')
export class StripeController {
  constructor(private stripePaymentService: StripePaymentService) {}

  @Post('checkout-session')
  async createCheckoutSession(
    @Body() body: CreateCheckoutSessionDto,
    @Req() req: RawBodyRequest<Request>,
  ) {
    const url = await this.stripePaymentService.createCheckoutSession(
      body.nanoId,
      body.locale,
      req.ip,
    );
    return { url };
  }

  @Post('webhook')
  @HttpCode(200)
  async handleWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('stripe-signature') signature: string,
  ) {
    await this.stripePaymentService.handleWebhook(req.rawBody, signature);
  }
}
