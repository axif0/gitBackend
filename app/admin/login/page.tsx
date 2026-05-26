'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/auth', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }) });
      if (res.ok) {
        router.push('/admin');
      } else {
        const data = await res.json();
        setError(data.error || 'ভুল পাসওয়ার্ড');
      }
    } catch { setError('কিছু সমস্যা হয়েছে'); } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream px-4">
      <div className="w-full max-w-md">
        <div className="card p-8 shadow-lg">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gold-700 to-gold-500 bg-clip-text text-transparent font-bangla">পাঁচমিশালি</h1>
            <p className="text-gray-500 text-sm mt-2">অ্যাডমিন ড্যাশবোর্ড</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">পাসওয়ার্ড</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="input-field" placeholder="পাসওয়ার্ড দিন" required />
            </div>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <button type="submit" disabled={loading} className="btn-primary w-full">{loading ? 'লগ ইন হচ্ছে...' : 'লগ ইন'}</button>
          </form>
        </div>
      </div>
    </div>
  );
}
