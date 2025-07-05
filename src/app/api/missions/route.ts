// src/app/api/missions/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Your GET logic here
  return NextResponse.json({ message: "Success" });
}

export async function POST(request: NextRequest) {
  // Your POST logic here
  return NextResponse.json({ message: "Success" });
}