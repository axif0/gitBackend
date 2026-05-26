import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--bg-primary)' }}>
      <div className="text-center">
        <h1 className="text-8xl font-bold mb-4" style={{ color: 'var(--gold)' }}>৪০৪</h1>
        <h2 className="text-2xl font-bengali font-bold mb-4" style={{ color: 'var(--text-primary)' }}>পেজ পাওয়া যায়নি</h2>
        <p className="mb-8 font-bengali" style={{ color: 'var(--text-muted)' }}>আপনি যে পেজটি খুঁজছেন সেটি নেই বা সরানো হয়েছে।</p>
        <Link href="/" className="btn-primary">হোমপেজে ফিরে যান</Link>
      </div>
    </div>
  );
}
