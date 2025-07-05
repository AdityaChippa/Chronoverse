import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { EventType } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const date = searchParams.get('date');
    const type = searchParams.get('type') as EventType | null;
    const agency = searchParams.get('agency');
    const country = searchParams.get('country');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const where: any = {};

    if (date) {
      const targetDate = new Date(date);
      const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
      const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));
      
      where.date = {
        gte: startOfDay,
        lte: endOfDay
      };
    }

    if (type) {
      where.type = type;
    }

    if (agency) {
      where.agency = agency;
    }

    if (country) {
      where.country = country;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where,
        orderBy: { date: 'desc' },
        take: limit,
        skip: offset
      }),
      prisma.event.count({ where })
    ]);

    return NextResponse.json({
      events,
      total,
      limit,
      offset
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const event = await prisma.event.create({
      data: {
        title: body.title,
        description: body.description,
        date: new Date(body.date),
        type: body.type,
        significance: body.significance || 1,
        category: body.category,
        country: body.country,
        agency: body.agency,
        imageUrl: body.imageUrl,
        videoUrl: body.videoUrl,
        metadata: body.metadata
      }
    });

    return NextResponse.json(event);
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json(
      { error: 'Failed to create event' },
      { status: 500 }
    );
  }
}