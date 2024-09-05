const isProd = process.env.NODE_ENV === 'production'

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  distDir: isProd ? 'docs' : '.next',
  assetPrefix: isProd ? '/three-exp-test/' : '',
}

export default nextConfig
