import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams }=new URL(request.url);
    const resource=searchParams.get('resource') || 'object';
    const page=searchParams.get('page') || '1';
    const size=searchParams.get('size') || '10';
    const apiKey=process.env.HARVARD_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: 'Server missing HARVARD_API_KEY' }, { status: 500 });
    }

    const url= `https://api.harvardartmuseums.org/${resource}?apikey=${apiKey}&page=${page}&size=${size}`;
    const response=await fetch(url);

    if (!response.ok) {
      return NextResponse.json(
        { error: `Harvard API responded with status ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}

