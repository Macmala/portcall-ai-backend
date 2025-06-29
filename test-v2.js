require('dotenv').config();
const { generateChecklist, AIOrchestrator } = require('./aiOrchestrator-v2');

const testData = {
  port_name: "Nice",
  arrival_date: "2024-09-15",
  activity_type: "Charter", 
  yacht_flag: "British Virgin Islands"
};

async function testArchitectureV2() {
  console.log('🚀 Testing PortCall AI v2 Multi-Agent Architecture');
  console.log('='.repeat(60));
  console.log(`📍 Port: ${testData.port_name}`);
  console.log(`📅 Date: ${testData.arrival_date}`);
  console.log(`⛵ Activity: ${testData.activity_type}`);
  console.log(`🏴 Flag: ${testData.yacht_flag}`);
  console.log('='.repeat(60));

  const startTime = Date.now();

  try {
    // Test de l'orchestrateur
    const orchestrator = new AIOrchestrator();
    console.log(`🤖 ${orchestrator.getInfo().name} initialized`);
    console.log(`📋 Architecture: ${orchestrator.getInfo().architecture}`);
    
    console.log('\n🔄 Starting multi-agent checklist generation...\n');
    
    const result = await generateChecklist(testData);
    
    const endTime = Date.now();
    const totalTime = endTime - startTime;
    
    console.log('✅ SUCCESS! Architecture v2 test completed');
    console.log('='.repeat(60));
    console.log(`⏱️  Total execution time: ${totalTime}ms`);
    console.log(`🤖 Orchestrator: ${result.orchestration_metadata?.orchestrator}`);
    console.log(`📊 Agents status:`);
    
    if (result.orchestration_metadata?.agents_status) {
      Object.entries(result.orchestration_metadata.agents_status).forEach(([agent, status]) => {
        const emoji = status === 'success' ? '✅' : status === 'failed' ? '❌' : '⚠️';
        console.log(`   ${emoji} ${agent}: ${status}`);
      });
    }
    
    console.log('\n📋 Generated Summary:');
    if (result.summary) {
      result.summary.forEach((item, index) => {
        console.log(`   ${index + 1}. ${item}`);
      });
    }
    
    console.log('\n🛳️ Port Formalities:');
    if (result.port_formalities) {
      console.log(`   🚨 ETA/ISPS: ${result.port_formalities.eta_notification?.summary?.substring(0, 100)}...`);
      console.log(`   📋 Clearance: ${result.port_formalities.clearance_procedure?.summary?.substring(0, 100)}...`);
      console.log(`   💰 Importation: ${result.port_formalities.temporary_importation?.summary?.substring(0, 100)}...`);
    }
    
    console.log('\n🔍 Full result structure:');
    console.log(JSON.stringify(result, null, 2));
    
  } catch (error) {
    console.error('❌ FAILED! Architecture v2 test failed:', error.message);
    console.error('Full error:', error);
  }
}

testArchitectureV2();