export const SITE_NAME = 'ব্যাংকিং প্রশ্নব্যাংক'
export const SITE_DESCRIPTION =
  'AIIB, DIB, JIIB সহ ব্যাংকিং ডিপ্লোমা পরীক্ষার বিগত সালের প্রশ্ন ও উত্তরের PDF — বিষয় ও সাল অনুযায়ী সাজানো, বিনামূল্যে ডাউনলোড।'

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'http://localhost:3000')
).replace(/\/$/, '')
