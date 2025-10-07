import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimize filesystem performance
  experimental: {
    // Enable turbopack for faster builds (already using via CLI)
    turbo: {
      // Optimize file watching
      resolveAlias: {
        // Add any custom aliases here if needed
      },
    },
    // Optimize bundling
    optimizePackageImports: [
      '@radix-ui/react-alert-dialog',
      '@radix-ui/react-avatar',
      '@radix-ui/react-checkbox',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-label',
      '@radix-ui/react-progress',
      '@radix-ui/react-select',
      '@radix-ui/react-separator',
      '@radix-ui/react-slot',
      '@radix-ui/react-tabs',
      '@radix-ui/react-tooltip',
      'lucide-react',
    ],
  },

  // Performance optimizations
  compiler: {
    // Remove console logs in production
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Webpack optimizations for development
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      // Optimize file watching for development
      config.watchOptions = {
        poll: 1000, // Check for changes every second
        aggregateTimeout: 300, // Delay before rebuilding
        ignored: [
          '**/node_modules/**',
          '**/.git/**',
          '**/.next/**',
          '**/convex/_generated/**',
        ],
      };

      // Reduce the number of files webpack watches
      config.snapshot = {
        managedPaths: [/^(.+?[\/]node_modules[\/])/],
        immutablePaths: [],
        buildDependencies: {
          hash: true,
          timestamp: true,
        },
        module: {
          timestamp: true,
        },
        resolve: {
          timestamp: true,
        },
        resolveBuildDependencies: {
          hash: true,
          timestamp: true,
        },
      };
    }

    return config;
  },

  // Output configuration
  output: 'standalone',

  // Disable source maps in development for faster builds
  productionBrowserSourceMaps: false,
};

export default nextConfig;
