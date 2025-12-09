import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-white px-6 py-4 flex items-center justify-between">
        <div className="font-semibold text-lg text-brand">Ziva BI</div>
        <nav className="space-x-4">
          <Link className="text-sm text-slate-700 hover:text-brand" href="/expense">Expense</Link>
          <Link className="text-sm text-slate-700 hover:text-brand" href="/ap">AP</Link>
          <Link className="text-sm text-slate-700 hover:text-brand" href="/login">Login</Link>
        </nav>
      </header>
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-semibold">Welcome to Ziva BI</h1>
          <p className="text-slate-600 text-sm max-w-md mx-auto">
            This is the frontend shell. Next we will build the Expense workflows,
            AP, Audit, and more on top of this layout.
          </p>
        </div>
      </main>
    </div>
  );
}
