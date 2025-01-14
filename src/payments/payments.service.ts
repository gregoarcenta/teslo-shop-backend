import { BadRequestException, Injectable } from '@nestjs/common';
import { PaymentSessionDto } from './dto/payment-session.dto';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { OrdersService } from '../orders/orders.service';
import { OrderStatus } from '../orders/enums/order-status';
import { JwtService } from '@nestjs/jwt';
import { TokenSessionDto } from './dto/token-session.dto';

@Injectable()
export class PaymentsService {
  private readonly stripeApiKey: string;
  private readonly stripeEpSecret: string;
  private readonly tokenSecret: string;
  private readonly urlSuccess: string;
  private readonly urlCancel: string;
  private readonly stripe: Stripe;

  constructor(
    private readonly configService: ConfigService,
    private readonly ordersService: OrdersService,
    private readonly jwtService: JwtService,
  ) {
    this.stripeApiKey = this.configService.get<string>('STRIPE_API_SECRET');
    this.stripeEpSecret = this.configService.get<string>('STRIPE_EP_SECRET');
    this.tokenSecret = this.configService.get<string>('STRIPE_TOKEN_SECRET');
    this.urlSuccess = this.configService.get<string>('STRIPE_URL_SUCCESS');
    this.urlCancel = this.configService.get<string>('STRIPE_URL_CANCEL');
    this.stripe = new Stripe(this.stripeApiKey);
  }

  async createPaymentSession(createPaymentDto: PaymentSessionDto) {
    const order = await this.ordersService.findOne(createPaymentDto.orderId);

    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestException(
        `Error to create payment session with order ID: ${order.id} doesn't have pending status - actual status: ${order.status}`,
      );
    }

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

    const token = await this.jwtService.signAsync(
      { orderId: order.id },
      { expiresIn: '30m', secret: this.tokenSecret },
    );

    return await this.stripe.checkout.sessions.create({
      metadata: { orderId: order.id },
      customer_email: order.userEmail,
      payment_intent_data: { metadata: { orderId: order.id } },
      line_items,
      mode: 'payment',
      expires_at: Math.floor(Date.now() / 1000) + 60 * 30,
      success_url: `${this.urlSuccess}?token=${token}`,
      cancel_url: `${this.urlCancel}?token=${token}`,
    });
  }

  async handleStripeWebhook(payload: any, signature: string) {
    try {
      const event = this.stripe.webhooks.constructEvent(
        payload,
        signature,
        this.stripeEpSecret,
      );

      const orderId = event.data.object['metadata'].orderId;
      // const orderId = '235bae9b-0ab5-426e-918e-c11b805d14cb';
      switch (event.type) {
        case 'checkout.session.completed':
          console.log(`session completed - Order: ${orderId}`);
          await this.ordersService.successOrder(orderId);
          break;
        case 'checkout.session.expired':
          console.log(`session cancelled - Order: ${orderId}`);
          await this.ordersService.cancelOrder(orderId);
          break;
        default:
          console.log(`Unhandled event type ${event.type}`);
      }

      return { received: true };
    } catch (err) {
      console.error(`Error processing webhook: ${err.message}`);
      throw new BadRequestException('Webhook Error');
    }
  }

  async validateToken(tokenSessionDto: TokenSessionDto): Promise<boolean> {
    try {
      await this.jwtService.verifyAsync(tokenSessionDto.token, {
        secret: this.tokenSecret,
      });
      return true;
    } catch (err) {
      return false;
    }
  }

  success() {
    return `This action success`;
  }

  cancel() {
    return `This action cancel`;
  }
}
