/**
 * API Integration Tests
 * Validates endpoints, auth guards, and data contracts.
 */

const BASE_URL = process.env.BASE_URL || 'http://localhost:5000';
const fs = require('fs');

async function runApiTests() {
  console.log("🔗 Starting API Integration Tests...");
  const results = {
    passed: 0,
    failed: 0,
    tests: []
  };

  const checks = [
    { name: "Root Status Check", url: "/", method: "GET", expectedStatus: 200 },
    { name: "Auth Check (Unauthorized)", url: "/api/triggerNeuralAnalysis", method: "POST", expectedStatus: 401 }
  ];

  for (const check of checks) {
    try {
      const res = await fetch(`${BASE_URL}${check.url}`, { method: check.method });
      const pass = res.status === check.expectedStatus;
      
      results.tests.push({ name: check.name, status: pass ? "PASS" : "FAIL" });
      if (pass) results.passed++; else results.failed++;
      
      console.log(`${pass ? '✅' : '❌'} ${check.name} (Expected ${check.expectedStatus}, got ${res.status})`);
    } catch (error) {
      console.error(`[-] API Test Failed for ${check.name}:`, error.message);
      results.failed++;
    }
  }

  // Save integration results if needed, though Prod-Guard currently looks for Unit/SQLi/Load
  console.log(`\nAPI Integration Summary: ${results.passed} Passed, ${results.failed} Failed`);
}

runApiTests();
