import { NextRequest, NextResponse } from 'next/server';
import { getProducts, saveProducts, deleteImage } from '@/lib/github';
import { Product } from '@/types/product';

export async function GET() {
  try {
    const products = await getProducts();
    return NextResponse.json(products);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const product: Product = await request.json();
    const products = await getProducts();

    if (products.some((p) => p.id === product.id)) {
      return NextResponse.json({ error: 'Product ID already exists' }, { status: 400 });
    }

    products.push(product);
    await saveProducts(products);
    return NextResponse.json(product);
  } catch {
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const updated: Product = await request.json();
    const products = await getProducts();
    const index = products.findIndex((p) => p.id === updated.id);

    if (index === -1) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    products[index] = updated;
    await saveProducts(products);
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Product ID required' }, { status: 400 });
    }

    const products = await getProducts();
    const product = products.find((p) => p.id === id);

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    for (const img of product.images) {
      const filename = img.split('/').pop();
      if (filename) await deleteImage(filename);
    }

    const filtered = products.filter((p) => p.id !== id);
    await saveProducts(filtered);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
