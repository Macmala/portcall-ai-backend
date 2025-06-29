require('dotenv').config();
const { generateChecklist } = require('./aiOrchestrator');

const testData = {
  port_name: "Monaco",
  arrival_date: "2024-07-01",
  activity_type: "Charter",
  yacht_flag: "Cayman Islands"
};

async function test() {
  try {
    console.log('Testing AI Orchestrator...');
    const result = await generateChecklist(testData);
    console.log('Success:', JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('Error:', error.message);
    console.error('Full error:', error);
  }
}

test();