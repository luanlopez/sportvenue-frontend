import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');
    const radius = searchParams.get('radius') || '5000';
    const keyword = searchParams.get('keyword') || 'quadra';

    if (!lat || !lng) {
      return NextResponse.json(
        { error: 'Latitude e longitude são obrigatórios' },
        { status: 400 }
      );
    }

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Chave da API não configurada' },
        { status: 500 }
      );
    }

    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=establishment&keyword=${encodeURIComponent(keyword)}&key=${apiKey}`;

    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.status === 'REQUEST_DENIED') {
      return NextResponse.json(
        { error: 'Acesso negado pela API do Google' },
        { status: 403 }
      );
    }

    if (data.status === 'OVER_QUERY_LIMIT') {
      return NextResponse.json(
        { error: 'Limite de consultas excedido' },
        { status: 429 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Erro ao buscar lugares próximos:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
} 