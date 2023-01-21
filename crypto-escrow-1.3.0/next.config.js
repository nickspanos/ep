/**
 * Don't be scared of the generics here.
 * All they do is to give us autocompletion when using this.
 *
 * @template {import('next').NextConfig} T
 * @param {T} config - A generic parameter that flows through to the return type
 * @constraint {{import('next').NextConfig}}
 */
/**
 * @link https://nextjs.org/docs/api-reference/next.config.js/introduction
 */
module.exports = {
  reactStrictMode: true,
  images: {
    domains: ['i.pravatar.cc'],
  },
  experimental: {
    images: {
      allowFutureImage: true,
    },
  },
};
