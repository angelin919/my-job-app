// app/api/adzuna/[...path]/route.ts
import { NextRequest, NextResponse } from 'next/server';

const ADZUNA_BASE_URL = 'https://api.adzuna.com/v1/api';
const APP_ID = process.env.ADZUNA_APP_ID;
const APP_KEY = process.env.ADZUNA_APP_KEY;

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const APP_ID = process.env.ADZUNA_APP_ID;
    const APP_KEY = process.env.ADZUNA_APP_KEY;

    // Проверяем наличие credentials
    if (!APP_ID || !APP_KEY) {
      return NextResponse.json(
        { error: 'Adzuna API credentials not configured' },
        { status: 500 }
      );
    }
    const { path } = params;
    const searchParams = request.nextUrl.searchParams;
      
    console.log('📥 Incoming request path:', path);
    console.log('📥 Incoming search params:', Object.fromEntries(searchParams.entries()));
    
    // Собираем URL для Adzuna API
    let adzunaUrl = `${ADZUNA_BASE_URL}/${path.join('/')}?app_id=${APP_ID}&app_key=${APP_KEY}`;
    
    // Добавляем остальные параметры запроса
    searchParams.forEach((value, key) => {
      if (key !== 'app_id' && key !== 'app_key') {
        adzunaUrl += `&${key}=${encodeURIComponent(value)}`;
      }
    });

    console.log('🔄 Proxying request to:', adzunaUrl);

    const response = await fetch(adzunaUrl, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Adzuna API error:', response.status, errorText);
        return NextResponse.json(
            { error: `Adzuna API error: ${response.status}` },
            { status: response.status }
          );

    //   throw new Error(`Adzuna API error: ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error('❌ Proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data from Adzuna API' },
      { status: 500 }
    );
  }
}

// ./app/components/JobList.tsx:    // const jobs = [...mockJobsList]
// ./app/components/JobList.tsx:            // dispatch(setJobs(mockJobsList));
// ./app/jobs/[id]/page.tsx:// import { mockJobsList } from '@/data/data';
// ./app/jobs/[id]/page.tsx:    // const job = mockJobsList.find(j => j.id == jobId);