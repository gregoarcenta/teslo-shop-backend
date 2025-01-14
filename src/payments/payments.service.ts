import { BadRequestException, Injectable } from '@nestjs/common';
import { PaymentSessionDto } from './dto/payment-session.dto';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { OrdersService } from '../orders/orders.service';
import { OrderStatus } from '../orders/enums/order-status';

@Injectable()
export class PaymentsService {
  private readonly stripeApiKey: string;
  private readonly stripe: Stripe;

  private EpSecret =
    'whsec_61cf04f81dea1d54795d5c7ebb06afd4e64b781644e45c8092dca73b6d6ccfc0';

  constructor(
    private readonly configService: ConfigService,
    private readonly ordersService: OrdersService,
  ) {
    this.stripeApiKey = this.configService.get<string>('STRIPE_SECRET');
    this.stripe = new Stripe(this.stripeApiKey);
  }

  async createPaymentSession(createPaymentDto: PaymentSessionDto) {
    const order = await this.ordersService.findOne(createPaymentDto.orderId);

    const line_items =
      order.items.map<Stripe.Checkout.SessionCreateParams.LineItem>((item) => ({
        price_data: {
          currency: 'USD',
          product_data: {
            name: item.product.title,
          },
          unit_amount: Math.round(+item.price * 100),
        },
        quantity: item.quantity,
      }));

    return await this.stripe.checkout.sessions.create({
      metadata: { orderId: order.id },
      customer_email: order.userEmail,
      payment_intent_data: { metadata: { orderId: order.id } },
      line_items,
      mode: 'payment',
      expires_at: Math.floor(Date.now() / 1000) + 60 * 30,
      success_url: 'http://localhost:3000/api/payments/success',
      cancel_url: 'http://localhost:3000/api/payments/cancel',
    });
  }

  async handleStripeWebhook(payload: any, signature: string) {
    try {
      const event = this.stripe.webhooks.constructEvent(
        payload,
        signature,
        this.EpSecret,
      );

      let orderId: string;

      switch (event.type) {
        case 'checkout.session.completed':
          console.log('session completed');
          orderId = event.data.object.metadata.orderId;
          await this.ordersService.update(orderId, {
            status: OrderStatus.DELIVERED,
          });
          break;
        case 'checkout.session.expired':
          console.log('session expired');
          orderId = event.data.object.metadata.orderId;
          await this.ordersService.cancelOrder(orderId);
          break;
        default:
          console.log(`Unhandled event type ${event.type}`);
      }

      return { received: true };
    } catch (err) {
      console.log('error', err);
      console.error(`Error processing webhook: ${err.message}`);
      throw new BadRequestException('Webhook Error');
    }
  }

  success() {
    return `This action success`;
  }

  cancel() {
    return `This action cancel`;
  }
}
