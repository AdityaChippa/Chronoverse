/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['api.nasa.gov', 'images-assets.nasa.gov', 'apod.nasa.gov'],
  },
  webpack: (config) => {
    config.externals = [...config.externals, { canvas: 'canvas' }];
    return config;
  },
  // Removed experimental.serverActions as it's deprecated
}

module.exports = nextConfig