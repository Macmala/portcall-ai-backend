require('dotenv').config();
const axios = require('axios');

const PERPLEXITY_API_URL = 'https://api.perplexity.ai/chat/completions';
const PPLX_API_KEY = process.env.PERPLEXITY_API_KEY;

const getPerplexityPrompts = (port, arrivalDate, activityType, yachtFlag, country) => ({
    customs: `Find the specific customs and immigration regulations for a ${yachtFlag}-flagged yacht, operating as a ${activityType}, arriving in the port of ${port} around ${arrivalDate}. Focus on required forms, pre-arrival declarations, and specific procedures.`,
    operations: `Find the ISPS code requirements and ETA notification procedures for a superyacht arriving at the port of ${port}. Include contact details for the port authority or harbour master if available.`,
    environmental: `Find local environmental regulations for yachts in ${port} concerning the disposal of black water, grey water, and garbage. Include information on MARPOL compliance.`,
    tax: `Find information on VAT and local tax obligations for a ${activityType} yacht with a ${yachtFlag} flag operating in the waters of ${country} near ${port}.`,
    agents: `List of recommended and official port agents, chandlers, and bunkering services for superyachts in the port of ${port}.`
});

const callPerplexity = async (prompt) => {
    if (!PPLX_API_KEY) throw new Error('Perplexity API key is missing.');
    try {
        const response = await axios.post(PERPLEXITY_API_URL, {
            model: 'llama-3.1-sonar-large-128k-online',
            messages: [{ role: 'user', content: prompt }],
        }, {
            headers: { 
                'Authorization': `Bearer ${PPLX_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data.choices[0].message.content;
    } catch (error) {
        console.error('Error calling Perplexity API:', error.response ? error.response.data : error.message);
        throw new Error('Failed to fetch data from Perplexity.');
    }
};

const generateSimpleChecklist = async ({ port_name, arrival_date, activity_type, yacht_flag, country = 'the relevant country' }) => {
    console.log('Starting simplified AI orchestration with Perplexity only...');

    // Generate a comprehensive prompt for Perplexity
    const comprehensivePrompt = `Create a detailed port call checklist for a ${yacht_flag}-flagged yacht arriving in ${port_name} on ${arrival_date} for ${activity_type} activities. 

Please provide comprehensive information covering:
1. Customs and immigration requirements
2. Port security and ISPS procedures 
3. Environmental regulations (waste disposal, MARPOL)
4. Tax and fiscal obligations
5. Recommended local agents and services

Format the response as clear, actionable checklist items.`;

    try {
        const result = await callPerplexity(comprehensivePrompt);
        console.log('Successfully generated checklist from Perplexity.');
        
        // Return a simplified JSON structure
        return {
            port_name,
            arrival_date,
            activity_type,
            yacht_flag,
            checklist_content: result,
            generated_at: new Date().toISOString(),
            source: "Perplexity AI"
        };
    } catch (error) {
        console.error('Error generating checklist:', error);
        throw error;
    }
};

module.exports = { generateChecklist: generateSimpleChecklist };