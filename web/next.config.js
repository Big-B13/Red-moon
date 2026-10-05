/** @type {import('next').NextConfig} */
const nextConfig = {
  // Exports to plain static files (out/) so Red Moon can live on
  // GitHub Pages or Firebase Hosting — no Node server required.
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
};

module.exports = nextConfig;
