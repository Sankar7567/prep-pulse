/**
 * Capacitor packages the statically rendered UI. Next's API endpoints remain
 * in source and are omitted from this build by its extension filter; the normal
 * web build retains TypeScript route handlers and server features.
 */
const isCapacitorBuild = process.env.CAPACITOR_STATIC === '1';

/** @type {import('next').NextConfig} */
const nextConfig = {
  ...(isCapacitorBuild ? {
    output: 'export',
    trailingSlash: true,
    images: { unoptimized: true },
    pageExtensions: ['tsx', 'jsx']
  } : {}),
  poweredByHeader: false,
  reactStrictMode: true
};

module.exports = nextConfig;
