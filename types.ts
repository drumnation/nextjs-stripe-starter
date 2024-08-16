import Stripe from 'stripe';

export interface PageMeta {
  cardImage: string;
  description: string;
  title: string;
}

export interface Customer {
  id: string /* primary key */;
  stripe_customer_id?: string;
}

export interface Product {
  active?: boolean;
  description?: string;
  id: string /* primary key */;
  image?: string;
  metadata?: Stripe.Metadata;
  name?: string;
}

export interface ProductWithPrice extends Product {
  prices?: Price[];
}

export interface UserDetails {
  avatar_url?: string;
  billing_address?: Stripe.Address;
  first_name: string;
  full_name?: string;
  id: string /* primary key */;
  last_name: string;
  payment_method?: Stripe.PaymentMethod[Stripe.PaymentMethod.Type];
}

export interface Price {
  active?: boolean;
  currency?: string;
  description?: string;
  id: string /* primary key */;
  interval?: Stripe.Price.Recurring.Interval;
  interval_count?: number;
  metadata?: Stripe.Metadata;
  product_id?: string /* foreign key to products.id */;
  products?: Product;
  trial_period_days?: number | null;
  type?: Stripe.Price.Type;
  unit_amount?: number;
}

export interface PriceWithProduct extends Price {}

export interface Subscription {
  cancel_at?: string;
  cancel_at_period_end?: boolean;
  canceled_at?: string;
  created: string;
  current_period_end: string;
  current_period_start: string;
  ended_at?: string;
  id: string /* primary key */;
  metadata?: Stripe.Metadata;
  price_id?: string /* foreign key to prices.id */;
  prices?: Price;
  quantity?: number;
  status?: Stripe.Subscription.Status;
  trial_end?: string;
  trial_start?: string;
  user_id: string;
}
