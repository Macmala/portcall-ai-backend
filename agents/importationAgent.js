require('dotenv').config();
const axios = require('axios');

const PERPLEXITY_API_URL = 'https://api.perplexity.ai/chat/completions';
const PPLX_API_KEY = process.env.PERPLEXITY_API_KEY;

/**
 * Agent Importation - Spécialisé dans les règles d'importation temporaire et VAT
 */
class ImportationAgent {
    constructor() {
        this.agentName = "Importation Agent";
        this.specialization = "Temporary importation rules and VAT obligations";
    }

    /**
     * Génère le prompt spécialisé et enrichi pour les recherches d'importation temporaire et VAT
     */
    generatePrompt(port, arrivalDate, activityType, yachtFlag, country) {
        return `For yachts entering the port of ${port} under a ${yachtFlag} flag for ${activityType} activities around ${arrivalDate}, what are the applicable customs/VAT rules and temporary importation regulations?

Please provide DETAILED analysis covering:

**GEOGRAPHIC & LEGAL STATUS:**
- Is ${port} inside the EU VAT area or outside? (Critical for VAT liability)
- If it's a special territory (like Gibraltar, Channel Islands), what are the specific VAT rules?
- Are there any special customs unions or agreements affecting ${yachtFlag}-flagged vessels?

**TEMPORARY ADMISSION (TA) ELIGIBILITY & RULES:**
- Is Temporary Admission (TA) or Temporary Importation allowed for ${yachtFlag}-flagged yachts?
- What is the EXACT maximum duration allowed under TA? (18 months, 24 months, other?)
- Who is eligible? (Non-EU residents only? Specific ownership requirements?)
- Are there size/value restrictions for TA eligibility?

**TA STATUS MANAGEMENT:**
- Can the yacht reset TA status by exiting territorial waters? How far offshore?
- What documentation is required to prove exit and re-entry? (GPS logs, photos, receipts?)
- How many times can TA status be reset per year?
- Are there cooling-off periods between TA periods?

**VAT IMPLICATIONS FOR ${activityType.toUpperCase()} ACTIVITIES:**
- What are the VAT implications if the yacht is used for ${activityType}?
- Is there a difference between private charter and commercial charter VAT treatment?
- Are charter activities considered "economic activity" that disqualifies TA?
- What percentage VAT applies if TA is not available?

**DOCUMENTATION & PROCEDURES:**
- What specific forms or declarations are required for TA application?
- Where and when must TA be declared? (First port of entry only?)
- What supporting documents are needed? (Ownership proof, insurance, technical specs?)
- Are there online systems or must it be done in person?

**PENALTIES & COMPLIANCE:**
- What are the financial penalties for exceeding TA time limits?
- What happens if caught operating commercially under TA status?
- How are violations detected and enforced?
- Are there amnesty programs for non-compliance correction?

**PRACTICAL OPERATIONAL DETAILS:**
- Which customs office in ${port} handles TA applications?
- What are the processing times and fees?
- Can TA be extended or modified after initial declaration?
- Are there expedited procedures for urgent cases?

**CHARTER-SPECIFIC VAT & YET CONSIDERATIONS:**
- Can charter yachts benefit from TA regime? (often NO for commercial activities)
- What is the standard VAT rate for charter operations in this jurisdiction?
- Is participation in YET (Yacht EU Tax) scheme required for commercial operations?
- Are there specific restrictions or documentation requirements for charter vessels?
- What are the penalties for operating commercially under TA when not eligible?

**YET (YACHT EU TAX) SCHEME:**
- Is this port within YET scheme coverage area?
- Are there YET compliance requirements for charter operations?
- What documentation is needed for YET scheme participation?
- Are there YET-specific fees or administrative procedures?

**ALTERNATIVE REGIMES:**
- If TA is not available, what are the alternatives? (VAT payment, bonded storage, etc.)
- What are the costs of each alternative?
- Are there special regimes for charter vessels vs private yachts?

**OFFICIAL SOURCES & DIRECT CLICKABLE LINKS:**
Search for and provide ACTUAL working URLs:
- Customs authority main website: [Find real government customs site]
- VAT guidance portals: [Locate actual government VAT information]
- Online TA declaration systems: [Find real temporary admission digital platforms]
- YET scheme portal: [Locate actual Yacht EU Tax scheme website]
- Maritime law sources: [Real government maritime legislation pages]

**PRECISE CONDITIONS FOR DOCUMENT REQUIREMENTS:**
- Specify EXACTLY when each document/procedure applies:
  * "TA Status: Available ONLY for non-EU residents owning EU-flagged vessels OR non-EU vessels for private use"
  * "Charter licenses: MANDATORY for any commercial passenger operations, regardless of flag"
  * "YET participation: REQUIRED for all charter operations in EU waters, regardless of yacht size"
  * "VAT payment: OBLIGATORY if TA not available or if used for commercial activities"

**MANDATORY LINK FORMAT - USE REAL URLS:**
Always provide actual working links like:
📎 Customs: [HM Revenue & Customs](https://www.gov.uk/government/organisations/hm-revenue-customs)
📎 TA Portal: [EU Customs Portal](https://ec.europa.eu/taxation_customs/dds2/rd/rd_home.jsp)
📎 YET Scheme: [Yacht EU Tax](https://ec.europa.eu/taxation_customs/individuals/travelling/yacht-tax_en)
📎 VAT Guide: [Maritime VAT Rules](https://www.gov.uk/guidance/vat-on-transport-and-freight)

**CRITICAL:** Research and verify actual website URLs. Do not use placeholder links.
    }

    /**
     * Appelle l'API Perplexity avec le prompt spécialisé Importation
     */
    async callPerplexity(prompt) {
        if (!PPLX_API_KEY) {
            throw new Error('Perplexity API key is missing for Importation Agent');
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
            throw new Error(`${this.agentName} failed to fetch importation data`);
        }
    }

    /**
     * Recherche les informations d'importation temporaire pour un port donné
     */
    async research(port, arrivalDate, activityType, yachtFlag, country = 'the relevant country') {
        console.log(`${this.agentName} - Starting importation research for ${port}...`);
        
        try {
            const prompt = this.generatePrompt(port, arrivalDate, activityType, yachtFlag, country);
            const result = await this.callPerplexity(prompt);
            
            console.log(`${this.agentName} - Successfully completed importation research`);
            
            return {
                agent: this.agentName,
                specialization: this.specialization,
                domain: "importation",
                port,
                arrivalDate,
                activityType,
                yachtFlag,
                country,
                rawData: result,
                timestamp: new Date().toISOString(),
                status: "success"
            };
        } catch (error) {
            console.error(`${this.agentName} - Research failed:`, error.message);
            
            return {
                agent: this.agentName,
                specialization: this.specialization,
                domain: "importation",
                port,
                arrivalDate,
                activityType,
                yachtFlag,
                country,
                rawData: null,
                error: error.message,
                timestamp: new Date().toISOString(),
                status: "failed"
            };
        }
    }
}

module.exports = ImportationAgent;