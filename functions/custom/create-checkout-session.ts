import { Request, Response } from 'express';
import { sdk } from 'functions/_utils/graphql-client';
import { stripe } from 'functions/_utils/stripe';
import { getURL } from 'utils/helpers';

import { allowCors, getUser } from '../_utils/helpers';

const handler = async (req: Request, res: Response) => {
  console.log('create-checkout-session called');
  console.log(req.body);
  console.log(req.query);
  console.log(req.headers);

  // CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Access-Control-Allow-Methods', '*');

  // handle CORS
  if (req.method === 'OPTIONS') {
    console.log('request is OPTIONS, allow all');
    return res.status(204).send();
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).send('Method Not Allowed');
  }

  const authenticatedUser = getUser(req);

  if (!authenticatedUser) {
    return res.status(401).json({ error: 'Unauthorized 1' });
  }

  const { priceId } = req.body as any;

  try {
    const { user } = await sdk.getUser({ id: authenticatedUser.id });

    // make sure that users can only have one subscription at a time.
    if (user?.profile?.stripeCustomer.subscriptions.data.length) {
      return res.status(400).json({ error: 'User already have a subscription' });
    }

    if (!user?.profile?.stripeCustomerId) {
      return res.status(400).json({ error: 'User does not have a customer id' });
    }

    const session = await stripe.checkout.sessions.create({
      allow_promotion_codes: true,
      billing_address_collection: 'required',
      cancel_url: `https://nextjs-stripe-starter-template.vercel.app/`,
      customer: user.profile.stripeCustomerId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      payment_method_types: ['card'],
      subscription_data: {
        trial_from_plan: true,
      },
      success_url: `https://nextjs-stripe-starter-template.vercel.app/account`,
    });

    return res.status(200).json({ sessionId: session.id, sessionUrl: session.url });
  } catch (err: any) {
    console.log(err);
    res.status(500).json({ error: { message: err.message, statusCode: 500 } });
  }
};

export default handler;
