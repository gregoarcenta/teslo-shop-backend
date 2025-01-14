import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { PaymentSessionDto } from './dto/payment-session.dto';
import { TokenSessionDto } from './dto/token-session.dto';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Order } from '../orders/entities';
import { HandlerException } from '../common/exceptions/handler.exception';

describe('PaymentsController', () => {
  let controller: PaymentsController;
  let paymentsService: PaymentsService;

  const mockOrderRepository = {
    findOneBy: jest.fn().mockResolvedValue(true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentsController],
      providers: [
        HandlerException,
        {
          provide: getRepositoryToken(Order),
          useValue: mockOrderRepository,
        },
        {
          provide: PaymentsService,
          useValue: {
            createPaymentSession: jest.fn(),
            handleStripeWebhook: jest.fn(),
            validateToken: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<PaymentsController>(PaymentsController);
    paymentsService = module.get<PaymentsService>(PaymentsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a payment session', () => {
    const paymentSessionDto: PaymentSessionDto = {
      orderId: 'order-ID',
    };
    controller.createPaymentSession(paymentSessionDto);
    expect(paymentsService.createPaymentSession).toHaveBeenCalledWith(
      paymentSessionDto,
    );
  });

  it('should handle Stripe webhook', async () => {
    const payload = {};
    const signature = 'stripe-signature';
    await controller.handleStripeWebhook(payload, signature);
    expect(paymentsService.handleStripeWebhook).toHaveBeenCalledWith(
      payload,
      signature,
    );
  });

  it('should validate token session', async () => {
    const tokenSessionDto: TokenSessionDto = {
      token: 'token-session',
    };
    await controller.validateTokenSession(tokenSessionDto);
    expect(paymentsService.validateToken).toHaveBeenCalledWith(tokenSessionDto);
  });
});
