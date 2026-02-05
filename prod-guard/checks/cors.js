const fs = require('fs');
const path = require('path');

/**
 * CORS Safety Check & Auto-Fix
 * Ensures no wildcards or unsafe origins are used in production.
 */

const TARGET_FILE = path.join(process.cwd(), 'backend-node/src/index.js');

function run() {
  if (!fs.existsSync(TARGET_FILE)) return { ok: true };

  const content = fs.readFileSync(TARGET_FILE, 'utf8');
  const hasWildcard = content.includes("origin: '*'") || content.includes("origin: true");

  if (hasWildcard) {
    console.warn("⚠️  [CORS] Unsafe CORS policy detected (Wildcard/Allow-All).");
    return { 
      ok: false, 
      name: "CORS Safety", 
      severity: "LOW", 
      autofix: true,
      message: "Wildcard origin detected in Express CORS config."
    };
  }

  return { ok: true };
}

function fix() {
  console.log("🛠️  [CORS] Auto-fixing CORS configuration...");
  let content = fs.readFileSync(TARGET_FILE, 'utf8');
  
  // Replace wildcard with allowed origins from env or default
  const safeCors = `origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }`;
    
  // This is a simplified regex-based fix for the demo
  if (content.includes("origin: '*'")) {
    content = content.replace("origin: '*'", safeCors);
    fs.writeFileSync(TARGET_FILE, content);
    console.log("✅ [CORS] Fixed. Re-run tests to verify.");
  }
}

module.exports = { run, fix };
