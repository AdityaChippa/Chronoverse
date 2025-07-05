import { AIResponse } from '@/types';

const GROKCLOUD_API_KEY = process.env.GROKCLOUD_API_KEY;
const GROKCLOUD_API_URL = 'https://api.x.ai/v1/chat/completions';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export async function sendAIQuery(
  query: string, 
  conversationHistory: Array<{role: string, content: string}> = []
): Promise<AIResponse> {
  try {
    // Build messages array with system prompt
    const messages: Message[] = [
      {
        role: 'system',
        content: `You are Nova, an AI space guide for ChronoVerse. You are knowledgeable about space, astronomy, missions, and cosmic events. 
        You help users navigate the platform, answer questions about space history, and provide educational insights. 
        You can also help users with voice commands to navigate different sections of ChronoVerse.
        Keep responses conversational, educational, and inspiring. Use space metaphors when appropriate.`
      }
    ];

    // Add conversation history
    conversationHistory.forEach(msg => {
      messages.push({
        role: msg.role as 'user' | 'assistant',
        content: msg.content
      });
    });

    // Add current query
    messages.push({
      role: 'user',
      content: query
    });

    // For development, simulate API response
    // In production, uncomment the actual API call below
    const simulatedResponse = await simulateAIResponse(query);
    return simulatedResponse;

    /* Production API call:
    const response = await fetch(GROKCLOUD_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROKCLOUD_API_KEY}`
      },
      body: JSON.stringify({
        model: 'grok-beta',
        messages,
        temperature: 0.7,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      throw new Error('Failed to get AI response');
    }

    const data = await response.json();
    const aiMessage = data.choices[0].message.content;

    // Parse for any special commands or suggestions
    const suggestions = extractSuggestions(aiMessage);
    const relatedEvents = await findRelatedEvents(query);

    return {
      message: aiMessage,
      suggestions,
      relatedEvents
    };
    */
  } catch (error) {
    console.error('Error in AI query:', error);
    throw error;
  }
}

// Simulated AI responses for development
async function simulateAIResponse(query: string): Promise<AIResponse> {
  const lowerQuery = query.toLowerCase();
  
  // Voice command handlers
  if (lowerQuery.includes('navigate') || lowerQuery.includes('go to') || lowerQuery.includes('show me')) {
    if (lowerQuery.includes('mission')) {
      return {
        message: "I'll take you to the Missions section where you can explore active space missions. You can command real missions and learn about ongoing explorations!",
        suggestions: ['/missions']
      };
    }
    if (lowerQuery.includes('moon') || lowerQuery.includes('lunar')) {
      return {
        message: "Let's explore the Moon together! I'll show you the current lunar phase and fascinating facts about our celestial companion.",
        suggestions: ['/lunar']
      };
    }
    if (lowerQuery.includes('satellite')) {
      return {
        message: "The Live Satellite Tracker shows real-time positions of satellites orbiting Earth. You can track the ISS and thousands of other satellites!",
        suggestions: ['/orbit']
      };
    }
  }

  // Space facts and education
  if (lowerQuery.includes('apollo')) {
    return {
      message: "Apollo 11 was humanity's first successful Moon landing mission on July 20, 1969. Neil Armstrong and Buzz Aldrin spent 21.5 hours on the lunar surface while Michael Collins orbited above. This historic achievement proved that humans could travel to other worlds!",
      suggestions: ['View Apollo missions', 'Moon landing timeline']
    };
  }

  if (lowerQuery.includes('mars')) {
    return {
      message: "Mars, the Red Planet, is currently being explored by several rovers including Perseverance and Curiosity. Did you know Mars has the largest volcano in the solar system - Olympus Mons, which is about 2.5 times Mount Everest's height?",
      suggestions: ['Current Mars missions', 'Mars photo gallery']
    };
  }

  if (lowerQuery.includes('iss') || lowerQuery.includes('space station')) {
    return {
      message: "The International Space Station orbits Earth every 90 minutes at an altitude of about 408 km. It's been continuously occupied since November 2000! You can track its current position in our Satellite Tracker.",
      suggestions: ['/orbit', 'ISS live feed']
    };
  }

  // Default responses
  const defaultResponses = [
    "Space is full of wonders! What specific cosmic topic interests you today?",
    "I'm here to guide you through the universe. Would you like to explore missions, view the cosmic gallery, or track satellites?",
    "Every moment in space history has a story. What would you like to discover?",
    "From the Moon landings to Mars rovers, there's so much to explore. What catches your curiosity?"
  ];

  return {
    message: defaultResponses[Math.floor(Math.random() * defaultResponses.length)],
    suggestions: ['Explore timeline', 'View missions', 'Track satellites']
  };
}

function extractSuggestions(message: string): string[] {
  // Extract potential navigation suggestions from AI response
  const suggestions: string[] = [];
  
  const navigationKeywords = {
    'missions': '/missions',
    'timeline': '/events',
    'gallery': '/gallery',
    'satellites': '/orbit',
    'moon': '/lunar',
    'news': '/news',
    'training': '/training'
  };

  Object.entries(navigationKeywords).forEach(([keyword, path]) => {
    if (message.toLowerCase().includes(keyword)) {
      suggestions.push(path);
    }
  });

  return suggestions;
}

async function findRelatedEvents(query: string) {
  // In production, this would search the database for related events
  // For now, return empty array
  return [];
}