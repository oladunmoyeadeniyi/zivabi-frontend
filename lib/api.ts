import axios from 'axios';

// Base URL for the NestJS backend API.
// In development you can run the backend on http://localhost:3000
// and set NEXT_PUBLIC_API_BASE accordingly.

const baseURL = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3000';

export const api = axios.create({
  baseURL,
  timeout: 20000
});
