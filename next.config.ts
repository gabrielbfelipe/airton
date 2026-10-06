import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Há um package-lock.json no diretório do usuário; sem isto o Next elege
  // aquele diretório como raiz do workspace e avisa a cada build.
  outputFileTracingRoot: __dirname,
};

export default nextConfig;
