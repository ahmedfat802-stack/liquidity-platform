/** @type {import('next').NextConfig} */
const nextConfig = {
  // تفعيل الـ Strict Mode للكشف عن المشاكل في التطوير
  reactStrictMode: true,

  // دعم الـ RTL للعربية
  i18n: {
    locales: ['ar', 'en'],
    defaultLocale: 'ar',
  },

  // تحسينات الأداء
  swcMinify: true,

  // السماح بـ Experimental Features
  experimental: {
    optimizePackageImports: ['@radix-ui/react-icons'],
  },
}

module.exports = nextConfig
