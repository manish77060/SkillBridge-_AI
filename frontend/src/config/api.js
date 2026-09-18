/**
 * SkillBridge AI — API Client Configuration
 * 
 * Automatically resolves the backend API URL across development and production.
 * Set VITE_API_URL or VITE_API_BASE_URL in your deployment platform (e.g. Vercel)
 * to point to your deployed backend (e.g. https://skillbridge-backend.onrender.com).
 */

const getRawUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL;
  if (envUrl && typeof envUrl === "string" && envUrl.trim()) {
    return envUrl.trim().replace(/\/+$/, "");
  }
  return "http://127.0.0.1:8000";
};

const raw = getRawUrl();

// Base URL without trailing /api
export const API_BASE_URL = raw.endsWith("/api") ? raw.slice(0, -4) : raw;

// API URL always ending with /api
export const API_URL = `${API_BASE_URL}/api`;

// Swagger / OpenAPI documentation URL
export const DOCS_URL = `${API_BASE_URL}/docs`;

export default {
  API_BASE_URL,
  API_URL,
  DOCS_URL,
};
