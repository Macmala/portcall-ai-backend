require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Debug environment variables
console.log('🔍 Environment Check:');
console.log('SUPABASE_URL:', process.env.SUPABASE_URL ? 'SET' : 'MISSING');
console.log('SUPABASE_ANON_KEY:', process.env.SUPABASE_ANON_KEY ? 'SET' : 'MISSING');
console.log('PERPLEXITY_API_KEY:', process.env.PERPLEXITY_API_KEY ? 'SET' : 'MISSING');
console.log('OPENAI_API_KEY:', process.env.OPENAI_API_KEY ? 'SET' : 'MISSING');
console.log('PORT:', process.env.PORT || 'NOT SET (using 3001)');

const app = express();
const port = process.env.PORT || 3001;

// Configure CORS
app.use(express.json());
app.use(cors());

// Simple health check
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'PortCall AI Backend is running!' });
});

// Simple API endpoint
app.post('/api/checklist', (req, res) => {
  console.log('📝 Checklist request received:', req.body);
  res.json({ 
    message: 'Backend is working! AI processing coming soon...', 
    data: req.body 
  });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Minimal backend server listening on 0.0.0.0:${port}`);
  console.log(`🌐 Public URL: https://portcall-ai-backend-production.up.railway.app`);
});

console.log('✅ Server startup completed');