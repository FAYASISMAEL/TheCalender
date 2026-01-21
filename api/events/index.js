// Vercel Serverless Function for Events API
// This will be available at /api/events

// Simple in-memory storage (shared across all users on Vercel)
// Note: This resets when the serverless function restarts
// For production persistence, use a database or JSONBin.io
let eventsStorage = [];

// For production, you can use JSONBin.io (free tier available)
// Get a free API key at https://jsonbin.io/
const JSONBIN_BIN_ID = process.env.JSONBIN_BIN_ID;
const JSONBIN_API_KEY = process.env.JSONBIN_API_KEY;
const JSONBIN_URL = JSONBIN_BIN_ID ? `https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}` : null;

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    if (req.method === 'GET') {
      // Fetch events from JSONBin.io or use fallback
      if (JSONBIN_URL && JSONBIN_API_KEY) {
        try {
          const response = await fetch(JSONBIN_URL + '/latest', {
            headers: {
              'X-Master-Key': JSONBIN_API_KEY,
            },
          });
          
          if (response.ok) {
            const data = await response.json();
            return res.status(200).json(data.record || []);
          }
        } catch (error) {
          console.error('JSONBin.io fetch error:', error);
        }
      }
      
      // Fallback to in-memory storage
      return res.status(200).json(eventsStorage);
    }

    if (req.method === 'POST') {
      const newEvent = req.body;
      
      // Save to JSONBin.io or fallback
      if (JSONBIN_URL && JSONBIN_API_KEY) {
        try {
          // Get current events
          const getResponse = await fetch(JSONBIN_URL + '/latest', {
            headers: {
              'X-Master-Key': JSONBIN_API_KEY,
            },
          });
          
          let currentEvents = [];
          if (getResponse.ok) {
            const data = await getResponse.json();
            currentEvents = data.record || [];
          }
          
          // Add new event
          const updatedEvents = [...currentEvents, newEvent];
          
          // Save back to JSONBin.io
          await fetch(JSONBIN_URL, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'X-Master-Key': JSONBIN_API_KEY,
            },
            body: JSON.stringify(updatedEvents),
          });
          
          return res.status(201).json(newEvent);
        } catch (error) {
          console.error('JSONBin.io save error:', error);
        }
      }
      
      // Fallback to in-memory storage
      eventsStorage.push(newEvent);
      return res.status(201).json(newEvent);
    }

    if (req.method === 'PUT') {
      const events = req.body;
      
      // Update all events in JSONBin.io or fallback
      if (JSONBIN_URL && JSONBIN_API_KEY) {
        try {
          await fetch(JSONBIN_URL, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'X-Master-Key': JSONBIN_API_KEY,
            },
            body: JSON.stringify(events),
          });
          
          return res.status(200).json(events);
        } catch (error) {
          console.error('JSONBin.io update error:', error);
        }
      }
      
      // Fallback to in-memory storage
      eventsStorage = events;
      return res.status(200).json(events);
    }

    if (req.method === 'DELETE') {
      const { eventId } = req.body;
      
      // Delete from JSONBin.io or fallback
      if (JSONBIN_URL && JSONBIN_API_KEY) {
        try {
          const getResponse = await fetch(JSONBIN_URL + '/latest', {
            headers: {
              'X-Master-Key': JSONBIN_API_KEY,
            },
          });
          
          let currentEvents = [];
          if (getResponse.ok) {
            const data = await getResponse.json();
            currentEvents = data.record || [];
          }
          
          const updatedEvents = currentEvents.filter(e => e.id !== eventId);
          
          await fetch(JSONBIN_URL, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'X-Master-Key': JSONBIN_API_KEY,
            },
            body: JSON.stringify(updatedEvents),
          });
          
          return res.status(200).json({ success: true });
        } catch (error) {
          console.error('JSONBin.io delete error:', error);
        }
      }
      
      // Fallback to in-memory storage
      eventsStorage = eventsStorage.filter(e => e.id !== eventId);
      return res.status(200).json({ success: true });
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
