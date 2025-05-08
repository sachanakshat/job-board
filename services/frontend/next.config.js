/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Add a rule to handle the undici module
    config.module.rules.push({
      test: /node_modules\/undici/,
      use: 'ignore-loader'
    });

    return config;
  }
};

module.exports = nextConfig; 