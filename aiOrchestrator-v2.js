require('dotenv').config();

// Import des agents spécialisés
const ETAAgent = require('./agents/etaAgent');
const ClearanceAgent = require('./agents/clearanceAgent');
const ImportationAgent = require('./agents/importationAgent');
const PortOperationsAgent = require('./agents/portOperationsAgent');

// Import du Superintendent IA
const AISuperintendent = require('./aiSuperintendent');


/**
 * AI Orchestrator v2 - Architecture multi-agents avec Superintendent IA
 */
class AIOrchestrator {
    constructor() {
        this.orchestratorName = "AI Orchestrator v3";
        this.version = "3.0.0";
        this.architecture = "4-Agent Multi-Agent with AI Superintendent";
        
        // Initialisation des agents spécialisés
        this.etaAgent = new ETAAgent();
        this.clearanceAgent = new ClearanceAgent();
        this.importationAgent = new ImportationAgent();
        this.portOperationsAgent = new PortOperationsAgent();
        
        // Initialisation du Superintendent IA
        this.aiSuperintendent = new AISuperintendent();
    }

    /**
     * Orchestration principale - exécute les 4 agents puis le Superintendent
     */
    async generateChecklist({ port_name, arrival_date, activity_type, yacht_flag, country = 'the relevant country' }) {
        console.log(`${this.orchestratorName} - Starting multi-agent orchestration...`);
        console.log(`Port: ${port_name}, Date: ${arrival_date}, Activity: ${activity_type}, Flag: ${yacht_flag}`);

        const orchestrationStart = Date.now();

        try {
            // Phase 1: Exécution des 4 agents spécialisés en parallèle
            console.log(`${this.orchestratorName} - Phase 1: Running specialized agents in parallel...`);
            
            const agentPromises = [
                this.etaAgent.research(port_name, arrival_date, activity_type, yacht_flag),
                this.clearanceAgent.research(port_name, arrival_date, activity_type, yacht_flag), 
                this.importationAgent.research(port_name, arrival_date, activity_type, yacht_flag, country),
                this.portOperationsAgent.researchPortOperations(port_name, arrival_date, activity_type, yacht_flag)
            ];

            const [etaResult, clearanceResult, importationResult, portOperationsResult] = await Promise.all(agentPromises);

            // Log des résultats des agents
            console.log(`${this.orchestratorName} - Agent results: ETA=${etaResult.status}, Clearance=${clearanceResult.status}, Importation=${importationResult.status}, PortOps=${portOperationsResult.status}`);

            // Phase 2: Synthèse par le Superintendent IA
            console.log(`${this.orchestratorName} - Phase 2: AI Superintendent synthesis...`);
            
            const superintendentResult = await this.aiSuperintendent.synthesizeResults(
                port_name, 
                arrival_date, 
                activity_type, 
                yacht_flag,
                etaResult,
                clearanceResult, 
                importationResult,
                portOperationsResult
            );

            const orchestrationEnd = Date.now();
            const totalTime = orchestrationEnd - orchestrationStart;

            console.log(`${this.orchestratorName} - Orchestration completed in ${totalTime}ms`);

            // Retour du résultat final avec métadonnées d'orchestration
            return {
                ...superintendentResult.synthesis,
                orchestration_metadata: {
                    orchestrator: this.orchestratorName,
                    version: this.version,
                    architecture: this.architecture,
                    execution_time_ms: totalTime,
                    agents_status: {
                        eta_agent: etaResult.status,
                        clearance_agent: clearanceResult.status,
                        importation_agent: importationResult.status,
                        port_operations_agent: portOperationsResult.status,
                        superintendent: superintendentResult.status
                    },
                    raw_agent_data: {
                        eta: etaResult,
                        clearance: clearanceResult,
                        importation: importationResult,
                        port_operations: portOperationsResult
                    }
                }
            };

        } catch (error) {
            console.error(`${this.orchestratorName} - Critical orchestration error:`, error.message);
            
            // Fallback d'urgence
            return this.generateEmergencyFallback(port_name, arrival_date, activity_type, yacht_flag, error);
        }
    }

    /**
     * Génère un fallback d'urgence en cas d'échec complet
     */
    generateEmergencyFallback(port_name, arrival_date, activity_type, yacht_flag, error) {
        console.log(`${this.orchestratorName} - Generating emergency fallback...`);
        
        return {
            port_formalities: {
                eta_notification: {
                    summary: "ERREUR SYSTÈME - Contactez les autorités portuaires pour les obligations ETA/ISPS",
                    source_url: null
                },
                clearance_procedure: {
                    summary: "ERREUR SYSTÈME - Contactez le bureau des douanes pour les procédures de clearance",
                    source_url: null
                },
                temporary_importation: {
                    summary: "ERREUR SYSTÈME - Contactez les douanes pour les règles d'importation temporaire",
                    source_url: null
                }
            },
            summary: [
                "ÉCHEC DU SYSTÈME IA - Validation manuelle OBLIGATOIRE",
                "Contactez immédiatement un agent portuaire local",
                "Ne procédez pas sans confirmation officielle"
            ],
            metadata: {
                port_name,
                arrival_date,
                activity_type,
                yacht_flag,
                generated_at: new Date().toISOString(),
                ai_sources: ["SYSTÈME EN ÉCHEC"],
                agents_used: ["Emergency Fallback"],
                disclaimer: "ERREUR CRITIQUE DU SYSTÈME IA - Ces informations sont incomplètes et potentiellement incorrectes. Validation humaine OBLIGATOIRE auprès des autorités portuaires avant toute opération. Ne vous fiez pas à ces données."
            },
            orchestration_metadata: {
                orchestrator: this.orchestratorName,
                version: this.version,
                architecture: this.architecture,
                status: "emergency_fallback",
                error: error.message,
                agents_status: {
                    eta_agent: "unknown",
                    clearance_agent: "unknown", 
                    importation_agent: "unknown",
                    superintendent: "failed"
                }
            }
        };
    }

    /**
     * Retourne des informations sur l'orchestrateur
     */
    getInfo() {
        return {
            name: this.orchestratorName,
            version: this.version,
            architecture: this.architecture,
            agents: [
                this.etaAgent.agentName,
                this.clearanceAgent.agentName,
                this.importationAgent.agentName
            ],
            superintendent: this.aiSuperintendent.superintendentName
        };
    }
}

// Export du générateur de checklist pour compatibilité avec l'API existante
const orchestrator = new AIOrchestrator();

const generateChecklist = async (params) => {
    return await orchestrator.generateChecklist(params);
};

module.exports = { 
    generateChecklist,
    AIOrchestrator 
};