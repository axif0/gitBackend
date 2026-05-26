import { NextRequest, NextResponse } from 'next/server';
import { uploadImage } from '@/lib/github';

export async function POST(request: NextRequest) {
  try {
    const { filename, data } = await request.json();

    if (!filename || !data) {
      return NextResponse.json({ error: 'Filename and data required' }, { status: 400 });
    }

    const base64 = data.replace(/^data:image\/\w+;base64,/, '');
    const path = await uploadImage(filename, base64);

    return NextResponse.json({ path, filename });
  } catch {
    return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
  }
}
