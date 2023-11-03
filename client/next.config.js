/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_ZEGO_APP_ID: 1048409252,
    NEXT_PUBLIC_ZEGO_SERVER_ID: "78da9ecc38800277e972bf25dc996834",
  },
  reactStrictMode: false,
  images: {
    domains: ["localhost"],
  },
};

module.exports = nextConfig;
