import { NhostClient } from '@nhost/nextjs';

const nhost = new NhostClient({
  region: process.env.NEXT_PUBLIC_NHOST_REGION,
  subdomain: process.env.NEXT_PUBLIC_NHOST_SUBDOMAIN,
});

export { nhost };
