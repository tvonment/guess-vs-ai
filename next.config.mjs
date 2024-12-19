import withPWA from 'next-pwa';
import runtimeCaching from 'next-pwa/cache.js';

/** @type {import('next').NextConfig} */
const nextConfig = {};

export default withPWA({
    dest: 'public', // Directory for service worker and cached files
    register: true, // Automatically register the service worker
    skipWaiting: true, // Activate the new service worker immediately
    runtimeCaching: [
        ...runtimeCaching,
        {
            urlPattern: /^https?.*/,
            handler: 'NetworkFirst',
            options: {
                cacheName: 'offline-html',
                networkTimeoutSeconds: 10,
                expiration: {
                    maxEntries: 1,
                },
                cacheableResponse: {
                    statuses: [0, 200],
                },
                fallbackTo: '/offline.html',
            },
        },
        {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif)$/,
            handler: 'CacheFirst',
            options: {
                cacheName: 'images',
                expiration: {
                    maxEntries: 60,
                    maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
                },
            },
        },
    ],
})(nextConfig);
