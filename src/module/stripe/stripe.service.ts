// src/modules/stripe/stripe.service.ts
import { Injectable } from '@nestjs/common';
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
}
