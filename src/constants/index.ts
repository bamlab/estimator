export const ROOT_URL = process.env.NEXT_PUBLIC_VERCEL_URL
  ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}/api`
  : process.env.NEXT_PUBLIC_API_URL;
