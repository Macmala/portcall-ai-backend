require('dotenv').config();
const OpenAI = require('openai');

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

/**
 * IA Superintendent - Fusionne et structure les résultats des agents spécialisés
 */
class AISuperintendent {
    constructor() {
        this.superintendentName = "AI Superintendent";
        this.role = "Multi-agent coordinator and results synthesizer";
        
        this.openai = new OpenAI({
            apiKey: OPENAI_API_KEY,
        });
    }

    /**
     * Génère le prompt système pour le Superintendent
     */
    getSystemPrompt() {
        return `Tu es un superviseur IA maritime expert qui coordonne et synthétise les informations de 4 agents spécialisés pour créer des checklists portuaires complètes.

Ta mission :
1. Fusionner les informations de 4 agents spécialisés (ETA/ISPS, Clearance, Importation, Port Operations)
2. Structurer l'information de manière synthétique et pratique selon 7 sections
3. Éviter les reformulations inutiles, rester factuel et actionnable
4. Extraire les sources/liens quand disponibles
5. Générer un résumé sous forme de 6 bullet points (un par bloc thématique)
6. **NOUVEAU**: Créer une synthèse GO/NO-GO décisionnelle basée sur tous les éléments
7. Ajouter un disclaimer de responsabilité

Tu dois TOUJOURS retourner un JSON valide strictement conforme au schéma v3 (7 sections).
Si un agent n'a pas trouvé d'information, utilise "Non disponible" pour le summary et null pour les champs spécifiques.
Reste précis, professionnel et orienté action.`;
    }

    /**
     * Génère le prompt utilisateur avec les résultats des agents
     */
    getUserPrompt(port, arrivalDate, activityType, yachtFlag, etaResult, clearanceResult, importationResult, portOperationsResult) {
        return `Tu reçois les réponses de 4 agents spécialisés pour l'arrivée d'un yacht ${yachtFlag} à ${port} le ${arrivalDate} pour activité ${activityType}.

**1. Agent ETA/ISPS :**
${etaResult.status === 'success' ? etaResult.rawData : `Erreur: ${etaResult.error || 'Aucune donnée disponible'}`}

**2. Agent Clearance & Documentation :**
${clearanceResult.status === 'success' ? clearanceResult.rawData : `Erreur: ${clearanceResult.error || 'Aucune donnée disponible'}`}

**3. Agent Importation :**
${importationResult.status === 'success' ? importationResult.rawData : `Erreur: ${importationResult.error || 'Aucune donnée disponible'}`}

**4. Agent Port Operations :**
${portOperationsResult.status === 'success' ? portOperationsResult.rawData : `Erreur: ${portOperationsResult.error || 'Aucune donnée disponible'}`}

**Ta mission :**
Fusionne et structure ces informations en JSON selon ce schéma v3 COMPLET (7 SECTIONS) :

\`\`\`json
{
  "port_formalities": {
    "eta_notification": {
      "summary": "string (synthèse des obligations ETA/ISPS)",
      "eta_deadline": "string (délai en heures: 24h, 48h, etc.) ou null",
      "contact_method": "string (VHF channel, email, portal) ou null",
      "vhf_channels": "string (numéros de canaux spécifiques) ou null",
      "isps_required": "boolean ou null",
      "isps_threshold": "string (seuil GT/taille) ou null",
      "anchoring_allowed": "boolean ou null",
      "source_url": "string ou null"
    },
    "clearance_procedure": {
      "summary": "string (synthèse des procédures de clearance)",
      "location": "string (lieu exact: Marina office, customs dock, etc.) ou null",
      "address": "string (adresse complète) ou null",
      "hours": "string (horaires d'ouverture) ou null",
      "required_documents": "string (liste documents essentiels) ou null",
      "processing_time": "string (durée estimée) ou null",
      "fees": "string (montants ou tarifs) ou null",
      "contact_phone": "string (numéro de téléphone) ou null",
      "contact_email": "string (email) ou null",
      "source_url": "string ou null"
    },
    "temporary_importation": {
      "summary": "string (synthèse des règles TA/VAT)",
      "ta_duration": "string (18 months, 24 months, etc.) ou null",
      "ta_eligible": "boolean ou null",
      "reset_possible": "boolean ou null",
      "reset_distance": "string (distance offshore pour reset) ou null",
      "vat_applicable": "boolean ou null",
      "vat_rate": "string (pourcentage VAT) ou null",
      "eu_vat_area": "boolean (si le port est dans la zone VAT UE) ou null",
      "charter_restrictions": "string (restrictions pour charter) ou null",
      "penalties": "string (pénalités en cas de dépassement) ou null",
      "customs_office": "string (bureau des douanes responsable) ou null",
      "source_url": "string ou null"
    },
    "berthing_operations": {
      "summary": "string (synthèse des procédures d'amarrage)",
      "reservation_method": "string (online, agent, walk-in) ou null",
      "reservation_mandatory": "boolean ou null",
      "marina_contacts": "string (contacts marina/harbor) ou null",
      "anchoring_regulations": "string (règles mouillage) ou null",
      "depth_restrictions": "string (restrictions tirant d'eau) ou null",
      "size_limitations": "string (limitations LOA/beam) ou null",
      "berthing_fees": "string (tarifs amarrage) ou null",
      "source_url": "string ou null"
    },
    "required_documentation": {
      "summary": "string (synthèse documents requis)",
      "crew_documents": "string (documents équipage) ou null",
      "vessel_documents": "string (documents navire) ou null",
      "insurance_requirements": "string (assurances requises) ou null",
      "pet_certificates": "string (certificats animaux) ou null",
      "health_declarations": "string (déclarations santé) ou null",
      "charter_licenses": "string (licences charter) ou null",
      "source_url": "string ou null"
    },
    "port_services": {
      "summary": "string (synthèse services portuaires)",
      "fuel_bunkering": "string (procédures carburant) ou null",
      "waste_disposal": "string (gestion déchets) ou null",
      "provisioning_allowed": "string (avitaillement autorisé) ou null",
      "repair_services": "string (services réparation) ou null",
      "agent_services": "string (services agents) ou null",
      "emergency_contacts": "string (contacts urgence) ou null",
      "source_url": "string ou null"
    },
    "local_regulations": {
      "summary": "string (synthèse règlements locaux)",
      "noise_restrictions": "string (restrictions bruit) ou null",
      "environmental_rules": "string (règles environnementales) ou null",
      "seasonal_restrictions": "string (restrictions saisonnières) ou null",
      "security_zones": "string (zones sécurisées) ou null",
      "special_events": "string (événements spéciaux) ou null",
      "local_contacts": "string (contacts locaux) ou null",
      "source_url": "string ou null"
    }
  },
  "summary": [
    "string (point clé ETA avec délai)",
    "string (point clé clearance avec lieu/horaires)",
    "string (point clé importation avec durée TA)",
    "string (point clé berthing avec procédures)",
    "string (point clé documentation requise)",
    "string (point clé services et règles locales)"
  ],
  "operational_alerts": [
    "string (alertes importantes: restrictions horaires, frais élevés, etc.)"
  ],
  "go_no_go_decision": {
    "recommendation": "string (GO ou NO-GO ou CONDITIONAL)",
    "confidence_level": "string (HIGH, MEDIUM, LOW)",
    "ready_to_proceed": [
      "string (conditions déjà remplies pour l'accostage)"
    ],
    "required_actions": [
      "string (actions obligatoires avant arrivée)"
    ],
    "risk_factors": [
      "string (risques identifiés à surveiller)"
    ],
    "critical_deadlines": [
      "string (délais critiques à respecter)"
    ]
  },
  "metadata": {
    "port_name": "${port}",
    "arrival_date": "${arrivalDate}",
    "activity_type": "${activityType}",
    "yacht_flag": "${yachtFlag}",
    "generated_at": "${new Date().toISOString()}",
    "ai_sources": ["Perplexity AI", "OpenAI GPT-4"],
    "agents_used": ["ETA/ISPS Agent", "Clearance Agent", "Importation Agent", "Port Operations Agent"],
    "disclaimer": "Les informations ci-dessus sont générées automatiquement à partir de sources fiables. Elles ne remplacent pas une validation humaine auprès du port ou des autorités locales. Vérifiez toujours les données critiques avant toute opération."
  }
}
\`\`\`

**INSTRUCTIONS SYNTHÈSE GO/NO-GO:**

Analyse TOUS les éléments pour déterminer une recommandation:

- **GO**: Toutes conditions remplissables, risques faibles, procédures claires
- **CONDITIONAL**: Possible mais avec actions obligatoires à compléter avant arrivée  
- **NO-GO**: Risques élevés, restrictions majeures, ou informations insuffisantes

Dans "ready_to_proceed": Liste ce qui est déjà OK
Dans "required_actions": Actions OBLIGATOIRES à faire avant arrivée (ETA, docs, etc.)
Dans "risk_factors": Alertes importantes (ISPS, charter restrictions, frais élevés)  
Dans "critical_deadlines": Délais absolus à respecter

⚠️ IMPORTANT: Retourne UNIQUEMENT ce JSON, aucun autre texte.`;
    }

    /**
     * Appelle OpenAI pour synthétiser les résultats des agents
     */
    async synthesizeResults(port, arrivalDate, activityType, yachtFlag, etaResult, clearanceResult, importationResult, portOperationsResult) {
        if (!OPENAI_API_KEY) {
            throw new Error('OpenAI API key is missing for AI Superintendent');
        }

        try {
            console.log(`${this.superintendentName} - Starting synthesis of agent results...`);

            const systemPrompt = this.getSystemPrompt();
            const userPrompt = this.getUserPrompt(port, arrivalDate, activityType, yachtFlag, etaResult, clearanceResult, importationResult, portOperationsResult);

            const response = await this.openai.chat.completions.create({
                model: 'gpt-4-1106-preview',
                response_format: { type: "json_object" },
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userPrompt }
                ],
                temperature: 0.3, // Plus de cohérence, moins de créativité
            });

            const synthesizedResult = JSON.parse(response.choices[0].message.content);
            
            console.log(`${this.superintendentName} - Successfully synthesized agent results`);
            
            return {
                superintendent: this.superintendentName,
                role: this.role,
                synthesis: synthesizedResult,
                agentsProcessed: [
                    { agent: etaResult.agent, status: etaResult.status },
                    { agent: clearanceResult.agent, status: clearanceResult.status },
                    { agent: importationResult.agent, status: importationResult.status },
                    { agent: portOperationsResult.agent, status: portOperationsResult.status }
                ],
                timestamp: new Date().toISOString(),
                status: "success"
            };

        } catch (error) {
            console.error(`${this.superintendentName} - Synthesis failed:`, error.message);
            
            // Fallback structuré en cas d'erreur OpenAI avec schéma enrichi
            const fallbackResult = {
                port_formalities: {
                    eta_notification: {
                        summary: etaResult.status === 'success' ? "Informations ETA disponibles - validation manuelle requise" : "Non disponible",
                        eta_deadline: null,
                        contact_method: null,
                        vhf_channels: null,
                        isps_required: null,
                        isps_threshold: null,
                        anchoring_allowed: null,
                        source_url: null
                    },
                    clearance_procedure: {
                        summary: clearanceResult.status === 'success' ? "Informations clearance disponibles - validation manuelle requise" : "Non disponible",
                        location: null,
                        address: null,
                        hours: null,
                        required_documents: null,
                        processing_time: null,
                        fees: null,
                        contact_phone: null,
                        contact_email: null,
                        source_url: null
                    },
                    temporary_importation: {
                        summary: importationResult.status === 'success' ? "Informations importation disponibles - validation manuelle requise" : "Non disponible",
                        ta_duration: null,
                        ta_eligible: null,
                        reset_possible: null,
                        reset_distance: null,
                        vat_applicable: null,
                        vat_rate: null,
                        eu_vat_area: null,
                        charter_restrictions: null,
                        penalties: null,
                        customs_office: null,
                        source_url: null
                    },
                    berthing_operations: {
                        summary: portOperationsResult.status === 'success' ? "Informations amarrage disponibles - validation manuelle requise" : "Non disponible",
                        reservation_method: null,
                        reservation_mandatory: null,
                        marina_contacts: null,
                        anchoring_regulations: null,
                        depth_restrictions: null,
                        size_limitations: null,
                        berthing_fees: null,
                        source_url: null
                    },
                    required_documentation: {
                        summary: clearanceResult.status === 'success' ? "Documentation requise disponible - validation manuelle requise" : "Non disponible",
                        crew_documents: null,
                        vessel_documents: null,
                        insurance_requirements: null,
                        pet_certificates: null,
                        health_declarations: null,
                        charter_licenses: null,
                        source_url: null
                    },
                    port_services: {
                        summary: portOperationsResult.status === 'success' ? "Services portuaires disponibles - validation manuelle requise" : "Non disponible",
                        fuel_bunkering: null,
                        waste_disposal: null,
                        provisioning_allowed: null,
                        repair_services: null,
                        agent_services: null,
                        emergency_contacts: null,
                        source_url: null
                    },
                    local_regulations: {
                        summary: portOperationsResult.status === 'success' ? "Règlements locaux disponibles - validation manuelle requise" : "Non disponible",
                        noise_restrictions: null,
                        environmental_rules: null,
                        seasonal_restrictions: null,
                        security_zones: null,
                        special_events: null,
                        local_contacts: null,
                        source_url: null
                    }
                },
                summary: [
                    "Erreur de synthèse IA - consultez les données brutes",
                    "Validation manuelle obligatoire pour clearance", 
                    "Vérifiez importation/VAT manuellement",
                    "Contactez marina pour amarrage",
                    "Préparez documentation requise",
                    "Contactez les autorités portuaires"
                ],
                operational_alerts: [
                    "ERREUR SYSTÈME - Toutes les informations doivent être vérifiées manuellement",
                    "Contactez immédiatement un agent portuaire local"
                ],
                go_no_go_decision: {
                    recommendation: "NO-GO",
                    confidence_level: "HIGH",
                    ready_to_proceed: [],
                    required_actions: [
                        "ERREUR SYSTÈME - Validation manuelle complète obligatoire",
                        "Contactez un agent maritime local avant toute opération",
                        "Vérifiez toutes les informations auprès des autorités portuaires"
                    ],
                    risk_factors: [
                        "Informations incomplètes ou manquantes",
                        "Synthèse IA défaillante - fiabilité compromise",
                        "Risque de non-conformité réglementaire"
                    ],
                    critical_deadlines: [
                        "Validation humaine immédiate requise"
                    ]
                },
                metadata: {
                    port_name: port,
                    arrival_date: arrivalDate,
                    activity_type: activityType,
                    yacht_flag: yachtFlag,
                    generated_at: new Date().toISOString(),
                    ai_sources: ["Perplexity AI", "OpenAI GPT-4"],
                    agents_used: ["ETA/ISPS Agent", "Clearance Agent", "Importation Agent"],
                    disclaimer: "ERREUR DE SYNTHÈSE IA - Les informations ci-dessus sont incomplètes. Validation humaine OBLIGATOIRE auprès du port ou des autorités locales avant toute opération."
                }
            };

            return {
                superintendent: this.superintendentName,
                role: this.role,
                synthesis: fallbackResult,
                agentsProcessed: [
                    { agent: etaResult.agent, status: etaResult.status },
                    { agent: clearanceResult.agent, status: clearanceResult.status },
                    { agent: importationResult.agent, status: importationResult.status },
                    { agent: portOperationsResult.agent, status: portOperationsResult.status }
                ],
                error: error.message,
                timestamp: new Date().toISOString(),
                status: "failed_with_fallback"
            };
        }
    }
}

module.exports = AISuperintendent;