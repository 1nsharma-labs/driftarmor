/**
 * Generate a standalone executive visual HTML report for DriftArmor audit
 */
export function generateHtmlReport(costAnalysis, driftFindings = []) {
  const now = new Date().toLocaleString();

  return `<!DOCTYPE html>
<html lang="en" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DriftArmor Audit Report | Terraform FinOps & Drift</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <style>
    body { background-color: #0b0f17; color: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
    .glass { background: rgba(17, 24, 39, 0.7); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.08); }
    .pulse-dot { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
    @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
  </style>
</head>
<body class="min-h-screen p-4 md:p-8">

  <!-- Header -->
  <header class="max-w-6xl mx-auto mb-8 flex flex-col md:flex-row items-center justify-between gap-4 glass rounded-2xl p-6">
    <div class="flex items-center gap-3">
      <div class="w-12 h-12 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center text-white text-2xl shadow-lg shadow-violet-500/20">
        <i class="fa-solid fa-cubes-stacked"></i>
      </div>
      <div>
        <div class="flex items-center gap-2">
          <h1 class="text-2xl font-bold tracking-tight text-white">DriftArmor Audit Report</h1>
          <span class="text-xs px-2.5 py-0.5 rounded-full bg-violet-500/20 text-violet-400 font-semibold border border-violet-500/30">Terraform FinOps</span>
          <span class="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/30">v1.0.0</span>
        </div>
        <p class="text-xs text-gray-400">1nsharma-labs &bull; Audited on ${now}</p>
      </div>
    </div>
    <div class="flex items-center gap-3">
      <a href="https://github.com/1nsharma-labs/driftarmor" target="_blank" class="px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-xs font-semibold text-gray-200 border border-gray-700 transition flex items-center gap-2">
        <i class="fa-brands fa-github text-sm"></i> GitHub Repository
      </a>
      <a href="https://github.com/sponsors/1nsharma" target="_blank" class="px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-xs font-semibold text-white shadow-lg shadow-pink-600/30 transition flex items-center gap-2">
        <i class="fa-solid fa-heart text-xs"></i> Sponsor
      </a>
    </div>
  </header>

  <main class="max-w-6xl mx-auto space-y-6">

    <!-- Top KPI Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="glass p-6 rounded-2xl">
        <div class="text-xs uppercase tracking-wider font-semibold text-gray-400 mb-1">Monthly Terraform Cost</div>
        <div class="text-3xl font-extrabold text-white">$${costAnalysis.totalMonthlyUSD.toFixed(2)}</div>
        <p class="text-xs text-gray-400 mt-2">Planned monthly cloud run rate</p>
      </div>

      <div class="glass p-6 rounded-2xl">
        <div class="text-xs uppercase tracking-wider font-semibold text-gray-400 mb-1">Annual Projected Cost</div>
        <div class="text-3xl font-extrabold text-violet-400">$${costAnalysis.totalAnnualUSD.toFixed(2)}</div>
        <p class="text-xs text-gray-400 mt-2">12-month annualized infrastructure spend</p>
      </div>

      <div class="glass p-6 rounded-2xl">
        <div class="text-xs uppercase tracking-wider font-semibold text-gray-400 mb-1">Managed Resources</div>
        <div class="text-3xl font-extrabold text-cyan-400">${costAnalysis.resourceCount}</div>
        <p class="text-xs text-gray-400 mt-2">EC2, RDS, NAT GW, EBS, EKS</p>
      </div>

      <div class="glass p-6 rounded-2xl">
        <div class="text-xs uppercase tracking-wider font-semibold text-gray-400 mb-1">Drift Incidents</div>
        <div class="text-3xl font-extrabold ${driftFindings.length > 0 ? 'text-rose-500' : 'text-emerald-400'}">${driftFindings.length}</div>
        <p class="text-xs text-gray-400 mt-2">Manual console modifications found</p>
      </div>
    </div>

    <!-- Cost Breakdown Table -->
    <div class="glass p-6 rounded-2xl">
      <div class="flex items-center justify-between mb-4">
        <div>
          <h2 class="text-lg font-bold text-white flex items-center gap-2">
            <i class="fa-solid fa-calculator text-violet-400"></i>
            Planned Infrastructure Cost Breakdown
          </h2>
          <p class="text-xs text-gray-400">Live price estimation for Terraform resources before \`terraform apply\`.</p>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead>
            <tr class="border-b border-gray-800 text-gray-400 font-medium">
              <th class="py-3 px-3">Resource</th>
              <th class="py-3 px-3">Type</th>
              <th class="py-3 px-3">Action</th>
              <th class="py-3 px-3">File</th>
              <th class="py-3 px-3 text-right">Monthly Cost</th>
              <th class="py-3 px-3 text-right">Annual Cost</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-800/60 font-mono">
            ${costAnalysis.breakdown.map(r => `
              <tr class="hover:bg-gray-800/40 transition">
                <td class="py-3 px-3 font-semibold text-white font-sans">${r.name}</td>
                <td class="py-3 px-3 text-gray-400 font-sans">${r.type}</td>
                <td class="py-3 px-3">
                  <span class="px-2 py-0.5 rounded text-[10px] font-bold font-sans ${r.action === 'create' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'}">
                    ${r.action.toUpperCase()}
                  </span>
                </td>
                <td class="py-3 px-3 text-gray-400 font-sans">${r.file}</td>
                <td class="py-3 px-3 text-right font-bold text-white">$${r.monthlyUSD.toFixed(2)}/mo</td>
                <td class="py-3 px-3 text-right text-gray-400">$${r.annualUSD.toFixed(2)}/yr</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <!-- Drift Incidents Section -->
    <div class="glass p-6 rounded-2xl">
      <div class="flex items-center justify-between mb-4">
        <div>
          <h2 class="text-lg font-bold text-white flex items-center gap-2">
            <i class="fa-solid fa-triangle-exclamation text-rose-500"></i>
            Active Infrastructure Drift & Out-of-Band Changes
          </h2>
          <p class="text-xs text-gray-400">Modifications made directly in the AWS/GCP web console that diverge from code.</p>
        </div>
      </div>

      <div class="space-y-3">
        ${driftFindings.map(d => `
          <div class="p-4 rounded-xl bg-gray-900 border border-gray-800 space-y-2">
            <div class="flex items-center justify-between">
              <span class="font-mono text-sm font-bold text-white">${d.resource}</span>
              <span class="text-[10px] font-bold px-2 py-0.5 rounded ${d.severity === 'CRITICAL' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'}">
                ${d.severity}
              </span>
            </div>
            <p class="text-xs text-gray-300 font-sans">${d.details}</p>
            <div class="text-[11px] font-mono text-cyan-400 bg-black/40 p-2 rounded border border-gray-800">
              💡 Fix: ${d.remediation}
            </div>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- CI/CD PR Bot Integration Guide -->
    <div class="glass p-6 rounded-2xl">
      <h3 class="text-base font-bold text-white mb-2">⚡ 1-Line GitHub PR Cost Firewall</h3>
      <p class="text-xs text-gray-400 mb-4">Run DriftArmor in your GitHub Actions CI/CD to comment cost deltas directly on pull requests:</p>
      <div class="bg-black/60 border border-gray-800 rounded-xl p-4 font-mono text-xs text-violet-400 flex items-center justify-between">
        <span>npx @1nsharma-labs/driftarmor pr-comment</span>
        <button onclick="navigator.clipboard.writeText('npx @1nsharma-labs/driftarmor pr-comment'); alert('Command copied!')" class="px-2 py-1 rounded bg-gray-800 hover:bg-gray-700 text-gray-300 text-[11px]">Copy</button>
      </div>
    </div>

  </main>
</body>
</html>`;
}
