'use client';

import { useState, useEffect } from 'react';
import type { SiteSettings } from '@/lib/schemas';
import toast, { Toaster } from 'react-hot-toast';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [csrfToken, setCsrfToken] = useState('');

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(r => r.json())
      .then(data => {
        const { _csrf, ...settings } = data;
        setSettings(settings);
        if (_csrf) setCsrfToken(_csrf);
        else fetch('/api/admin/csrf').then(r => r.json()).then(d => { if (d.csrfToken) setCsrfToken(d.csrfToken); }).catch(() => {});
      })
      .catch(() => toast.error('সেটিংস লোড ব্যর্থ'))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!settings) return;
    const { name, value, type } = e.target;
    setSettings({ ...settings, [name]: type === 'number' ? Number(value) : value });
  };

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    try {
      const res = await fetch('/api/admin/settings', { method: 'PUT', headers: { 'Content-Type': 'application/json', 'x-csrf-token': csrfToken }, body: JSON.stringify(settings) });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error); }
      toast.success('সেটিংস সংরক্ষিত হয়েছে!');
    } catch (err) { toast.error(err instanceof Error ? err.message : 'সংরক্ষণ ব্যর্থ'); } finally { setSaving(false); }
  };

  const handleImageUpload = async (file: File, field: 'logoUrl' | 'faviconUrl' | 'ogImageUrl') => {
    if (!settings) return;
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const ext = file.name.split('.').pop() || 'png';
        const filename = field === 'logoUrl' ? `logo.${ext}` : field === 'faviconUrl' ? `favicon.${ext}` : `og-image.${ext}`;
        const res = await fetch('/api/admin/upload', { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-csrf-token': csrfToken }, body: JSON.stringify({ filename, data: reader.result }) });
        if (res.ok) {
          const { path } = await res.json();
          setSettings({ ...settings, [field]: path });
          toast.success('ছবি আপলোড হয়েছে');
        } else toast.error('আপলোড ব্যর্থ');
      } catch { toast.error('আপলোড ব্যর্থ'); }
    };
    reader.readAsDataURL(file);
  };

  if (loading) return <div className="animate-pulse space-y-4">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-16 bg-gray-200 rounded" />)}</div>;
  if (!settings) return <p className="text-red-500 font-bengali">সেটিংস লোড করা যায়নি</p>;

  return (
    <div className="max-w-4xl mx-auto">
      <Toaster position="top-right" />
      <h1 className="text-3xl font-bold mb-8 font-bengali">সাইট সেটিংস</h1>

      {/* Logo Section */}
      <div className="card p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 font-bengali">লোগো ও ফ্যাভিকন</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">লোগো</label>
            {settings.logoUrl && <img src={settings.logoUrl} alt="Logo" className="h-12 mb-2 bg-gray-100 rounded p-2" />}
            <input type="file" accept="image/png,image/svg+xml,image/webp,image/jpeg" onChange={e => { const f = e.target.files?.[0]; if (f) handleImageUpload(f, 'logoUrl'); }} className="text-sm" />
            <p className="text-xs text-gray-400 mt-1">সুপারিশ: 200×60px, স্বচ্ছ ব্যাকগ্রাউন্ড</p>
            {settings.logoUrl && <button onClick={() => setSettings({ ...settings, logoUrl: '' })} className="text-xs text-red-500 mt-1">লোগো সরান</button>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">ফ্যাভিকন</label>
            {settings.faviconUrl && <img src={settings.faviconUrl} alt="Favicon" className="h-8 w-8 mb-2" />}
            <input type="file" accept="image/png,image/x-icon" onChange={e => { const f = e.target.files?.[0]; if (f) handleImageUpload(f, 'faviconUrl'); }} className="text-sm" />
            <p className="text-xs text-gray-400 mt-1">32×32 বা 64×64 .ico/.png</p>
          </div>
        </div>
      </div>

      {/* Store Info */}
      <div className="card p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 font-bengali">স্টোর তথ্য</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">শপের নাম (বাংলা)</label><input name="siteName" value={settings.siteName} onChange={handleChange} className="input-field font-bengali" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">শপের নাম (English)</label><input name="siteNameEn" value={settings.siteNameEn} onChange={handleChange} className="input-field" /></div>
          <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">ট্যাগলাইন</label><input name="tagline" value={settings.tagline} onChange={handleChange} className="input-field font-bengali" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">ফোন</label><input name="phone" value={settings.phone} onChange={handleChange} className="input-field" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">bKash নম্বর</label><input name="bkashNumber" value={settings.bkashNumber} onChange={handleChange} className="input-field" /></div>
          <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">ঠিকানা</label><input name="address" value={settings.address} onChange={handleChange} className="input-field font-bengali" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Facebook URL</label><input name="facebookUrl" value={settings.facebookUrl} onChange={handleChange} className="input-field" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Messenger URL</label><input name="messengerUrl" value={settings.messengerUrl} onChange={handleChange} className="input-field" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">TikTok URL</label><input name="tiktokUrl" value={settings.tiktokUrl} onChange={handleChange} className="input-field" /></div>
        </div>
      </div>

      {/* Delivery */}
      <div className="card p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 font-bengali">ডেলিভারি সেটিংস</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">ডেলিভারি চার্জ (৳)</label><input name="deliveryCharge" type="number" min="0" value={settings.deliveryCharge} onChange={handleChange} className="input-field" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">ফ্রি ডেলিভারি থ্রেশহোল্ড (৳)</label><input name="freeDeliveryThreshold" type="number" min="0" value={settings.freeDeliveryThreshold} onChange={handleChange} className="input-field" /></div>
          <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">ঘোষণা বার</label><input name="announcementBar" value={settings.announcementBar} onChange={handleChange} className="input-field font-bengali" /></div>
        </div>
      </div>

      {/* SEO */}
      <div className="card p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 font-bengali">SEO ডিফল্ট</h2>
        <div className="space-y-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">মেটা ডিসক্রিপশন</label><textarea name="metaDescription" value={settings.metaDescription} onChange={handleChange} rows={3} className="input-field font-bengali" /></div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">OG ইমেজ</label>
            {settings.ogImageUrl && <img src={settings.ogImageUrl} alt="OG" className="h-20 mb-2 rounded" />}
            <input type="file" accept="image/*" onChange={e => { const f = e.target.files?.[0]; if (f) handleImageUpload(f, 'ogImageUrl'); }} className="text-sm" />
          </div>
        </div>
      </div>

      <button onClick={handleSave} disabled={saving} className="btn-primary text-lg px-12 py-4">
        {saving ? 'সংরক্ষণ হচ্ছে...' : 'সেটিংস সংরক্ষণ করুন'}
      </button>
    </div>
  );
}
