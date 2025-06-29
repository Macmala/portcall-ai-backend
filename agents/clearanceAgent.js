require('dotenv').config();
const axios = require('axios');

const PERPLEXITY_API_URL = 'https://api.perplexity.ai/chat/completions';
const PPLX_API_KEY = process.env.PERPLEXITY_API_KEY;

/**
 * Agent B - Clearance & Documentation
 * Spécialisé dans: Procédures douanières, immigration, documentation requise
 * Couvre les blocs: 2 (Clearance), 5 (Documentation)
 */
class ClearanceAgent {
    constructor() {
        this.agentName = "Clearance Agent";
        this.specialization = "Customs, immigration clearance procedures and required documentation";
    }

    /**
     * Génère le prompt spécialisé et enrichi pour les recherches de clearance
     */
    generatePrompt(port, arrivalDate, activityType, yachtFlag) {
        return `At the port of ${port}, what are the precise customs and immigration clearance procedures for ${yachtFlag}-flagged yachts arriving for ${activityType} activities around ${arrivalDate}?

Please provide OPERATIONAL details for:

**REQUIRED DOCUMENTS - CUSTOMS:**
- Exact document list: crew/passenger manifests, passports, vessel registration, insurance
- Pet certificates and health declarations required?
- Specific forms for ${activityType} operations (charter licenses, commercial permits)?
- Are copies or originals required? How many copies?

**REQUIRED DOCUMENTS - IMMIGRATION:**
- Passport requirements (validity period, visa requirements by nationality)
- Crew visa requirements for non-EU crew members
- Health certificates or COVID-related documentation
- Any specific immigration forms or declarations

**CLEARANCE LOCATION & LOGISTICS:**
- WHERE exactly does clearance take place? (Marina office, dedicated customs dock, port building)
- Complete address of customs and immigration offices
- Can clearance be done at the berth or must you go to a specific location?
- Is there a specific clearance anchorage or waiting area?

**OPERATING HOURS & TIMING:**
- Exact operating hours for customs office (weekdays/weekends)
- Immigration office hours
- After-hours clearance availability and fees
- Minimum advance notice required for clearance appointments

**PROCESS TIMELINE & SEQUENCE:**
- Step-by-step clearance sequence (customs first? Immigration first?)
- Estimated processing time
- Can clearance be expedited? How?
- Are there express lanes for ${activityType} vessels?

**ACTIVITY-SPECIFIC DIFFERENCES:**
- Are there different procedures for ${activityType} vs private yachts?
- Special documentation for charter guests vs crew
- Commercial licensing requirements for charter operations

**FEES & CHARGES:**
- Customs clearance fees (fixed amounts or percentages)
- Immigration processing fees
- After-hours or weekend surcharges
- Payment methods accepted (cash, card, bank transfer)

**CONTACT INFORMATION:**
- Customs office phone, email, and fax numbers
- Immigration office direct contacts
- Emergency or after-hours contact numbers
- Online clearance portals or systems

**COMPREHENSIVE DOCUMENTATION REQUIREMENTS (DETAILED):**
- Complete checklist of ALL documents needed upon arrival
- Crew list format and requirements (digital vs paper, specific forms required)
- Vessel documentation specifics (registration, insurance certificates, safety certificates)
- RADIO LICENSE: VHF radio license/certificate requirements (operator license, station license)
- Technical certificates: Safety equipment, pollution prevention, tonnage certificates
- Owner/charter documentation requirements (proof of ownership, charter agreements)
- Pet importation certificates and veterinary requirements (specific country requirements)
- Health declarations for crew and passengers (COVID, medical certificates)
- LANGUAGE REQUIREMENTS: Which languages are accepted? (English, local language, certified translations needed?)
- DOCUMENT FORMAT: Must be original or certified copies? Apostille required for which documents?
- Translation requirements: Official translator needed? Which documents must be translated?
- Document copies needed: How many copies of each document? Color copies acceptable?
- Digital document acceptance vs physical originals (which docs can be digital?)
- Document validation procedures: Who validates? How long does validation take?

**DOCUMENTATION LOGISTICS:**
- Where are documents submitted and reviewed?
- Document processing timeline and validation procedures
- What happens if documents are missing or incomplete?
- Emergency document replacement procedures
- Document storage and return policies

**PRECISE DOCUMENT REQUIREMENTS WITH CONDITIONS:**
- Specify EXACTLY when each document is required:
  * "Charter licenses: Required ONLY if operating commercially with paying guests"
  * "Commercial permits: Mandatory for non-EU flagged yachts in charter operations under YET scheme"
  * "Radio license: Required for all vessels with VHF equipment (both operator and station licenses)"
  * "Insurance: Minimum coverage amounts and which authorities accept digital copies vs originals"

**OFFICIAL SOURCES & DIRECT CLICKABLE LINKS:**
Search for and provide ACTUAL working URLs, not examples:
- Customs Authority main website: [Find real government customs site]
- Immigration Department: [Locate actual national immigration website]  
- Pre-arrival notification portal: [Search for actual online pre-declaration system]
- Document forms download: [Find real forms download pages]
- Fee schedules: [Locate actual current tariff documents]
- Marina booking systems: [Find real marina reservation portals]
- After-hours emergency contacts: [Real emergency clearance phone numbers]

**MANDATORY LINK FORMAT - USE REAL URLS:**
Always format with actual working links like:
📎 Customs: [HM Customs Gibraltar](https://www.hmcustoms.gov.gi/)
📎 Pre-arrival: [Gibraltar Customs Portal](https://customs-portal.gibraltar.gov.gi/)
📎 Forms: [Clearance Documents](https://forms.customs.gibraltar.gov/yacht-forms)
📎 Marina: [Ocean Village Marina](https://www.oceanvillage.gi/berths)

**CRITICAL:** Find and verify actual website URLs. Do not use placeholder or example links.

Provide official government websites, customs authority links, or port authority resources where available. Be specific about exact amounts, office addresses, contact details, complete documentation checklists, and include direct URLs for all online resources and forms.`;
    }

    /**
     * Appelle l'API Perplexity avec le prompt spécialisé Clearance
     */
    async callPerplexity(prompt) {
        if (!PPLX_API_KEY) {
            throw new Error('Perplexity API key is missing for Clearance Agent');
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
            throw new Error(`${this.agentName} failed to fetch clearance data`);
        }
    }

    /**
     * Recherche les informations de clearance pour un port donné
     */
    async research(port, arrivalDate, activityType, yachtFlag) {
        console.log(`${this.agentName} - Starting clearance research for ${port}...`);
        
        try {
            const prompt = this.generatePrompt(port, arrivalDate, activityType, yachtFlag);
            const result = await this.callPerplexity(prompt);
            
            console.log(`${this.agentName} - Successfully completed clearance research`);
            
            return {
                agent: this.agentName,
                specialization: this.specialization,
                domain: "clearance",
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
                domain: "clearance",
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

module.exports = ClearanceAgent;