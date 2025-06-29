require('dotenv').config();
const axios = require('axios');
const OpenAI = require('openai');

const PERPLEXITY_API_URL = 'https://api.perplexity.ai/chat/completions';
const PPLX_API_KEY = process.env.PERPLEXITY_API_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

/**
 * Generates prompts for Perplexity based on user input.
 */
const getPerplexityPrompts = (port, arrivalDate, activityType, yachtFlag, country) => ({
    customs: `Find the specific customs and immigration regulations for a ${yachtFlag}-flagged yacht, operating as a ${activityType}, arriving in the port of ${port} around ${arrivalDate}. Focus on required forms, pre-arrival declarations, and specific procedures.`,
    operations: `Find the ISPS code requirements and ETA notification procedures for a superyacht arriving at the port of ${port}. Include contact details for the port authority or harbour master if available.`,
    environmental: `Find local environmental regulations for yachts in ${port} concerning the disposal of black water, grey water, and garbage. Include information on MARPOL compliance.`,
    tax: `Find information on VAT and local tax obligations for a ${activityType} yacht with a ${yachtFlag} flag operating in the waters of ${country} near ${port}.`,
    agents: `List of recommended and official port agents, chandlers, and bunkering services for superyachts in the port of ${port}.`
});

/**
 * Calls the Perplexity API with a given prompt.
 */
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

/**
 * Calls the OpenAI API with the aggregated context and returns a structured JSON.
 */
const callOpenAI = async (systemPrompt, userPrompt) => {
    if (!OPENAI_API_KEY) throw new Error('OpenAI API key is missing.');
    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4-1106-preview',
            response_format: { type: "json_object" },
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt }
            ],
        });
        // The response from OpenAI with JSON mode is a JSON string in the content.
        return JSON.parse(response.choices[0].message.content);
    } catch (error) {
        console.error('Error calling OpenAI API:', error.response ? error.response.data : error.message);
        throw new Error('Failed to process data with OpenAI.');
    }
};

/**
 * Main orchestration function.
 */
const generateChecklist = async ({ port_name, arrival_date, activity_type, yacht_flag, country = 'the relevant country' }) => {
    console.log('Starting AI orchestration with OpenAI...');

    // 1. Generate all prompts for Perplexity
    const prompts = getPerplexityPrompts(port_name, arrival_date, activity_type, yacht_flag, country);

    // 2. Call Perplexity API for all topics in parallel
    const promises = Object.values(prompts).map(prompt => callPerplexity(prompt));
    const results = await Promise.all(promises);
    const rawContext = results.join('\n\n---\n\n');
    console.log('Successfully gathered context from Perplexity.');

    // 3. Build the prompts for OpenAI
    const systemPrompt = `You are a world-class maritime regulatory expert and port agent for superyachts. Your task is to generate a precise, factual, and structured checklist based *only* on the provided information. You must be rigorous and never invent information. Your output must be a JSON object that strictly follows the schema provided by the user. If information for a field is not available in the provided text, you MUST use the string "Information not available" or "N/A".`;
    
    const userPrompt = `**User's Request Context**:\n- Port of Call: ${port_name}\n- Estimated Arrival Date: ${arrival_date}\n- Yacht's Flag: ${yacht_flag}\n- Declared Activity: ${activity_type}\n\n**Raw Information Gathered from Research**:\n<START_OF_RAW_DATA>\n${rawContext}\n</START_OF_RAW_DATA>\n\n**Your Task**:\nBased **ONLY** on the provided raw information and the user's context, generate a checklist. The output **MUST** be a single, valid JSON object that adheres strictly to the following JSON schema. Do not add any other text in your response.\n\n**JSON Schema to follow**:\n{\n  "customs_and_immigration": [\n    { "title": "string", "description": "string", "action_required": boolean, "details": "string" }\n  ],\n  "port_security_and_operations": [\n    { "title": "string", "description": "string", "action_required": boolean, "details": "string" }\n  ],\n  "environmental_regulations": [\n    { "title": "string", "description": "string", "action_required": boolean, "details": "string" }\n  ],\n  "fuel_and_provisioning": [\n    { "title": "string", "description": "string", "action_required": boolean, "details": "string" }\n  ],\n  "tax_and_fiscal_obligations": [\n    { "title": "string", "description": "string", "action_required": boolean, "details": "string" }\n  ],\n  "local_contacts_and_agents": [\n    { "name": "string", "service_type": "string", "phone": "string", "email": "string" }\n  ],\n  "general_observations": [\n    { "title": "string", "description": "string" }\n  ]\n}`;

    // 4. Call OpenAI to get the structured JSON
    console.log('Sending aggregated context to OpenAI for final processing.');
    const checklistJson = await callOpenAI(systemPrompt, userPrompt);
    console.log('Successfully generated checklist from OpenAI.');

    // 5. Add metadata and disclaimer
    checklistJson.metadata = {
        generated_at: new Date().toISOString(),
        port_name,
        arrival_date,
        activity_type,
        yacht_flag,
        ai_sources: ["Perplexity AI", "OpenAI GPT-4"],
        disclaimer: "Les informations ci-dessus sont générées automatiquement à partir de sources fiables. Elles ne remplacent pas une validation humaine auprès du port ou des autorités locales. Vérifiez toujours les données critiques avant toute opération."
    };

    return checklistJson;
};

module.exports = { generateChecklist };
