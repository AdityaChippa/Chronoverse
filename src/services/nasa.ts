import { SpaceEvent, EventType, Mission, MissionStatus } from '@/types';

const NASA_API_KEY = process.env.NEXT_PUBLIC_NASA_API_KEY;
const NASA_BASE_URL = 'https://api.nasa.gov';

// Simulated historical events data (in production, this would come from database)
const historicalEvents: SpaceEvent[] = [
  {
    id: '1',
    title: 'Apollo 11 Moon Landing',
    description: 'Neil Armstrong and Buzz Aldrin become the first humans to walk on the Moon.',
    date: new Date('1969-07-20'),
    type: EventType.LANDING,
    significance: 10,
    category: 'Human Spaceflight',
    country: 'USA',
    agency: 'NASA',
    imageUrl: '/images/apollo11.jpg'
  },
  {
    id: '2',
    title: 'Launch of Hubble Space Telescope',
    description: 'The Hubble Space Telescope is deployed from Space Shuttle Discovery.',
    date: new Date('1990-04-24'),
    type: EventType.LAUNCH,
    significance: 9,
    category: 'Space Telescope',
    country: 'USA',
    agency: 'NASA',
    imageUrl: '/images/hubble.jpg'
  },
  {
    id: '3',
    title: 'First Space Walk',
    description: 'Alexei Leonov performs the first spacewalk, lasting 12 minutes.',
    date: new Date('1965-03-18'),
    type: EventType.MILESTONE,
    significance: 9,
    category: 'Human Spaceflight',
    country: 'USSR',
    agency: 'Soviet Space Program'
  },
  {
    id: '4',
    title: 'Voyager 1 Enters Interstellar Space',
    description: 'Voyager 1 becomes the first human-made object to enter interstellar space.',
    date: new Date('2012-08-25'),
    type: EventType.MILESTONE,
    significance: 8,
    category: 'Deep Space',
    country: 'USA',
    agency: 'NASA'
  },
  {
    id: '5',
    title: 'Mars Pathfinder Landing',
    description: 'NASA\'s Mars Pathfinder successfully lands on Mars with the Sojourner rover.',
    date: new Date('1997-07-04'),
    type: EventType.LANDING,
    significance: 8,
    category: 'Mars Exploration',
    country: 'USA',
    agency: 'NASA'
  }
];

export async function fetchEvents(): Promise<SpaceEvent[]> {
  // In production, this would fetch from database and external APIs
  // For now, return simulated data with random dates for demo
  const events = [...historicalEvents];
  
  // Add some events for today
  const today = new Date();
  events.push({
    id: `today-${Date.now()}`,
    title: 'ISS Orbit Adjustment',
    description: 'International Space Station performs routine orbit adjustment maneuver.',
    date: today,
    type: EventType.MILESTONE,
    significance: 3,
    category: 'ISS Operations',
    agency: 'NASA/Roscosmos'
  });

  return events;
}

export async function fetchAPOD(date?: string) {
  try {
    const url = new URL(`${NASA_BASE_URL}/planetary/apod`);
    url.searchParams.append('api_key', NASA_API_KEY!);
    if (date) {
      url.searchParams.append('date', date);
    }

    const response = await fetch(url.toString());
    if (!response.ok) throw new Error('Failed to fetch APOD');
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching APOD:', error);
    throw error;
  }
}

export async function fetchMarsPhotos(sol: number = 1000, camera?: string) {
  try {
    const url = new URL(`${NASA_BASE_URL}/mars-photos/api/v1/rovers/curiosity/photos`);
    url.searchParams.append('api_key', NASA_API_KEY!);
    url.searchParams.append('sol', sol.toString());
    if (camera) {
      url.searchParams.append('camera', camera);
    }

    const response = await fetch(url.toString());
    if (!response.ok) throw new Error('Failed to fetch Mars photos');
    
    const data = await response.json();
    return data.photos;
  } catch (error) {
    console.error('Error fetching Mars photos:', error);
    throw error;
  }
}

export async function fetchNEOs(startDate: string, endDate: string) {
  try {
    const url = new URL(`${NASA_BASE_URL}/neo/rest/v1/feed`);
    url.searchParams.append('api_key', NASA_API_KEY!);
    url.searchParams.append('start_date', startDate);
    url.searchParams.append('end_date', endDate);

    const response = await fetch(url.toString());
    if (!response.ok) throw new Error('Failed to fetch NEOs');
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching NEOs:', error);
    throw error;
  }
}

export async function searchNASAImages(query: string, mediaType?: 'image' | 'video') {
  try {
    const url = new URL('https://images-api.nasa.gov/search');
    url.searchParams.append('q', query);
    if (mediaType) {
      url.searchParams.append('media_type', mediaType);
    }

    const response = await fetch(url.toString());
    if (!response.ok) throw new Error('Failed to search NASA images');
    
    const data = await response.json();
    return data.collection.items;
  } catch (error) {
    console.error('Error searching NASA images:', error);
    throw error;
  }
}

export async function fetchActiveMissions(): Promise<Mission[]> {
  // Simulated active missions data
  return [
    {
      id: '1',
      name: 'James Webb Space Telescope',
      agency: 'NASA/ESA/CSA',
      launchDate: new Date('2021-12-25'),
      status: MissionStatus.ACTIVE,
      description: 'Infrared space telescope observing the early universe',
      objectives: ['Study early galaxy formation', 'Observe exoplanets', 'Study star formation'],
      achievements: ['First images released', 'Deepest infrared image of universe'],
      destination: 'L2 Lagrange Point',
      imageUrl: '/images/jwst.jpg'
    },
    {
      id: '2',
      name: 'Perseverance Rover',
      agency: 'NASA',
      launchDate: new Date('2020-07-30'),
      status: MissionStatus.ACTIVE,
      description: 'Mars rover searching for signs of ancient life',
      objectives: ['Search for biosignatures', 'Collect rock samples', 'Test oxygen production'],
      achievements: ['Successfully produced oxygen on Mars', 'Collected multiple samples'],
      spacecraft: 'Mars 2020',
      destination: 'Mars - Jezero Crater'
    },
    {
      id: '3',
      name: 'Artemis Program',
      agency: 'NASA',
      launchDate: new Date('2022-11-16'),
      status: MissionStatus.ACTIVE,
      description: 'Return humans to the Moon and establish sustainable presence',
      objectives: ['Land first woman on Moon', 'Establish lunar base', 'Prepare for Mars'],
      achievements: ['Artemis I successful uncrewed test'],
      destination: 'Moon'
    }
  ];
}