require('dotenv').config();
const axios = require('axios');

const PERPLEXITY_API_URL = 'https://api.perplexity.ai/chat/completions';
const PPLX_API_KEY = process.env.PERPLEXITY_API_KEY;

/**
 * Agent D - Port Operations & Services
 * Spécialisé dans: Berthing, Fuel, Waste, Services portuaires, Règles locales
 * Couvre les blocs: 4 (Berthing), 5 (Services), 6 (Règles locales)
 */
class PortOperationsAgent {
    constructor() {
        this.agentName = "Port Operations Agent";
        this.specialization = "Port berthing, fuel services, waste management, and local regulations";
        this.domain = "port_operations";
        
    }

    /**
     * Génère le prompt enrichi pour recherche des opérations portuaires
     */
    generatePrompt(port, arrivalDate, activityType, yachtFlag) {
        return `You are researching comprehensive port operations and services information for a ${yachtFlag} flagged yacht arriving at ${port} on ${arrivalDate} for ${activityType} activities.

**CRITICAL OPERATIONAL RESEARCH AREAS:**

## 🏴 BERTHING & MARINA OPERATIONS:
- **Reservation Process**: How is berthing reserved? (online portal, mandatory agent, walk-in possible, advance booking required?)
- **Reservation Requirements**: Is reservation mandatory or optional? Minimum advance notice?
- **Marina Contacts**: Specific marina/harbor contact details, booking procedures, direct phone/email
- **Anchoring Regulations**: Are yachts allowed to anchor before clearance? Designated anchorage areas?
- **Physical Limitations**: Any depth restrictions, LOA limitations, beam restrictions, draft limits?
- **Berthing Fees**: Typical daily/weekly rates, payment methods accepted, seasonal variations
- **Berth Allocation**: How are berths assigned? First-come-first-served or pre-allocated?

## ⛽ FUEL & PROVISIONING SERVICES:
- **Fuel Bunkering Procedures**: Authorized fuel suppliers, bunkering locations, procedures
- **Fuel Types Available**: Marine gas oil, diesel, premium fuels, delivery methods
- **Provisioning Logistics**: Is provisioning delivery allowed to berth? Restrictions or designated areas?
- **Supply Contacts**: Key provisioning suppliers, chandleries, technical service providers
- **Delivery Procedures**: How are supplies delivered? Security clearances needed?

## 🗑️ WASTE & ENVIRONMENTAL COMPLIANCE:
- **MARPOL Waste Disposal**: Procedures for oily waste, bilge water, garbage disposal
- **Sewage Discharge**: Where can black/gray water be discharged? Pump-out facilities?
- **Recycling Facilities**: Separation requirements, designated disposal points
- **Environmental Fees**: Waste disposal charges, environmental taxes
- **Pollution Restrictions**: Discharge prohibitions, environmental protection zones

## 📋 LOCAL RULES & OPERATIONAL RESTRICTIONS:
- **Noise Restrictions**: Quiet hours, generator usage limitations, engine running rules
- **Environmental Protection**: Marine protected areas, speed restrictions, anchoring prohibitions
- **Seasonal Restrictions**: Summer/winter access limitations, seasonal berth availability, weather-related closures
- **Security Zones**: Restricted areas, military zones, commercial vessel separation
- **Local Events & Calendar**: Regattas, festivals, or events affecting port access during arrival period
- **CRITICAL**: Check city/municipal event calendar for port disruptions
- **Event Impact**: How do local events affect berthing availability, fees, restrictions?
- **Advance Booking**: Do events require advance marina reservations or cause closures?

## 📞 KEY CONTACTS & EMERGENCY SERVICES:
- **Harbor Master**: Direct contact details, VHF channels, office hours
- **Local Agents**: Recommended maritime agents, services offered, contact information
- **Emergency Services**: Coast guard, port police, medical emergency contacts
- **Technical Services**: Repair facilities, maintenance providers, emergency repair contacts
- **Official Port Authority**: Main port administration, regulatory contacts

**RESEARCH METHODOLOGY:**
1. Focus on official port authority websites and current operational guides
2. Look for yacht-specific information rather than commercial vessel procedures
3. Identify activity-specific requirements (Charter vs Private vs Maintenance)
4. Extract exact contact details, fees, and procedural requirements
5. Note any recent changes or temporary restrictions

**EXPECTED OUTPUT:**
Provide comprehensive operational details covering all aspects above. Include specific contact information, exact procedures, current fees, and operational restrictions. Focus on actionable information that allows independent yacht operations without local assistance.

**SOURCES PRIORITY & DIRECT LINKS:**
- Official port authority websites (provide direct URLs)
- Marina operator websites (include booking links)
- Government maritime agency publications (with web links)
- Fuel supplier websites and contact portals
- Waste management service providers (direct links)
- Recent cruising guides and yacht club resources
- Official notices to mariners

**OFFICIAL SOURCES & DIRECT CLICKABLE LINKS:**
Search for and provide ACTUAL working URLs:
- Port authority main website: [Find real port authority site]
- Marina booking portal: [Locate actual reservation system]
- Fuel supplier contacts: [Real bunkering company websites and booking systems]
- Waste disposal services: [Actual environmental services companies with contact links]
- Port services directory: [Real comprehensive services guide]
- Emergency contacts page: [Actual emergency procedures with phone numbers]

**EVENTS & RESTRICTIONS WITH REAL LINKS:**
- Municipal events calendar: [Find actual city/commune official events website]
- Port event calendar: [Locate real port authority events and restrictions page]
- Marina availability calendar: [Find actual real-time berth availability system]
- Seasonal restrictions guide: [Real official seasonal operations document]

**MANDATORY LINK FORMAT - USE REAL URLS:**
Always provide actual working links like:
📎 Marina: [Ocean Village Marina Booking](https://www.oceanvillage.gi/berths)
📎 Fuel: [Gibraltar Fuel Services](https://www.gibraltarfuel.com/marine)
📎 Events: [Visit Gibraltar Events](https://www.visitgibraltar.gi/events)
📎 Port Authority: [Gibraltar Port Authority](https://www.gibraltarport.com/)
📎 Emergency: [Gibraltar Port Control](https://www.gibraltarport.com/contact)

**CRITICAL:** Research and verify actual website URLs. Do not use placeholder links.

Return detailed, factual information with specific operational procedures, contact details, and clickable web links for all services.`;
    }

    /**
     * Appelle l'API Perplexity avec le prompt spécialisé Port Operations
     */
    async callPerplexity(prompt) {
        if (!PPLX_API_KEY) {
            throw new Error('Perplexity API key is missing for Port Operations Agent');
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
            throw new Error(`${this.agentName} failed to fetch port operations data`);
        }
    }

    /**
     * Effectue la recherche des opérations portuaires via Perplexity AI
     */
    async researchPortOperations(port, arrivalDate, activityType, yachtFlag) {
        try {
            console.log(`${this.agentName} - Starting port operations research for ${port}...`);

            const prompt = this.generatePrompt(port, arrivalDate, activityType, yachtFlag);
            const rawData = await this.callPerplexity(prompt);
            
            console.log(`${this.agentName} - Successfully completed port operations research`);
            
            return {
                agent: this.agentName,
                specialization: this.specialization,
                domain: this.domain,
                port: port,
                arrivalDate: arrivalDate,
                activityType: activityType,
                yachtFlag: yachtFlag,
                rawData: rawData,
                timestamp: new Date().toISOString(),
                status: "success"
            };

        } catch (error) {
            console.error(`${this.agentName} - Research failed:`, error.message);
            
            return {
                agent: this.agentName,
                specialization: this.specialization,
                domain: this.domain,
                port: port,
                arrivalDate: arrivalDate,
                activityType: activityType,
                yachtFlag: yachtFlag,
                error: error.message,
                timestamp: new Date().toISOString(),
                status: "failed"
            };
        }
    }
}

module.exports = PortOperationsAgent;