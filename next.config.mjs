/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['localhost'],
  },
  env: {
    JWT_SECRET: process.env.JWT_SECRET,
  },
}

module.exports = nextConfig
