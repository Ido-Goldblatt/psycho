/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    config.resolve.alias.encoding = false;
    config.resolve.alias['pdfjs-dist'] = require.resolve('pdfjs-dist');
    return config;
  },
}

module.exports = nextConfig
