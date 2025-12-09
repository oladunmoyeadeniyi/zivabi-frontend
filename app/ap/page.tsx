"use client";

import React, { useEffect, useState } from 'react';
import { api } from '../../lib/api';

interface ApInvoice {
  id: string;
  vendorId: string;
  invoiceNumber: string;
  invoiceDate: string;
  currency: string;
  amountFx: string;
  amountLocal: string;
  status: string;
}

export default function ApPage() {
  const [invoices, setInvoices] = useState<ApInvoice[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [vendorId, setVendorId] = useState("VENDOR-001");
  const [invoiceNumber, setInvoiceNumber] = useState("INV-2025-001");
  const [invoiceDate, setInvoiceDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [currency, setCurrency] = useState("NGN");
  const [amountFx, setAmountFx] = useState<number>(100000);
  const [fxRate, setFxRate] = useState<number>(1);

  const loadInvoices = async () => {
    const token = window.localStorage.getItem('zivabi_token');
    if (!token) {
      setError('No auth token found. Please login first.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await api.post('/ap/invoices/list', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setInvoices(res.data);
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message ?? 'Failed to load AP invoices');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInvoices();
  }, []);

  const onCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = window.localStorage.getItem('zivabi_token');
    if (!token) {
      setError('No auth token found. Please login first.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await api.post('/ap/invoices', {
        vendorId,
        invoiceNumber,
        invoiceDate,
        currency,
        amountFx,
        fxRate
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await loadInvoices();
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message ?? 'Failed to create invoice');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="border-b bg-white px-6 py-4 flex items-center justify-between">
        <div className="font-semibold text-lg text-brand">Accounts Payable – Ziva BI</div>
      </header>
      <main className="flex-1 p-6 space-y-6">
        <section className="bg-white border border-slate-200 rounded-lg p-4 max-w-xl">
          <h2 className="text-sm font-semibold text-slate-800 mb-3">Create Draft Invoice</h2>
          <form onSubmit={onCreate} className="space-y-3 text-sm">
            <div>
              <label className="block text-slate-700 mb-1" htmlFor="vendorId">Vendor ID</label>
              <input
                id="vendorId"
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand"
                value={vendorId}
                onChange={(e) => setVendorId(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-slate-700 mb-1" htmlFor="invoiceNumber">Invoice Number</label>
              <input
                id="invoiceNumber"
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 mb-1" htmlFor="invoiceDate">Invoice Date</label>
                <input
                  id="invoiceDate"
                  type="date"
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand"
                  value={invoiceDate}
                  onChange={(e) => setInvoiceDate(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-slate-700 mb-1" htmlFor="currency">Currency</label>
                <input
                  id="currency"
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 mb-1" htmlFor="amountFx">Amount (FX)</label>
                <input
                  id="amountFx"
                  type="number"
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand"
                  value={amountFx}
                  onChange={(e) => setAmountFx(parseFloat(e.target.value) || 0)}
                />
              </div>
              <div>
                <label className="block text-slate-700 mb-1" htmlFor="fxRate">FX Rate</label>
                <input
                  id="fxRate"
                  type="number"
                  step="0.000001"
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand"
                  value={fxRate}
                  onChange={(e) => setFxRate(parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>
            {error && <p className="text-xs text-red-600">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="mt-1 rounded-md bg-brand text-white text-sm font-medium px-4 py-2 hover:bg-brand-dark disabled:opacity-60"
            >
              {loading ? 'Saving...' : 'Create Invoice'}
            </button>
          </form>
        </section>

        <section>
          <h2 className="text-sm font-semibold text-slate-800 mb-2">Invoices</h2>
          {loading && !invoices && <p className="text-sm text-slate-600">Loading invoices...</p>}
          {error && !loading && <p className="text-sm text-red-600 mb-2">{error}</p>}
          {invoices && (
            <div className="border border-slate-200 rounded-md bg-white divide-y">
              {invoices.length === 0 && (
                <div className="px-4 py-3 text-sm text-slate-500">No invoices yet.</div>
              )}
              {invoices.map((inv) => (
                <div key={inv.id} className="px-4 py-3 text-sm flex justify-between">
                  <div>
                    <div className="font-medium text-slate-900">{inv.vendorId}</div>
                    <div className="text-slate-600 text-xs">{inv.invoiceNumber} · {inv.amountLocal} {inv.currency}</div>
                  </div>
                  <div className="text-xs text-slate-500 flex items-center">Status: {inv.status}</div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
