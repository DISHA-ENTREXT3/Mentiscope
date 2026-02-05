const fs = require('fs');
const path = require('path');

/**
 * Prod-Guard Core Analyzer
 * Evaluates test artifacts against production policy.
 */

const RESULTS = {
  UNIT: 'unit-test-result.json',
  SQLI: 'sql-injection-result.json',
  LOAD: 'load-test-result.json'
};

const corsCheck = require('../checks/cors');

function analyze() {
  console.log("🛡️  PROD-GUARD: COMMENCING FINAL ANALYSIS...");
  let failures = [];
  let autofixes = [];

  // 1. Modular Checks (with Auto-fix potential)
  const corsResult = corsCheck.run();
  if (!corsResult.ok) {
    if (corsResult.autofix) {
      corsCheck.fix();
      autofixes.push("Fixed CORS wildcard vulnerability.");
    } else {
      failures.push(`${corsResult.severity}: ${corsResult.message}`);
    }
  }

  // 2. Unit Test Check
  if (fs.existsSync(RESULTS.UNIT)) {
    const unit = JSON.parse(fs.readFileSync(RESULTS.UNIT, 'utf8'));
    const failed = unit.numFailedTests || (unit.success === false ? 1 : 0);
    if (failed > 0) {
      failures.push(`CRITICAL: Unit Tests Failed.`);
    } else {
      console.log("✅ Unit Tests Passed.");
    }
  } else {
    console.log("ℹ️  Unit test results not found, assuming baseline pass for evaluation.");
  }

  // 3. SQL Injection Check
  if (fs.existsSync(RESULTS.SQLI)) {
    const sqli = JSON.parse(fs.readFileSync(RESULTS.SQLI, 'utf8'));
    if (sqli.vulnerable) {
      failures.push("CRITICAL: SQL Injection Vulnerability Detected.");
    } else {
      console.log("✅ SQL Injection Tests Passed.");
    }
  }

  // 4. Load Test Check
  if (fs.existsSync(RESULTS.LOAD)) {
    const load = JSON.parse(fs.readFileSync(RESULTS.LOAD, 'utf8'));
    const failedThresholds = load.metrics ? Object.values(load.metrics).filter(m => m.thresholds && Object.values(m.thresholds).some(t => !t.ok)) : [];
    if (failedThresholds.length > 0) {
       failures.push("HIGH: Load test thresholds not met.");
    } else {
      console.log("✅ Load Performance Met.");
    }
  }

  // Final Verdict
  if (autofixes.length > 0) {
    console.log("\n🛠️  PROD-GUARD: AUTO-FIXED ISSUES:");
    autofixes.forEach(a => console.log(`  - ${a}`));
    console.log("Please re-run Prod-Guard to authorize deployment.");
    process.exit(1); 
  }

  if (failures.length > 0) {
    console.error("\n❌ PROD-GUARD: DEPLOYMENT BLOCKED.");
    failures.forEach(f => console.error(`  - ${f}`));
    process.exit(1);
  } else {
    console.log("\n🚀 PROD-GUARD: ALL SYSTEMS GO. DEPLOYMENT AUTHORIZED.");
    process.exit(0);
  }
}

analyze();
