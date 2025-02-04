import withPWA from 'next-pwa';

const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['tesseract.js'],
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
