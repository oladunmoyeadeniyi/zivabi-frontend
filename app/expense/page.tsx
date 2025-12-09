"use client";

import React, { useEffect, useState } from 'react';
import { api } from '../../lib/api';

export default function ExpensePage() {
  const [requests, setRequests] = useState<any[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = window.localStorage.getItem('zivabi_token');
    if (!token) {
      setError('No auth token found. Please login first.');
      return;
    }

    // TEMP: tenantId is hard-coded until we wire it from JWT/tenant selection.
    api
      .post(
        '/expense/requests/list',
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => setRequests(res.data))
      .catch((err) => {
        console.error(err);
        setError(err?.response?.data?.message ?? 'Failed to load expense requests');
      });
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="border-b bg-white px-6 py-4 flex items-center justify-between">
        <div className="font-semibold text-lg text-brand">Expense – Ziva BI</div>
      </header>
      <main className="flex-1 p-6">
        {error && <p className="text-sm text-red-600 mb-4">{error}</p>}
        {!requests && !error && <p className="text-sm text-slate-600">Loading requests...</p>}
        {requests && (
          <div className="space-y-2">
            <h2 className="text-sm font-semibold text-slate-800">Expense Requests</h2>
            <div className="border border-slate-200 rounded-md bg-white divide-y">
              {requests.length === 0 && (
                <div className="px-4 py-3 text-sm text-slate-500">No requests yet.</div>
              )}
              {requests.map((r) => (
                <div key={r.id} className="px-4 py-3 text-sm flex justify-between">
                  <div>
                    <div className="font-medium text-slate-900">{r.requestType}</div>
                    <div className="text-slate-600 text-xs">Total: {r.totalAmount} {r.currency}</div>
                  </div>
                  <div className="text-xs text-slate-500 flex items-center">Status: {r.status}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
