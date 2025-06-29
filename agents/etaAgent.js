require('dotenv').config();
const axios = require('axios');

const PERPLEXITY_API_URL = 'https://api.perplexity.ai/chat/completions';
const PPLX_API_KEY = process.env.PERPLEXITY_API_KEY;

/**
 * Agent ETA/ISPS - Spécialisé dans les notifications d'arrivée et sécurité portuaire
 */
class ETAAgent {
    constructor() {
        this.agentName = "ETA/ISPS Agent";
        this.specialization = "Port arrival notifications and ISPS security requirements";
    }

    /**
     * Génère le prompt spécialisé et enrichi pour les recherches ETA/ISPS
     */
    generatePrompt(port, arrivalDate, activityType, yachtFlag) {
        return `For the port of ${port}, what are the specific ETA and ISPS notification rules for incoming ${activityType} yachts flagged in ${yachtFlag}, arriving around ${arrivalDate}?

Please provide PRECISE operational details for:

**ETA NOTIFICATION REQUIREMENTS:**
- What is the recommended or mandatory ETA notice period? (in hours: 24h, 48h, 72h?)
- To whom should the ETA be submitted? (Specific email address, online portal, VHF channel)
- What information must be included in the ETA notification? (crew count, yacht specs, itinerary)
- Is there a specific ETA notification form or format required?

**ISPS COMPLIANCE & SECURITY (DETAILED):**
- Is ISPS compliance required? From what yacht size or Gross Tonnage (GT)?
- CRITICAL: Specify exactly WHO must comply (commercial vessels ≥500 GT, all yachts >24m, charter vessels, etc.)
- WHERE to submit ISPS Declaration? (Specific port authority office, online portal, which department?)
- WHEN to notify? (24h before, upon arrival, advance notice required?)
- What ISPS Security Level applies to this port facility? (Level 1, 2, or 3)
- Are there specific ISPS forms or declarations to submit in advance?
- What are the port facility security levels and restrictions?
- Are there restricted areas or security zones around the port?
- What happens if ISPS non-compliant vessel attempts entry?

**OPERATIONAL DETAILS:**
- Is anchoring allowed before clearance? Where exactly?
- Are there specific approach routes or navigation restrictions?
- What VHF channels should be used for port control contact?
- Are there time restrictions for arrivals (night arrivals, weekend restrictions)?

**ACTIVITY-SPECIFIC REQUIREMENTS:**
- Are there different procedures for ${activityType} vs private yachts?
- Any special requirements for commercial charter operations?

**CONTACT INFORMATION:**
- Port authority/harbour master phone numbers and email
- VHF working channels (specific channel numbers)
- Emergency contact information

**OFFICIAL SOURCES & DIRECT CLICKABLE LINKS:**
Search for and provide ACTUAL working URLs:
- Port Authority/Harbor Master: [Find real Capitaneria di Porto or Port Authority website]
- Online ETA submission portal: [Locate actual digital ETA submission system]
- ISPS Declaration portal: [Find real security declaration system]
- Coast Guard/Maritime Authority: [Real national maritime authority website]
- Port Control VHF guide: [Actual maritime communications guide URL]
- Port regulations document: [Real current port regulations PDF or webpage]
- Security procedures guide: [Actual ISPS compliance documentation]

**MANDATORY LINK FORMAT - USE REAL URLS:**
Always provide actual working links like:
📎 Port Authority: [Gibraltar Port Authority](https://www.gibraltarport.com/)
📎 ETA Portal: [Gibraltar Maritime Portal](https://maritime.gibraltar.gov.gi/eta)
📎 ISPS: [Gibraltar Security Declaration](https://security.gibraltarport.com/)
📎 Coast Guard: [Maritime Authority](https://www.gibraltar.gov.gi/maritime)

**CRITICAL:** Research and verify actual website URLs. Do not use placeholder links.

Please provide official sources, port authority websites, or regulatory documentation links where available. Be specific about deadlines, contact details, size/GT thresholds, and include direct URLs for all online resources.`;
    }

    /**
     * Appelle l'API Perplexity avec le prompt spécialisé ETA/ISPS
     */
    async callPerplexity(prompt) {
        if (!PPLX_API_KEY) {
            throw new Error('Perplexity API key is missing for ETA Agent');
        }

        try {
            const response = await axios.post(PERPLEXITY_API_URL, {
                model: 'llama-3.1-sonar-large-128k-online',
                messages: [{ role: 'user', content: prompt }]
            }, {
                headers: { 
                    'Authorization': `Bearer ${PPLX_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            });

            return response.data.choices[0].message.content;
        } catch (error) {
            console.error(`${this.agentName} - Error calling Perplexity API:`, error.response ? error.response.data : error.message);
            throw new Error(`${this.agentName} failed to fetch ETA/ISPS data`);
        }
    }

    /**
     * Recherche les informations ETA/ISPS pour un port donné
     */
    async research(port, arrivalDate, activityType, yachtFlag) {
        console.log(`${this.agentName} - Starting ETA/ISPS research for ${port}...`);
        
        try {
            const prompt = this.generatePrompt(port, arrivalDate, activityType, yachtFlag);
            const result = await this.callPerplexity(prompt);
            
            console.log(`${this.agentName} - Successfully completed ETA/ISPS research`);
            
            return {
                agent: this.agentName,
                specialization: this.specialization,
                domain: "eta_isps",
                port,
                arrivalDate,
                activityType,
                yachtFlag,
                rawData: result,
                timestamp: new Date().toISOString(),
                status: "success"
            };
        } catch (error) {
            console.error(`${this.agentName} - Research failed:`, error.message);
            
            return {
                agent: this.agentName,
                specialization: this.specialization,
                domain: "eta_isps",
                port,
                arrivalDate,
                activityType,
                yachtFlag,
                rawData: null,
                error: error.message,
                timestamp: new Date().toISOString(),
                status: "failed"
            };
        }
    }
}

module.exports = ETAAgent;