const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS for all origins
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Serve static files from public directory
app.use(express.static('public'));

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Proxy endpoint for Claude API
app.post('/api/claude', async (req, res) => {
    const { apiKey, messages, system } = req.body;

    if (!apiKey) {
        return res.status(400).json({ 
            error: { message: 'API key is required' }
        });
    }

    if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ 
            error: { message: 'Messages array is required' }
        });
    }

    try {
        console.log(`[${new Date().toISOString()}] Claude API request - ${messages.length} messages`);

        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: 'claude-sonnet-4-6',
                max_tokens: 1024,
                system: system,
                messages: messages
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error(`[${new Date().toISOString()}] Claude API error:`, data);
            return res.status(response.status).json(data);
        }

        console.log(`[${new Date().toISOString()}] Claude API success`);
        res.json(data);

    } catch (error) {
        console.error(`[${new Date().toISOString()}] Server error:`, error);
        res.status(500).json({ 
            error: { 
                message: 'Internal server error', 
                details: error.message 
            }
        });
    }
});

// Test endpoint for API key validation
app.post('/api/test', async (req, res) => {
    const { apiKey } = req.body;

    if (!apiKey) {
        return res.status(400).json({ 
            error: { message: 'API key is required' }
        });
    }

    try {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: 'claude-sonnet-4-6',
                max_tokens: 100,
                messages: [{ role: 'user', content: 'Hello' }]
            })
        });

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json(data);
        }

        res.json({ success: true, message: 'API key is valid' });

    } catch (error) {
        res.status(500).json({ 
            error: { 
                message: 'Test failed', 
                details: error.message 
            }
        });
    }
});

app.listen(PORT, () => {
    console.log(`\n🚀 Artemis Mind Backend Server`);
    console.log(`📡 Server running on port ${PORT}`);
    console.log(`🏥 Health check: http://localhost:${PORT}/health`);
    console.log(`🌐 Frontend: http://localhost:${PORT}`);
    console.log(`\nPress Ctrl+C to stop\n`);
});
