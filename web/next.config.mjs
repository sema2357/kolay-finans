/** @type {import('next').NextConfig} */
const nextConfig = {
  // Tarayıcıdan /api/* çağrıları (ileride LLM/ses uçları) FastAPI'ye yönlenir.
  async rewrites() {
    const api = process.env.API_INTERNAL_URL ?? "http://localhost:8000";
    return [{ source: "/api/:path*", destination: `${api}/api/:path*` }];
  },
};

export default nextConfig;
