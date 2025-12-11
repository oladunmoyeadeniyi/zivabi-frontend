import axios from 'axios';

// Base URL for the NestJS backend API.
// Set NEXT_PUBLIC_API_URL in your environment.
// For Render deployment: https://zivabi-core-backend.onrender.com

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const api = axios.create({
  baseURL,
  timeout: 20000
});
