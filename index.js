const WebSocket = require('ws');

const CHANNEL_ID = "853494";
const VERCEL_ENDPOINT = "https://your-main-project.vercel.app/api/kick-processor";
const AUTH_TOKEN = "your-shared-secret-key"; // Protect your Vercel API

function startBot() {
    const ws = new WebSocket(`wss://ws.kick.com/chat/${CHANNEL_ID}`);

    ws.on('open', () => {
        console.log("Connected to Kick Chat.");
    });

    ws.on('message', async (rawData) => {
        const data = JSON.parse(rawData);

        // Kick 2026 Chat Event
        if (data.event === 'App\\Events\\ChatMessageEvent') {
            const chat = JSON.parse(data.data);
            
            // Forwarding to your Vercel Pro API
            await fetch(VERCEL_ENDPOINT, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': AUTH_TOKEN 
                },
                body: JSON.stringify({
                    username: chat.user.username,
                    content: chat.content,
                    timestamp: Date.now()
                })
            }).catch(e => console.error("Vercel Ping Failed"));
        }
    });

    ws.on('close', () => {
        console.log("Disconnected. Reconnecting...");
        setTimeout(startBot, 5000);
    });
}

startBot();
