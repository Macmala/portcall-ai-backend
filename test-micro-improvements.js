require('dotenv').config();
const { generateChecklist } = require('./aiOrchestrator-v2');

const testData = {
  port_name: "Gibraltar",
  arrival_date: "2024-12-15",
  activity_type: "Charter", 
  yacht_flag: "Malta"
};

async function testMicroImprovements() {
  console.log('🔬 Testing MICRO-IMPROVEMENTS in PortCall AI v3');
  console.log('='.repeat(80));
  console.log(`📍 Port: ${testData.port_name} (Strategic for YET & Charter testing)`);
  console.log(`📅 Date: ${testData.arrival_date}`);
  console.log(`⛵ Activity: ${testData.activity_type} (Charter VAT focus)`);
  console.log(`🏴 Flag: ${testData.yacht_flag}`);
  console.log('='.repeat(80));

  const startTime = Date.now();

  try {
    console.log('\n🔄 Testing MICRO-IMPROVEMENTS...\n');
    console.log('🎯 Testing for:');
    console.log('   1. YET (Yacht EU Tax) mentions');
    console.log('   2. Charter VAT restrictions');
    console.log('   3. Direct web links in responses');
    console.log('   4. Clickable portal links\n');
    
    const result = await generateChecklist(testData);
    
    const endTime = Date.now();
    const totalTime = endTime - startTime;
    
    console.log('✅ SUCCESS! Micro-improvements test completed');
    console.log('='.repeat(80));
    console.log(`⏱️  Total execution time: ${totalTime}ms\n`);
    
    // VALIDATION 1: YET & Charter VAT mentions
    console.log('🧾 TESTING YET & CHARTER VAT IMPROVEMENTS:');
    
    const importationSummary = result.port_formalities?.temporary_importation?.summary || '';
    const charterRestrictions = result.port_formalities?.temporary_importation?.charter_restrictions || '';
    
    // Check for YET mentions
    const hasYET = /YET|Yacht EU Tax|yacht.*tax/i.test(importationSummary + ' ' + charterRestrictions);
    console.log(`   YET Scheme mentioned: ${hasYET ? '✅ YES' : '❌ NO'}`);
    
    // Check for charter VAT restrictions
    const hasCharterVAT = /charter.*VAT|commercial.*VAT|charter.*tax/i.test(importationSummary + ' ' + charterRestrictions);
    console.log(`   Charter VAT restrictions: ${hasCharterVAT ? '✅ YES' : '❌ NO'}`);
    
    // Check for TA eligibility mentions for charter
    const hasTARestrictions = /TA.*not.*charter|charter.*not.*TA|commercial.*TA/i.test(importationSummary + ' ' + charterRestrictions);
    console.log(`   TA/Charter restrictions: ${hasTARestrictions ? '✅ YES' : '❌ NO'}`);
    
    if (charterRestrictions) {
      console.log(`   Charter restrictions text: "${charterRestrictions.substring(0, 100)}..."`);
    }
    
    // VALIDATION 2: Web links detection
    console.log('\n🔗 TESTING WEB LINKS IMPROVEMENTS:');
    
    const allText = JSON.stringify(result);
    
    // Check for link patterns
    const linkPatterns = [
      /📎\s*Link:\s*\[([^\]]+)\]\(([^)]+)\)/g,
      /📎\s*Portal:\s*\[([^\]]+)\]\(([^)]+)\)/g,
      /https?:\/\/[^\s\)]+/g
    ];
    
    let totalLinks = 0;
    linkPatterns.forEach((pattern, index) => {
      const matches = allText.match(pattern) || [];
      console.log(`   Pattern ${index + 1} links found: ${matches.length}`);
      totalLinks += matches.length;
      
      if (matches.length > 0 && index < 2) {
        console.log(`     Example: ${matches[0].substring(0, 80)}...`);
      }
    });
    
    console.log(`   Total clickable links detected: ${totalLinks > 0 ? `✅ ${totalLinks}` : '❌ 0'}`);
    
    // VALIDATION 3: Specific improvements per section
    console.log('\n📊 SECTION-BY-SECTION IMPROVEMENTS:');
    
    // ETA/ISPS improvements
    const etaSummary = result.port_formalities?.eta_notification?.summary || '';
    const hasETALinks = /📎.*Link|https?:\/\//.test(etaSummary);
    console.log(`   ETA/ISPS web links: ${hasETALinks ? '✅ YES' : '❌ NO'}`);
    
    // Clearance improvements  
    const clearanceSummary = result.port_formalities?.clearance_procedure?.summary || '';
    const hasClearanceLinks = /📎.*Link|📎.*Portal|https?:\/\//.test(clearanceSummary);
    console.log(`   Clearance web links: ${hasClearanceLinks ? '✅ YES' : '❌ NO'}`);
    
    // Port Operations improvements
    const berthingSummary = result.port_formalities?.berthing_operations?.summary || '';
    const servicesSummary = result.port_formalities?.port_services?.summary || '';
    const hasPortLinks = /📎.*Link|📎.*Portal|https?:\/\//.test(berthingSummary + servicesSummary);
    console.log(`   Port Operations web links: ${hasPortLinks ? '✅ YES' : '❌ NO'}`);
    
    // VALIDATION 4: Show improvements in action
    console.log('\n🎯 IMPROVEMENTS SHOWCASE:');
    
    if (hasYET || hasCharterVAT) {
      console.log('✅ YET/Charter VAT improvements working:');
      console.log(`     Summary: ${importationSummary.substring(0, 120)}...`);
    }
    
    if (totalLinks > 0) {
      console.log('✅ Web links improvements working:');
      const linkMatches = allText.match(/📎\s*(Link|Portal):\s*\[([^\]]+)\]\(([^)]+)\)/g) || [];
      linkMatches.slice(0, 2).forEach((link, index) => {
        console.log(`     Link ${index + 1}: ${link}`);
      });
    }
    
    // Final scoring
    console.log('\n🏆 MICRO-IMPROVEMENTS SCORE:');
    let score = 0;
    if (hasYET) score += 25;
    if (hasCharterVAT) score += 25; 
    if (totalLinks >= 3) score += 25;
    if (totalLinks >= 5) score += 25;
    
    console.log(`   Overall improvement score: ${score}/100`);
    console.log(`   Status: ${score >= 75 ? '🥇 EXCELLENT' : score >= 50 ? '🥈 GOOD' : score >= 25 ? '🥉 PARTIAL' : '❌ NEEDS WORK'}`);
    
    <function_calls>
<invoke name="TodoWrite">
<parameter name="todos">[{"content": "Am\u00e9liorer Agent C - Ajouter mentions YET et Charter VAT restrictions", "status": "completed", "priority": "medium", "id": "1"}, {"content": "Enrichir prompts agents pour extraire liens web directs", "status": "completed", "priority": "medium", "id": "2"}, {"content": "Adapter le frontend pour rendre les liens web cliquables", "status": "completed", "priority": "medium", "id": "3"}, {"content": "Tester les micro-am\u00e9liorations", "status": "completed", "priority": "low", "id": "4"}]