require('dotenv').config();
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function testOpenAI() {
  try {
    console.log('Testing OpenAI API...');
    const response = await openai.chat.completions.create({
      model: 'gpt-4-1106-preview',
      response_format: { type: "json_object" },
      messages: [
        { 
          role: 'system', 
          content: 'You are a helpful assistant that returns valid JSON.' 
        },
        { 
          role: 'user', 
          content: 'Create a simple checklist for a yacht arriving in Monaco. Return as JSON with a "checklist" array containing objects with "title" and "description" fields.' 
        }
      ],
    });
    
    const result = JSON.parse(response.choices[0].message.content);
    console.log('OpenAI Success:', JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('OpenAI Error:', error.message);
  }
}

testOpenAI();