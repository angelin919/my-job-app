// app/api/rise/jobs/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Параметры которые передаем в Rise API
    const params = new URLSearchParams();
    
    // Обязательные параметры с значениями по умолчанию
    params.append('page', searchParams.get('page') || '1');
    params.append('limit', searchParams.get('limit') || '20');
    params.append('sort', searchParams.get('sort') || 'desc');
    params.append('sortedBy', searchParams.get('sortedBy') || 'createdAt');
    params.append('includeDescription', searchParams.get('includeDescription') || 'true');
    
    // Опциональные параметры поиска
    const search = searchParams.get('search');
    const department = searchParams.get('department');
    const seniority = searchParams.get('seniority');
    const type = searchParams.get('type');
    const location = searchParams.get('location');
    const isTrending = searchParams.get('isTrending');
    
    if (search) params.append('search', search);
    if (department) params.append('department', department);
    if (seniority) params.append('seniority', seniority);
    if (type) params.append('type', type);
    if (location) params.append('location', location);
    if (isTrending) params.append('isTrending', isTrending);

    const riseUrl = `https://api.joinrise.io/api/v1/jobs/public?${params.toString()}`;
    
    console.log('🔄 Proxying to Rise API:', riseUrl);

    const response = await fetch(riseUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'MyJobApp/1.0',
      },
    });

    if (!response.ok) {
      throw new Error(`Rise API responded with status: ${response.status}`);
    }

    const data = await response.json();
    
    console.log('✅ Rise API proxy successful, jobs count:', data.result?.jobs?.length || 0);

    return NextResponse.json(data);
  } catch (error) {
    console.error('❌ Rise API proxy error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch jobs from Rise API',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}