/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    config.resolve.alias.encoding = false;
    config.resolve.alias['pdfjs-dist'] = require.resolve('pdfjs-dist');
    config.externals.push('@react-pdf-viewer/core', '@react-pdf-viewer/default-layout', '@react-pdf-viewer/pdf-viewer',  "pino-pretty", "encoding");
    return config;
  },
}

module.exports = nextConfig
