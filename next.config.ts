import withPWA from 'next-pwa';

export default withPWA({
    dest: 'public',
    register: true,
    skipWaiting: true,
    runtimeCaching: [
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
                precacheFallback: {
                    fallbackURL: '/offline',
                },
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
})({});