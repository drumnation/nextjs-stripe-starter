import { Request, Response } from 'express';
import { sdk } from 'functions/_utils/graphql-client';

import { stripe } from '../_utils/stripe';

type NhostRequest = Request & {
  rawBody: string;
};

export default async function handler(req: NhostRequest, res: Response) {
  const sig = req.headers['stripe-signature'] as string;
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);
  } catch (err: any) {
    console.log(`⚠️  Webhook signature verification failed.`);
    console.log(err);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (!event) {
    console.log('no event found');
    console.log(event);
    return res.status(400).send('No event');
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      console.log('checkout session completed!');
      break;
    }
    case 'customer.subscription.created': {
      const { object } = event.data as any;

      // const subscriptionId = object.id;
      const customerId = object.customer;
      const priceId = object.items.data[0].price.id;

      // get plan id from priceId
      const { plans } = await sdk.getPlans({
        where: {
          stripePriceId: {
            _eq: priceId,
          },
        },
      });

      const plan = plans[0];

      if (!plan) {
        console.log('no plan found');
        return res.status(400).send('No plan found');
      }

      // update profile with new stripe subscription id
      await sdk.UpdateProfileUsingStripeCustomerId({
        profile: {
          plan_id: plan.id,
        },
        stripeCustomerId: customerId,
      });

      break;
    }
    case 'customer.subscription.deleted': {
      const { object } = event.data as any;
      console.log('customer.subscription.deleted');

      const customerId = object.customer;
      const priceId = object.items.data[0].price.id;

      // remove plan_id for profile
      await sdk.UpdateProfileUsingStripeCustomerId({
        profile: {
          plan_id: null,
        },
        stripeCustomerId: customerId,
      });
      break;
    }
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
}
