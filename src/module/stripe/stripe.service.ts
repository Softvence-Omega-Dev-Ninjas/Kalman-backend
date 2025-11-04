import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import Stripe from 'stripe';
import { PrismaService } from '../prisma/prisma.service';
// import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(private readonly prisma: PrismaService) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  }

  // 🔹 Create Stripe Customer
  async createCustomer(email: string, name?: string) {
    return await this.stripe.customers.create({
      email,
      name,
    });
  }

  // 🔹 Charge an existing customer
  async chargeCustomer(customerId: string, amount: number, currency = 'usd') {
    return await this.stripe.paymentIntents.create({
      amount: amount * 100, // convert dollars to cents
      currency,
      customer: customerId,
      automatic_payment_methods: { enabled: true },
    });
  }

  // 🔹 Create Express Connected Account
  async createConnectedAccount(email: string) {
    return await this.stripe.accounts.create({
      type: 'express',
      email,
      capabilities: {
        transfers: { requested: true },
      },
    });
  }

  // 🔹 Generate Onboarding Link
  async createOnboardingLink(accountId: string) {
    const link = await this.stripe.accountLinks.create({
      account: accountId,
      refresh_url: `${process.env.CLIENT_URL}/reauth`,
      return_url: `${process.env.CLIENT_URL}/onboarding-success`,
      type: 'account_onboarding',
    });
    return link.url;
  }

  // 🔹 Generate Login Link (for already connected accounts)
  async createLoginLink(stripeConnectId: string) {
    try {
      const loginLink =
        await this.stripe.accounts.createLoginLink(stripeConnectId);
      return loginLink;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Failed to generate Stripe login link');
    }
  }

  // 🔹 Retrieve Account Balance
  async getBalance(accountId: string) {
    return await this.stripe.balance.retrieve({
      stripeAccount: accountId,
    });
  }

  async transferShortlistedAmount(
    amount: number,
    tradesmanStripeId: string,
    // adminStripeId: string,
  ) {
    const transfer = await this.stripe.transfers.create(
      {
        amount: amount * 100, // convert USD to cents
        currency: 'usd',
        destination: 'acct_1SFetsRrkAG59FVV',
      },
      { stripeAccount: tradesmanStripeId },
    );
    return transfer;
  }

  // 🔹 Customer Payment → Split to Tradesman + Admin Fee
  async createPaymentIntent(amount: number, tradesmanAccountId: string) {
    return await this.stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      application_fee_amount: Math.floor(amount * 0.2), // 20% admin fee
      transfer_data: {
        destination: tradesmanAccountId, // tradesman’s connected account
      },
    });
  }

  // 🔹 Check if a Tradesman is fully verified on Stripe
  async isTradesmanVerified(stripeConnectId: string): Promise<boolean> {
    try {
      const account = await this.stripe.accounts.retrieve(stripeConnectId);
      return (
        account?.requirements?.disabled_reason === null &&
        account?.capabilities?.transfers === 'active'
      );
    } catch (error) {
      console.error('Error checking Stripe verification:', error);
      return false;
    }
  }

  // 🔹 Ensure Tradesman has completed Stripe onboarding before proceeding
  async ensureTradesmanVerified(tradesmanId: string) {
    const tradesman = await this.prisma.tradesMan.findUnique({
      where: { id: tradesmanId },
    });

    if (!tradesman) {
      throw new HttpException('Tradesman not found', HttpStatus.NOT_FOUND);
    }

    const isVerified = await this.isTradesmanVerified(
      tradesman.stripeConnectId,
    );

    if (!isVerified) {
      const onboardingUrl = await this.createOnboardingLink(
        tradesman.stripeConnectId,
      );

      throw new HttpException(
        {
          message:
            'You must complete your Stripe verification to continue. Redirecting to onboarding.',
          onboardingUrl,
        },
        HttpStatus.FORBIDDEN,
      );
    }

    return tradesman;
  }

  async addBalance(tradesmanStripeAccountId: string) {
    const amountUsd = 10000; // $10,000
    const amountCents = amountUsd * 100; // Stripe amounts are in cents

    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: amountCents,
      currency: 'usd',

      payment_method_types: ['card'],
      payment_method: 'pm_card_visa', // test payment method
      confirm: true,
      transfer_data: {
        destination: tradesmanStripeAccountId, // connected account
      },
    });
    return paymentIntent;
  }
}
