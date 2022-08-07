const path = require('path');
require("dotenv").config();
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [`${process.env.S3_BUCKET_NAME}.s3.amazonaws.com`],
  },
}

module.exports = nextConfig
