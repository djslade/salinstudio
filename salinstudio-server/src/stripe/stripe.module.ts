import { Module } from '@nestjs/common';
import { StripeController } from './stripe.controller';
import { StripePaymentService } from './stripe.service';
import { PurchasableModule } from '../purchasable/purchasable.module';
import { MailerModule } from '../mailer/mailer.module';
import { SettingsModule } from '../settings/settings.module';

@Module({
  imports: [PurchasableModule, MailerModule, SettingsModule],
  controllers: [StripeController],
  providers: [StripePaymentService],
})
export class StripePaymentModule {}
