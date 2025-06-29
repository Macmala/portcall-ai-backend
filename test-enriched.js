require('dotenv').config();
const { generateChecklist } = require('./aiOrchestrator-v2');

const testData = {
  port_name: "Palma de Mallorca",
  arrival_date: "2024-11-20",
  activity_type: "Charter", 
  yacht_flag: "Cayman Islands"
};

async function testEnrichedArchitecture() {
  console.log('🚀 Testing ENRICHED PortCall AI v2 Multi-Agent Architecture');
  console.log('='.repeat(70));
  console.log(`📍 Port: ${testData.port_name}`);
  console.log(`📅 Date: ${testData.arrival_date}`);
  console.log(`⛵ Activity: ${testData.activity_type}`);
  console.log(`🏴 Flag: ${testData.yacht_flag}`);
  console.log('='.repeat(70));

  const startTime = Date.now();

  try {
    console.log('\n🔄 Starting ENRICHED multi-agent checklist generation...\n');
    
    const result = await generateChecklist(testData);
    
    const endTime = Date.now();
    const totalTime = endTime - startTime;
    
    console.log('✅ SUCCESS! ENRICHED Architecture test completed');
    console.log('='.repeat(70));
    console.log(`⏱️  Total execution time: ${totalTime}ms`);
    
    // Test de la structure enrichie
    console.log('\n📊 ENRICHED STRUCTURE VALIDATION:');
    
    if (result.port_formalities) {
      console.log('✅ port_formalities structure present');
      
      // Test ETA section enrichie
      if (result.port_formalities.eta_notification) {
        console.log('  ✅ eta_notification section');
        console.log(`     Summary: ${result.port_formalities.eta_notification.summary?.substring(0, 80)}...`);
        console.log(`     ETA Deadline: ${result.port_formalities.eta_notification.eta_deadline || 'N/A'}`);
        console.log(`     Contact Method: ${result.port_formalities.eta_notification.contact_method || 'N/A'}`);
        console.log(`     VHF Channels: ${result.port_formalities.eta_notification.vhf_channels || 'N/A'}`);
        console.log(`     ISPS Required: ${result.port_formalities.eta_notification.isps_required || 'N/A'}`);
        console.log(`     Anchoring Allowed: ${result.port_formalities.eta_notification.anchoring_allowed || 'N/A'}`);
      }
      
      // Test Clearance section enrichie
      if (result.port_formalities.clearance_procedure) {
        console.log('  ✅ clearance_procedure section');
        console.log(`     Summary: ${result.port_formalities.clearance_procedure.summary?.substring(0, 80)}...`);
        console.log(`     Location: ${result.port_formalities.clearance_procedure.location || 'N/A'}`);
        console.log(`     Hours: ${result.port_formalities.clearance_procedure.hours || 'N/A'}`);
        console.log(`     Required Documents: ${result.port_formalities.clearance_procedure.required_documents?.substring(0, 60) || 'N/A'}...`);
        console.log(`     Fees: ${result.port_formalities.clearance_procedure.fees || 'N/A'}`);
        console.log(`     Contact Phone: ${result.port_formalities.clearance_procedure.contact_phone || 'N/A'}`);
        console.log(`     Contact Email: ${result.port_formalities.clearance_procedure.contact_email || 'N/A'}`);
      }
      
      // Test Importation section enrichie
      if (result.port_formalities.temporary_importation) {
        console.log('  ✅ temporary_importation section');
        console.log(`     Summary: ${result.port_formalities.temporary_importation.summary?.substring(0, 80)}...`);
        console.log(`     TA Duration: ${result.port_formalities.temporary_importation.ta_duration || 'N/A'}`);
        console.log(`     TA Eligible: ${result.port_formalities.temporary_importation.ta_eligible || 'N/A'}`);
        console.log(`     Reset Possible: ${result.port_formalities.temporary_importation.reset_possible || 'N/A'}`);
        console.log(`     EU VAT Area: ${result.port_formalities.temporary_importation.eu_vat_area || 'N/A'}`);
        console.log(`     VAT Applicable: ${result.port_formalities.temporary_importation.vat_applicable || 'N/A'}`);
        console.log(`     VAT Rate: ${result.port_formalities.temporary_importation.vat_rate || 'N/A'}`);
        console.log(`     Charter Restrictions: ${result.port_formalities.temporary_importation.charter_restrictions?.substring(0, 60) || 'N/A'}...`);
        console.log(`     Customs Office: ${result.port_formalities.temporary_importation.customs_office || 'N/A'}`);
      }
    }
    
    // Test des nouvelles sections
    if (result.operational_alerts) {
      console.log('  ✅ operational_alerts section');
      console.log(`     Alerts Count: ${result.operational_alerts.length}`);
      result.operational_alerts.forEach((alert, index) => {
        console.log(`     Alert ${index + 1}: ${alert.substring(0, 60)}...`);
      });
    }
    
    console.log('\n📋 Generated Enhanced Summary:');
    if (result.summary) {
      result.summary.forEach((item, index) => {
        console.log(`   ${index + 1}. ${item}`);
      });
    }
    
    console.log('\n💾 FULL ENRICHED RESULT:');
    console.log(JSON.stringify(result, null, 2));
    
  } catch (error) {
    console.error('❌ FAILED! ENRICHED Architecture test failed:', error.message);
    console.error('Full error:', error);
  }
}

testEnrichedArchitecture();