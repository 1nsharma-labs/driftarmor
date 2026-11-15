import assert from 'node:assert';

import { scanTerraformDirectory } from '../core/src/parser/hcl.js';
import { estimateResourceCost, estimatePlanCost, INSTANCE_PRICING } from '../core/src/cost/catalog.js';
import { detectInfrastructureDrift } from '../core/src/drift/detector.js';
import { generateHtmlReport } from '../core/src/report/html.js';
import { LicenseVerifier } from '../ee/license/verifier.js';
import { evaluatePullRequestBudget } from '../ee/gatekeeper/budgetGate.js';

console.log('🧪 Starting DriftArmor Test Suite...\n');

// 1. Parser & Resource Discovery
console.log('Test 1: Terraform HCL Scanner & Resource Discovery');
const resources = scanTerraformDirectory();
assert.ok(resources.length >= 5);
assert.strictEqual(resources[0].name, 'api_gateway_vm');
assert.strictEqual(resources[0].type, 'aws_instance');
console.log('  ✅ Discovered', resources.length, 'Terraform resources');

// 2. Pricing & Cost Estimation
console.log('\nTest 2: Cloud Cost Estimation Catalog');
const ec2Cost = estimateResourceCost({ type: 'aws_instance', attributes: { instance_type: 'm6i.xlarge' } });
assert.strictEqual(ec2Cost, 140.16);
console.log('  ✅ EC2 m6i.xlarge cost verified: $140.16/mo');

const rdsCost = estimateResourceCost({ type: 'aws_db_instance', attributes: { instance_class: 'db.r6g.xlarge', storage_gb: 500 } });
assert.ok(rdsCost > 340);
console.log('  ✅ RDS db.r6g.xlarge cost verified: $' + rdsCost + '/mo');

const planCost = estimatePlanCost(resources);
assert.ok(planCost.totalMonthlyUSD > 0);
assert.ok(planCost.totalAnnualUSD > 0);
console.log('  ✅ Total Planned Spend:', `$${planCost.totalMonthlyUSD}/mo`, `($${planCost.totalAnnualUSD}/yr)`);

// 3. Drift Detection
console.log('\nTest 3: Infrastructure Out-of-Band Drift Detector');
const drifts = detectInfrastructureDrift();
assert.ok(drifts.length >= 3);
assert.ok(drifts.some(d => d.severity === 'CRITICAL'));
console.log('  ✅ Detected', drifts.length, 'active console drifts');

// 4. HTML Report Generation
console.log('\nTest 4: Executive HTML Report Generation');
const html = generateHtmlReport(planCost, drifts);
assert.ok(html.includes('DriftArmor Audit Report'));
assert.ok(html.includes(planCost.totalMonthlyUSD.toFixed(2)));
assert.ok(html.includes('api_gateway_vm'));
console.log('  ✅ Executive HTML report compiled cleanly');

// 5. Enterprise Gatekeeper
console.log('\nTest 5: Enterprise PR Budget Gatekeeper');
const gateSafe = evaluatePullRequestBudget({ totalMonthlyUSD: 100.0 }, 250.0);
assert.strictEqual(gateSafe.allowed, true);
const gateExceeded = evaluatePullRequestBudget({ totalMonthlyUSD: 650.0 }, 250.0);
assert.strictEqual(gateExceeded.allowed, false);
assert.strictEqual(gateExceeded.status, 'BLOCKED_BUDGET_EXCEEDED');
console.log('  ✅ PR budget gatekeeper verified (Safe vs Blocked)');

// 6. Enterprise Offline Cryptographic License Verifier
console.log('\nTest 6: Offline Cryptographic License Verifier (BSL 1.1)');
const verifier = new LicenseVerifier('test-key');
const key = verifier.generateKey('AcmeTerra', 90, 'ENT');
const res = verifier.verifyKey(key);
assert.strictEqual(res.valid, true);
assert.strictEqual(res.organization, 'ACMETERRA');
assert.strictEqual(res.tier, 'ENTERPRISE');
console.log('  ✅ Enterprise cryptographic key verification passed');

console.log('\n🎉 ALL DRIFTARMOR TESTS PASSED SUCCESSFULLY! 100% Operational.\n');
