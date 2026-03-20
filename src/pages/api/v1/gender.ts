import type { APIRoute } from "astro";

export const prerender = false;

const API_BASE = "https://gender.kianreiling.com";

export const GET: APIRoute = async ({ url }) => {
  const name = url.searchParams.get("name") || "";
  const res = await fetch(
    `${API_BASE}/api/v1/gender?name=${encodeURIComponent(name)}`
  );
  const data = await res.json();
  return new Response(JSON.stringify(data), {
    status: res.status,
    headers: { "Content-Type": "application/json" },
  });
};
