/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      net: false,
      tls: false,
      fs: false,
    };
    return config;
  },
  experimental: {
    esmExternals: 'loose',
  },
  reactStrictMode: true,
};

export default nextConfig;
