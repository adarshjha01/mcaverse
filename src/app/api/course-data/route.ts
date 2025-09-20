// src/app/api/course-data/route.ts

import { getCourseData } from '@/app/actions';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const courseData = await getCourseData();
    return NextResponse.json(courseData);
  } catch (error) {
    console.error('API Error: Failed to fetch course data:', error);
    // Ensure a JSON response is sent even on error
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}