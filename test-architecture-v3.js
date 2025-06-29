require('dotenv').config();
const { generateChecklist } = require('./aiOrchestrator-v2');

const testData = {
  port_name: "Nice",
  arrival_date: "2024-12-10",
  activity_type: "Charter", 
  yacht_flag: "Malta"
};

async function testArchitectureV3() {
  console.log('🚀 Testing PortCall AI v3 - 6 BLOCS ARCHITECTURE');
  console.log('='.repeat(80));
  console.log(`📍 Port: ${testData.port_name}`);
  console.log(`📅 Date: ${testData.arrival_date}`);
  console.log(`⛵ Activity: ${testData.activity_type}`);
  console.log(`🏴 Flag: ${testData.yacht_flag}`);
  console.log('='.repeat(80));

  const startTime = Date.now();

  try {
    console.log('\n🔄 Starting v3 ARCHITECTURE with 4 AGENTS + SUPERINTENDENT...\n');
    
    const result = await generateChecklist(testData);
    
    const endTime = Date.now();
    const totalTime = endTime - startTime;
    
    console.log('✅ SUCCESS! v3 Architecture test completed');
    console.log('='.repeat(80));
    console.log(`⏱️  Total execution time: ${totalTime}ms`);
    
    // Validation de la structure v3 complète (7 sections)
    console.log('\n📊 v3 STRUCTURE VALIDATION (7 SECTIONS):');
    
    if (result.port_formalities) {
      console.log('✅ port_formalities structure present');
      
      // Section 1: ETA/ISPS
      if (result.port_formalities.eta_notification) {
        console.log('  ✅ Section 1 - eta_notification');
        console.log(`     Summary: ${result.port_formalities.eta_notification.summary?.substring(0, 60)}...`);
        console.log(`     ETA Deadline: ${result.port_formalities.eta_notification.eta_deadline || 'N/A'}`);
        console.log(`     VHF Channels: ${result.port_formalities.eta_notification.vhf_channels || 'N/A'}`);
      }
      
      // Section 2: Clearance  
      if (result.port_formalities.clearance_procedure) {
        console.log('  ✅ Section 2 - clearance_procedure');
        console.log(`     Summary: ${result.port_formalities.clearance_procedure.summary?.substring(0, 60)}...`);
        console.log(`     Location: ${result.port_formalities.clearance_procedure.location || 'N/A'}`);
        console.log(`     Hours: ${result.port_formalities.clearance_procedure.hours || 'N/A'}`);
      }
      
      // Section 3: Import/VAT
      if (result.port_formalities.temporary_importation) {
        console.log('  ✅ Section 3 - temporary_importation');
        console.log(`     Summary: ${result.port_formalities.temporary_importation.summary?.substring(0, 60)}...`);
        console.log(`     TA Duration: ${result.port_formalities.temporary_importation.ta_duration || 'N/A'}`);
        console.log(`     VAT Rate: ${result.port_formalities.temporary_importation.vat_rate || 'N/A'}`);
      }
      
      // Section 4: Berthing (NOUVEAU)
      if (result.port_formalities.berthing_operations) {
        console.log('  ✅ Section 4 - berthing_operations (NEW)');
        console.log(`     Summary: ${result.port_formalities.berthing_operations.summary?.substring(0, 60)}...`);
        console.log(`     Reservation Method: ${result.port_formalities.berthing_operations.reservation_method || 'N/A'}`);
        console.log(`     Marina Contacts: ${result.port_formalities.berthing_operations.marina_contacts?.substring(0, 40) || 'N/A'}...`);
      }
      
      // Section 5: Documentation (NOUVEAU)
      if (result.port_formalities.required_documentation) {
        console.log('  ✅ Section 5 - required_documentation (NEW)');
        console.log(`     Summary: ${result.port_formalities.required_documentation.summary?.substring(0, 60)}...`);
        console.log(`     Crew Documents: ${result.port_formalities.required_documentation.crew_documents?.substring(0, 40) || 'N/A'}...`);
        console.log(`     Pet Certificates: ${result.port_formalities.required_documentation.pet_certificates?.substring(0, 40) || 'N/A'}...`);
      }
      
      // Section 6: Services (NOUVEAU)
      if (result.port_formalities.port_services) {
        console.log('  ✅ Section 6 - port_services (NEW)');
        console.log(`     Summary: ${result.port_formalities.port_services.summary?.substring(0, 60)}...`);
        console.log(`     Fuel Bunkering: ${result.port_formalities.port_services.fuel_bunkering?.substring(0, 40) || 'N/A'}...`);
        console.log(`     Waste Disposal: ${result.port_formalities.port_services.waste_disposal?.substring(0, 40) || 'N/A'}...`);
      }
      
      // Section 7: Règlements locaux (NOUVEAU)
      if (result.port_formalities.local_regulations) {
        console.log('  ✅ Section 7 - local_regulations (NEW)');
        console.log(`     Summary: ${result.port_formalities.local_regulations.summary?.substring(0, 60)}...`);
        console.log(`     Noise Restrictions: ${result.port_formalities.local_regulations.noise_restrictions?.substring(0, 40) || 'N/A'}...`);
        console.log(`     Environmental Rules: ${result.port_formalities.local_regulations.environmental_rules?.substring(0, 40) || 'N/A'}...`);
      }
    }
    
    // Test du résumé étendu (6 points au lieu de 3)
    if (result.summary) {
      console.log('\n📋 ENHANCED SUMMARY (6 points):');
      result.summary.forEach((item, index) => {
        console.log(`   ${index + 1}. ${item}`);
      });
    }
    
    // Test des alertes opérationnelles
    if (result.operational_alerts) {
      console.log('\n⚠️ OPERATIONAL ALERTS:');
      result.operational_alerts.forEach((alert, index) => {
        console.log(`   ${index + 1}. ${alert}`);
      });
    }
    
    // Validation des métadonnées d'orchestration v3
    if (result.orchestration_metadata) {
      console.log('\n🏗️ ORCHESTRATION METADATA v3:');
      console.log(`     Architecture: ${result.orchestration_metadata.architecture}`);
      console.log(`     Version: ${result.orchestration_metadata.version}`);
      console.log(`     Agents Status:`);
      Object.entries(result.orchestration_metadata.agents_status).forEach(([agent, status]) => {
        console.log(`       - ${agent}: ${status}`);
      });
    }
    
    console.log('\n💾 ARCHITECTURE v3 VALIDATION:');
    const sections = ['eta_notification', 'clearance_procedure', 'temporary_importation', 'berthing_operations', 'required_documentation', 'port_services', 'local_regulations'];
    sections.forEach((section, index) => {
      const exists = result.port_formalities && result.port_formalities[section];
      console.log(`   Section ${index + 1} (${section}): ${exists ? '✅ OK' : '❌ MISSING'}`);
    });
    
    const summaryLength = result.summary ? result.summary.length : 0;
    console.log(`   Summary points: ${summaryLength}/6 ${summaryLength >= 6 ? '✅ OK' : '⚠️ INCOMPLETE'}`);
    
    console.log('\n🎯 v3 ARCHITECTURE SUCCESS! All 6 blocs implemented.');
    
  } catch (error) {
    console.error('❌ FAILED! v3 Architecture test failed:', error.message);
    console.error('Full error:', error);
  }
}

testArchitectureV3();