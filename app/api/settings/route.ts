import { NextResponse } from 'next/server';
import { getSettings } from '@/lib/settings';

export async function GET() {
  try {
    const settings = await getSettings();
    // Return only public-facing settings (no sensitive data)
    return NextResponse.json({
      siteName: settings.siteName,
      siteNameEn: settings.siteNameEn,
      tagline: settings.tagline,
      logoUrl: settings.logoUrl,
      faviconUrl: settings.faviconUrl,
      phone: settings.phone,
      address: settings.address,
      facebookUrl: settings.facebookUrl,
      messengerUrl: settings.messengerUrl,
      tiktokUrl: settings.tiktokUrl,
      deliveryCharge: settings.deliveryCharge,
      freeDeliveryThreshold: settings.freeDeliveryThreshold,
      bkashNumber: settings.bkashNumber,
      announcementBar: settings.announcementBar,
    });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}
