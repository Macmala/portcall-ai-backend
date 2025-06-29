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

**FINANCIAL IMPLICATIONS:**
- What are the exact VAT rates that apply if TA is not available?
- Are there any bonds or guarantees required for TA?
- What are the penalties for TA violations or overstays?

**PORT-SPECIFIC CONSIDERATIONS:**
- Are there any specific rules or restrictions at ${port}?
- What are the operating hours for customs formalities?
- Are there preferred berths or areas for TA vessels?

**RECENT CHANGES:**
- Have there been any recent changes to TA rules or VAT obligations in this region?
- Any upcoming regulatory changes that might affect future visits?

**EXPERT PRACTICAL ADVICE:**
- Best practices for managing TA status effectively
- Common mistakes to avoid
- Recommended approach for vessels with complex ownership structures

Please be specific with dates, percentages, and exact requirements. Include relevant EU directives, local regulations, and any special agreements that apply.`;
    }

    /**
     * Effectue une recherche enrichie via Perplexity AI
     */
    async search(port, arrivalDate, activityType, yachtFlag, country) {
        const prompt = this.generatePrompt(port, arrivalDate, activityType, yachtFlag, country);
        
        console.log(`${this.agentName} - Analyzing importation and VAT requirements for ${port}...`);

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
            return `${this.agentName} - Unable to retrieve importation and VAT information at this time. Please consult local customs authorities for the most current regulations.`;
        }
    }

    /**
     * Formate les résultats spécifiquement pour les informations d'importation
     */
    formatResults(rawResults) {
        return {
            agentName: this.agentName,
            specialization: this.specialization,
            content: rawResults,
            keyPoints: this.extractKeyPoints(rawResults),
            urgency: this.assessUrgency(rawResults)
        };
    }

    /**
     * Extrait les points clés des résultats
     */
    extractKeyPoints(content) {
        const keyPoints = [];
        
        // Recherche de mots-clés spécifiques à l'importation
        if (content.toLowerCase().includes('temporary admission') || content.toLowerCase().includes('temporary importation')) {
            keyPoints.push('Temporary Admission rules apply');
        }
        
        if (content.toLowerCase().includes('vat') || content.toLowerCase().includes('value added tax')) {
            keyPoints.push('VAT implications identified');
        }
        
        if (content.toLowerCase().includes('18 months') || content.toLowerCase().includes('24 months')) {
            keyPoints.push('Specific time limits for temporary admission');
        }
        
        if (content.toLowerCase().includes('bond') || content.toLowerCase().includes('guarantee')) {
            keyPoints.push('Financial guarantees may be required');
        }
        
        if (content.toLowerCase().includes('commercial') || content.toLowerCase().includes('charter')) {
            keyPoints.push('Commercial activity restrictions noted');
        }

        return keyPoints;
    }

    /**
     * Évalue l'urgence basée sur le contenu
     */
    assessUrgency(content) {
        const urgentKeywords = ['penalty', 'violation', 'prohibited', 'restricted', 'deadline', 'expir'];
        const hasUrgentContent = urgentKeywords.some(keyword => 
            content.toLowerCase().includes(keyword)
        );
        
        return hasUrgentContent ? 'HIGH' : 'MEDIUM';
    }
}

module.exports = ImportationAgent;