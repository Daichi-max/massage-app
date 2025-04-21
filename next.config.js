/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  // srcディレクトリをソースディレクトリとして指定
  dir: './src',
}

module.exports = nextConfig 