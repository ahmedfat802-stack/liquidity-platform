/** @type {import('next').NextConfig} */
const nextConfig = {
  // تفعيل الـ Strict Mode للكشف عن المشاكل في التطوير
  reactStrictMode: true,

  // تحسينات الأداء
  experimental: {
    optimizePackageImports: ['@radix-ui/react-icons'],
  },
}

module.exports = nextConfig
