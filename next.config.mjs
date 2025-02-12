import withPWA from 'next-pwa';

const nextConfig = {
  reactStrictMode: false,
  // compiler: {
  //   removeConsole: true, // Removes all console logs in production
  // },
  experimental: {
    outputFileTracingIncludes: {
      '/api/**/*': ['./node_modules/**/*.wasm', './node_modules/**/*.proto'],
    },
  },
  webpack(config, { isServer }) {
    // Custom Webpack configuration can go here if needed
    return config;
  },
};

export default withPWA({
  dest: 'public', // Store service worker and manifest in the public folder
  register: true, // Auto-register service worker
  skipWaiting: true, // Activate new service worker immediately
})(nextConfig);
