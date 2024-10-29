const express = require('express');
const { createServer } = require('http');
const { WebSocketServer, WebSocket } = require('ws');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, '../public')));

// Enable CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

// Function to connect to OpenAI and return the WebSocket connection
const connectToOpenAI = async (clientWs) => {
  const model = process.env.VITE_OPENAI_MODEL;
  const url = `wss://api.openai.com/v1/realtime?model=${model}`;
  console.log('Connecting to OpenAI at:', url);

  const openaiWs = new WebSocket(url, {
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'OpenAI-Beta': 'realtime=v1',
      'Content-Type': 'application/json'
    }
  });

  return new Promise((resolve, reject) => {
    let sessionId = null;

    openaiWs.on('open', () => {
      console.log('OpenAI WebSocket connected');
    });

    openaiWs.on('message', (data) => {
      if (clientWs.readyState === WebSocket.OPEN) {
        try {
          const message = JSON.parse(data.toString());
          console.log('Received from OpenAI:', message);

          // Store session ID from session.created event
          if (message.type === 'session.created') {
            sessionId = message.session.id;
            console.log('Session ID:', sessionId);

            // Update session settings with correct audio format
            const sessionConfig = {
              event_id: `event_${Date.now()}`,
              type: 'session.update',
              session: {
                instructions: 'You are a helpful assistant.',
                voice: 'alloy',
                modalities: ['text', 'audio'],
                // Fix: Use correct format names and structure
                input_audio_format: {
                  type: 'pcm16',  // Changed from pcm_s16le
                  sample_rate: 24000,
                  channel_count: 1,
                  bits_per_sample: 16
                },
                output_audio_format: {
                  type: 'pcm16',  // Changed from pcm_s16le
                  sample_rate: 24000,
                  channel_count: 1,
                  bits_per_sample: 16
                }
              }
            };
            openaiWs.send(JSON.stringify(sessionConfig));

            // Fix: Use correct message type for initial message
            const initialMessage = {
              event_id: `event_${Date.now()}`,
              type: 'conversation.item.create',  // Changed from message.create
              item: {
                type: 'message',
                role: 'user',
                content: [{ type: 'text', text: 'Hello' }]
              }
            };
            openaiWs.send(JSON.stringify(initialMessage));

            // Create response with correct format
            const responseConfig = {
              event_id: `event_${Date.now()}`,
              type: 'response.create',
              response: {
                modalities: ['text', 'audio']
              }
            };
            openaiWs.send(JSON.stringify(responseConfig));
            console.log('Sent response config to OpenAI');

          } else if (message.type === 'error') {
            console.error('OpenAI error:', message);
          }

          if (message.type === 'response.audio.delta') {
            console.log('Forwarding audio data to client, size:', message.delta?.length);
          }

          clientWs.send(data);
        } catch (error) {
          console.error('Error parsing OpenAI message:', error);
        }
      }
    });

    openaiWs.on('error', (error) => {
      console.error('OpenAI WebSocket error:', error);
      reject(error);
    });

    openaiWs.on('close', (code, reason) => {
      console.log('OpenAI connection closed:', {
        code,
        reason: reason.toString()
      });
      if (clientWs.readyState === WebSocket.OPEN) {
        clientWs.close();
      }
    });

    resolve(openaiWs);
  });
};

// WebSocket connection with client
wss.on('connection', async (clientWs) => {
  console.log('Client connected');

  let sessionId = null; // Declare sessionId here

  try {
    const openaiWs = await connectToOpenAI(clientWs);

    // Forward messages from client to OpenAI
    clientWs.on('message', async (data) => {
      try {
        const message = JSON.parse(data.toString());
        console.log('Forwarding to OpenAI:', {
          type: message.type,
          size: data.length
        });

        if (message.type === 'input_audio_buffer.append') {
          const formattedMessage = {
            event_id: `event_${Date.now()}`,
            type: 'input_audio_buffer.append',
            audio: message.audio
          };
          openaiWs.send(JSON.stringify(formattedMessage));
        } else if (message.type === 'input_audio_buffer.commit') {
          const formattedMessage = {
            event_id: `event_${Date.now()}`,
            type: 'input_audio_buffer.commit'
          };
          openaiWs.send(JSON.stringify(formattedMessage));
        } else {
          openaiWs.send(data);
        }
      } catch (error) {
        console.error('Error forwarding message:', error);
        clientWs.send(JSON.stringify({
          type: 'error',
          error: error.message
        }));
      }
    });

    clientWs.on('close', () => {
      console.log('Client disconnected');
      if (openaiWs.readyState === WebSocket.OPEN) {
        openaiWs.close();
      }
    });

  } catch (error) {
    console.error('Connection error:', error);
    clientWs.send(JSON.stringify({
      type: 'error',
      error: error.message
    }));
    clientWs.close();
  }
});

// Start the server
const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
