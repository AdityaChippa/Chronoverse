import { SpaceEvent, EventType } from '@/types';

const NASA_API_KEY = process.env.NEXT_PUBLIC_NASA_API_KEY;
const NASA_BASE_URL = 'https://api.nasa.gov';

// Get space news from various sources
export async function getSpaceNews(query: string = 'space exploration') {
  try {
    // In production, you would use a real news API
    // For now, we'll use NASA's image API as a news source
    const images = await searchNASAImages(query);
    
    const news = images.slice(0, 10).map((item: any, index: number) => ({
      id: `news-${index}`,
      title: item.data[0]?.title || 'Space Update',
      summary: item.data[0]?.description || 'Latest from space exploration',
      url: item.links[0]?.href || '#',
      imageUrl: item.links[0]?.href || '',
      publishedAt: item.data[0]?.date_created || new Date().toISOString(),
      source: item.data[0]?.center || 'NASA'
    }));

    return news;
  } catch (error) {
    console.error('Error fetching space news:', error);
    return [];
  }
}

// Get upcoming space launches
export async function getUpcomingLaunches(limit: number = 10): Promise<SpaceEvent[]> {
  try {
    // This would integrate with Launch Library 2 API in production
    // For now, return mock data with realistic upcoming launches
    const today = new Date();
    const launches: SpaceEvent[] = [];

    const launchTemplates = [
      {
        title: 'SpaceX Falcon 9 - Starlink Mission',
        agency: 'SpaceX',
        location: 'Cape Canaveral, Florida',
        description: 'Deployment of Starlink satellites to provide global internet coverage',
        significance: 6
      },
      {
        title: 'Artemis II - Lunar Flyby',
        agency: 'NASA',
        location: 'Kennedy Space Center, Florida',
        description: 'First crewed mission around the Moon in the Artemis program',
        significance: 10
      },
      {
        title: 'Soyuz MS - ISS Crew Rotation',
        agency: 'Roscosmos',
        location: 'Baikonur Cosmodrome, Kazakhstan',
        description: 'Crew rotation mission to the International Space Station',
        significance: 7
      },
      {
        title: 'ISRO PSLV - Earth Observation',
        agency: 'ISRO',
        location: 'Satish Dhawan Space Centre, India',
        description: 'Launch of Earth observation satellites for climate monitoring',
        significance: 5
      },
      {
        title: 'Blue Origin New Shepard - Tourist Flight',
        agency: 'Blue Origin',
        location: 'West Texas, USA',
        description: 'Suborbital tourist flight to the edge of space',
        significance: 4
      }
    ];

    for (let i = 0; i < limit && i < launchTemplates.length; i++) {
      const daysAhead = Math.floor(Math.random() * 60) + i * 7; // Spread launches over 2 months
      const launchDate = new Date(today);
      launchDate.setDate(launchDate.getDate() + daysAhead);

      const template = launchTemplates[i % launchTemplates.length];
      
      launches.push({
        id: `launch-${i}`,
        title: template.title,
        description: template.description,
        date: launchDate,
        type: EventType.LAUNCH,
        significance: template.significance,
        category: 'Launch',
        agency: template.agency,
        country: template.location.split(',').pop()?.trim(),
        details: `Launch window opens at ${launchDate.toLocaleTimeString()}`
      });
    }

    return launches.sort((a, b) => a.date.getTime() - b.date.getTime());
  } catch (error) {
    console.error('Error fetching launches:', error);
    return [];
  }
}

// Get historical space events for a specific date
export async function getHistoricalEvents(date: Date): Promise<SpaceEvent[]> {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  // Historical events database (in production, this would be from a real API/database)
  const historicalEvents = [
    // January
    { month: 1, day: 27, year: 1967, title: 'Apollo 1 Tragedy', description: 'Three astronauts lost in launch pad fire', type: EventType.DISASTER, significance: 9 },
    { month: 1, day: 28, year: 1986, title: 'Challenger Disaster', description: 'Space Shuttle Challenger breaks apart 73 seconds after launch', type: EventType.DISASTER, significance: 10 },
    { month: 1, day: 31, year: 1958, title: 'Explorer 1 Launch', description: 'First U.S. satellite successfully launched', type: EventType.LAUNCH, significance: 9 },
    
    // February
    { month: 2, day: 20, year: 1962, title: 'John Glenn Orbits Earth', description: 'First American to orbit Earth aboard Friendship 7', type: EventType.MILESTONE, significance: 10 },
    { month: 2, day: 1, year: 2003, title: 'Columbia Disaster', description: 'Space Shuttle Columbia breaks apart during re-entry', type: EventType.DISASTER, significance: 10 },
    { month: 2, day: 14, year: 1990, title: 'Voyager 1 Pale Blue Dot', description: 'Voyager 1 takes famous "Pale Blue Dot" photograph of Earth', type: EventType.OBSERVATION, significance: 8 },
    
    // March
    { month: 3, day: 18, year: 1965, title: 'First Spacewalk', description: 'Alexei Leonov performs the first spacewalk', type: EventType.MILESTONE, significance: 9 },
    { month: 3, day: 16, year: 1966, title: 'Gemini 8 Emergency', description: 'Neil Armstrong saves Gemini 8 from uncontrolled spin', type: EventType.MILESTONE, significance: 7 },
    
    // April
    { month: 4, day: 12, year: 1961, title: 'First Human in Space', description: 'Yuri Gagarin becomes the first human in space', type: EventType.MILESTONE, significance: 10 },
    { month: 4, day: 24, year: 1990, title: 'Hubble Space Telescope Launch', description: 'Space Shuttle Discovery deploys the Hubble Space Telescope', type: EventType.LAUNCH, significance: 9 },
    
    // May
    { month: 5, day: 5, year: 1961, title: 'First American in Space', description: 'Alan Shepard becomes the first American in space', type: EventType.MILESTONE, significance: 9 },
    { month: 5, day: 25, year: 1961, title: 'JFK Moon Speech', description: 'President Kennedy announces goal to land on the Moon', type: EventType.MILESTONE, significance: 9 },
    
    // June
    { month: 6, day: 3, year: 1965, title: 'First U.S. Spacewalk', description: 'Ed White performs the first American spacewalk', type: EventType.MILESTONE, significance: 8 },
    { month: 6, day: 16, year: 1963, title: 'First Woman in Space', description: 'Valentina Tereshkova becomes the first woman in space', type: EventType.MILESTONE, significance: 9 },
    
    // July
    { month: 7, day: 20, year: 1969, title: 'Apollo 11 Moon Landing', description: 'Neil Armstrong and Buzz Aldrin land on the Moon', type: EventType.LANDING, significance: 10 },
    { month: 7, day: 21, year: 1969, title: 'First Moonwalk', description: 'Neil Armstrong takes first steps on the Moon', type: EventType.MILESTONE, significance: 10 },
    { month: 7, day: 4, year: 1997, title: 'Mars Pathfinder Landing', description: 'NASA lands Pathfinder and Sojourner rover on Mars', type: EventType.LANDING, significance: 8 },
    { month: 7, day: 4, year: 2005, title: 'Deep Impact Comet Mission', description: 'NASA impacts comet Tempel 1 to study its composition', type: EventType.ACHIEVEMENT, significance: 7 },
    
    // August
    { month: 8, day: 6, year: 2012, title: 'Curiosity Rover Landing', description: 'NASA\'s Curiosity rover successfully lands on Mars', type: EventType.LANDING, significance: 9 },
    { month: 8, day: 20, year: 1977, title: 'Voyager 2 Launch', description: 'Voyager 2 begins its journey to the outer planets', type: EventType.LAUNCH, significance: 9 },
    { month: 8, day: 25, year: 2012, title: 'Voyager 1 Enters Interstellar Space', description: 'First human-made object to enter interstellar space', type: EventType.MILESTONE, significance: 10 },
    
    // September
    { month: 9, day: 5, year: 1977, title: 'Voyager 1 Launch', description: 'Voyager 1 begins its historic journey', type: EventType.LAUNCH, significance: 9 },
    { month: 9, day: 12, year: 1959, title: 'Luna 2 Moon Impact', description: 'First human-made object to reach the Moon', type: EventType.ACHIEVEMENT, significance: 8 },
    
    // October
    { month: 10, day: 4, year: 1957, title: 'Sputnik 1 Launch', description: 'First artificial satellite launched, beginning the Space Age', type: EventType.LAUNCH, significance: 10 },
    { month: 10, day: 1, year: 1958, title: 'NASA Founded', description: 'National Aeronautics and Space Administration established', type: EventType.MILESTONE, significance: 9 },
    
    // November
    { month: 11, day: 3, year: 1957, title: 'Laika in Space', description: 'First living creature in orbit aboard Sputnik 2', type: EventType.MILESTONE, significance: 8 },
    { month: 11, day: 9, year: 1967, title: 'Saturn V First Launch', description: 'First test flight of the Moon rocket', type: EventType.LAUNCH, significance: 8 },
    
    // December
    { month: 12, day: 21, year: 1968, title: 'Apollo 8 Launch', description: 'First crewed mission to the Moon', type: EventType.LAUNCH, significance: 9 },
    { month: 12, day: 24, year: 1968, title: 'Earthrise Photo', description: 'Apollo 8 captures iconic Earthrise photograph', type: EventType.OBSERVATION, significance: 9 },
    { month: 12, day: 25, year: 2021, title: 'James Webb Space Telescope Launch', description: 'Most powerful space telescope ever built launches', type: EventType.LAUNCH, significance: 10 }
  ];

  const events = historicalEvents
    .filter(event => event.month === month && event.day === day)
    .map((event, index) => ({
      id: `historical-${month}-${day}-${index}`,
      title: event.title,
      description: event.description,
      date: new Date(event.year, event.month - 1, event.day),
      type: event.type,
      significance: event.significance,
      category: 'Historical',
      agency: 'Various',
      country: 'Various'
    }));

  return events.sort((a, b) => a.date.getTime() - b.date.getTime());
}

// Get current space missions
export async function getCurrentMissions() {
  // In production, this would fetch from a real API
  return [
    {
      id: 'iss',
      name: 'International Space Station',
      agency: 'NASA/Roscosmos/ESA/JAXA/CSA',
      status: 'Active',
      launchDate: new Date('1998-11-20'),
      description: 'Continuously inhabited space laboratory',
      crew: 7
    },
    {
      id: 'jwst',
      name: 'James Webb Space Telescope',
      agency: 'NASA/ESA/CSA',
      status: 'Active',
      launchDate: new Date('2021-12-25'),
      description: 'Infrared space telescope studying the early universe'
    },
    {
      id: 'perseverance',
      name: 'Perseverance Rover',
      agency: 'NASA',
      status: 'Active',
      launchDate: new Date('2020-07-30'),
      description: 'Mars rover searching for signs of ancient life'
    },
    {
      id: 'change5',
      name: "Chang'e 5",
      agency: 'CNSA',
      status: 'Completed',
      launchDate: new Date('2020-11-23'),
      description: 'Lunar sample return mission'
    }
  ];
}

// Search NASA images (already exists in nasa.ts but adding here for completeness)
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
    return [];
  }
}