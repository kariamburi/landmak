// next.config.mjs
import nextPwa from 'next-pwa';

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['utfs.io', 'img.clerk.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'utfs.io',
        port: ''
      }
    ]
  },
  // Add additional PWA configuration if needed
  // You can pass options here too, like register, skipWaiting, etc.
};

export default nextPwa({
  dest: 'public',
  register: true,
  skipWaiting: true,
})(nextConfig);

