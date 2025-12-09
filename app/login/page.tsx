"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../../lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@zivabi.local');
  const [password, setPassword] = useState('ZivaBIAdmin123!');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      const { accessToken } = res.data;
      // Store token in localStorage for now; later we can improve this
      // with HTTP-only cookies or a more robust auth strategy.
      window.localStorage.setItem('zivabi_token', accessToken);
      router.push('/expense');
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message ?? 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <form
        onSubmit={onSubmit}
        className="bg-white shadow-sm rounded-lg px-6 py-5 w-full max-w-sm space-y-4 border border-slate-200"
      >
        <h1 className="text-lg font-semibold text-slate-900">Login to Ziva BI</h1>
        <div className="space-y-1">
          <label className="block text-sm text-slate-700" htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <label className="block text-sm text-slate-700" htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-brand text-white text-sm font-medium py-2 hover:bg-brand-dark disabled:opacity-60"
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}
