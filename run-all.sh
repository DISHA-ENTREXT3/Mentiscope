#!/bin/bash
set -e

# Master Test Runner for Prod-Guard
# Usage: ./run-all.sh

echo "🛠️  Starting Production Readiness Gate..."

# 1. Environment Check
if [ -z "$BASE_URL" ]; then
  export BASE_URL=http://localhost:5000
fi
echo "📍 Target URL: $BASE_URL"

# 2. Run Unit Tests (Backend)
echo "🧪 Running Unit Tests..."
cd backend-node && npm test -- --json --outputFile=../unit-test-result.json || echo '{"numFailedTests": 1}' > ../unit-test-result.json
cd ..

# 3. Run SQL Injection Tests
echo "🛡️  Running SQL Injection Simulation..."
node tests/sql-injection.test.js || echo '{"vulnerable": true}' > sql-injection-result.json

# 4. Run Load Tests (if k6 exists, else mock)
echo "📈 Running Load Tests..."
if command -v k6 &> /dev/null
then
    k6 run --out json=load-test-result.json tests/load.test.js || true
else
    echo '{"metrics": {}}' > load-test-result.json
    echo "⚠️  k6 not found, skip load test execution (using mock results)."
fi

# 5. Run Prod-Guard Analysis
echo "⚖️  Invoking Prod-Guard Governance engine..."
node prod-guard/core/analyzer.js
