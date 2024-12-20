import withPWA from 'next-pwa';

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
};

export default withPWA({
    dest: 'public', // Directory for service worker and cached files
    register: true, // Automatically register the service worker
    skipWaiting: true, // Activate the new service worker immediately

})(nextConfig);
