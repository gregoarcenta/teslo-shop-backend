import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsService } from './payments.service';
import { ConfigService } from '@nestjs/config';
import { OrdersService } from '../orders/orders.service';
import { JwtService } from '@nestjs/jwt';
import { PaymentSessionDto } from './dto/payment-session.dto';
import { TokenSessionDto } from './dto/token-session.dto';
import { BadRequestException } from '@nestjs/common';
import Stripe from 'stripe';

jest.mock('stripe', () => {
  const StripeMock = jest.fn().mockImplementation(() => ({
    checkout: {
      sessions: {
        create: jest.fn().mockResolvedValue({ id: 'session_id' }), // Mock explícito
      },
    },
    webhooks: {
      constructEvent: jest.fn().mockReturnValue({
        type: 'checkout.session.completed',
        data: {
          object: {
            metadata: { orderId: 'order1' },
          },
        },
      }), // Mock explícito
    },
  }));
  return {
    __esModule: true,
    default: StripeMock,
  };
});

describe('PaymentsService', () => {
  let service: PaymentsService;
  let configService: ConfigService;
  let ordersService: OrdersService;
  let jwtService: JwtService;
  let stripe: Stripe;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentsService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              switch (key) {
                case 'STRIPE_API_SECRET':
                  return 'test_api_secret';
                case 'STRIPE_EP_SECRET':
                  return 'test_ep_secret';
                case 'STRIPE_TOKEN_SECRET':
                  return 'test_token_secret';
                case 'STRIPE_URL_SUCCESS':
                  return 'http://example.com/success';
                case 'STRIPE_URL_CANCEL':
                  return 'http://example.com/cancel';
                default:
                  return null;
              }
            }),
          },
        },
        {
          provide: OrdersService,
          useValue: {
            findOne: jest.fn(),
            successOrder: jest.fn(),
            cancelOrder: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn().mockResolvedValue('test_token'),
            verifyAsync: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PaymentsService>(PaymentsService);
    configService = module.get<ConfigService>(ConfigService);
    ordersService = module.get<OrdersService>(OrdersService);
    jwtService = module.get<JwtService>(JwtService);
    stripe = new (jest.requireMock('stripe').default)();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createPaymentSession', () => {
    it('should create a payment session', async () => {
      const order = {
        id: 'order1',
        status: 'pending',
        items: [{ product: { title: 'Product 1' }, price: 100, quantity: 1 }],
        userEmail: 'test@example.com',
      };
      ordersService.findOne = jest.fn().mockResolvedValue(order);

      const createPaymentDto: PaymentSessionDto = { orderId: 'order1' };
      const result = await service.createPaymentSession(createPaymentDto);

      expect(result).toBeDefined();
      expect(result.id).toBe('session_id');
      expect(ordersService.findOne).toHaveBeenCalledWith('order1');
      expect(jwtService.signAsync).toHaveBeenCalled();
    });

    it('should throw BadRequestException if order status is not PENDING', async () => {
      const order = {
        id: 'order1',
        status: 'COMPLETED',
        items: [],
        userEmail: 'test@example.com',
      };
      ordersService.findOne = jest.fn().mockResolvedValue(order);

      const createPaymentDto: PaymentSessionDto = { orderId: 'order1' };

      await expect(
        service.createPaymentSession(createPaymentDto),
      ).rejects.toThrow(BadRequestException);
    });
  });

  it('should handle checkout.session.completed event', async () => {
    const payload = JSON.stringify({
      type: 'checkout.session.completed',
      data: {
        object: {
          metadata: { orderId: 'order1' },
        },
      },
    });
    const signature = 'test_signature';

    (stripe.webhooks.constructEvent as jest.Mock).mockReturnValue(
      JSON.parse(payload),
    );
    ordersService.successOrder = jest.fn();

    await service.handleStripeWebhook(payload, signature);

    expect(ordersService.successOrder).toHaveBeenCalledWith('order1');
  });

  describe('validateToken', () => {
    it('should return true for a valid token', async () => {
      jwtService.verifyAsync = jest.fn().mockResolvedValue(true);

      const tokenSessionDto: TokenSessionDto = { token: 'valid_token' };
      const result = await service.validateToken(tokenSessionDto);

      expect(result).toBe(true);
    });

    it('should return false for an invalid token', async () => {
      jwtService.verifyAsync = jest.fn().mockImplementation(() => {
        throw new Error('Invalid token');
      });

      const tokenSessionDto: TokenSessionDto = { token: 'invalid_token' };
      const result = await service.validateToken(tokenSessionDto);

      expect(result).toBe(false);
    });
  });
});
