// src/modules/stripe/stripe.service.ts
import { BadRequestException, Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2025-09-30.clover',
    });
  }

  async createCustomer(email: string, name?: string) {
    return await this.stripe.customers.create({
      email,
      name,
    });
  }

  async chargeCustomer(customerId: string, amount: number, currency = 'usd') {
    return await this.stripe.paymentIntents.create({
      amount: amount * 100, // convert dollars to cents
      currency,
      customer: customerId,
      automatic_payment_methods: { enabled: true },
    });
  }

  // 1️⃣ Create Express Connected Account
  async createConnectedAccount(email: string) {
    return await this.stripe.accounts.create({
      type: 'express',
      email,
      capabilities: {
        transfers: { requested: true },
      },
    });
  }

  // 2️⃣ Generate Onboarding Link
  async createOnboardingLink(accountId: string) {
    const link = await this.stripe.accountLinks.create({
      account: accountId,
      refresh_url: `${process.env.CLIENT_URL}/reauth`,
      return_url: `${process.env.CLIENT_URL}/onboarding-success`,
      type: 'account_onboarding',
    });
    return link.url;
  }

  // stripe.service.ts
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

  // 3️⃣ Check Account Balance
  async getBalance(accountId: string) {
    return await this.stripe.balance.retrieve({
      stripeAccount: accountId,
    });
  }

  // 4️⃣ Customer Payment → Split to Tradesman + Admin Fee
  async createPaymentIntent(amount: number, tradesmanAccountId: string) {
    // amount in cents (e.g. $100 = 10000)
    return await this.stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      application_fee_amount: Math.floor(amount * 0.2), // 20% admin fee
      transfer_data: {
        destination: tradesmanAccountId, // tradesman’s connected account
      },
    });
  }
}
