<h1 align="center">🛡️ DriftArmor</h1>

<p align="center">
  <b>The Open-Source Terraform Drift Detector & Cloud Cost Firewall</b><br>
  Estimate monthly AWS & GCP costs directly on Pull Requests, detect manual out-of-band console drift, and enforce hard infrastructure budget limits before \`terraform apply\`.
</p>

<p align="center">
  <a href="https://github.com/1nsharma-labs/driftarmor/blob/main/LICENSE"><img src="https://img.shields.io/badge/License-Apache_2.0-blue.svg" alt="License"></a>
  <a href="https://github.com/1nsharma-labs/driftarmor/blob/main/ee/LICENSE-EE"><img src="https://img.shields.io/badge/EE_License-BSL_1.1-purple.svg" alt="EE License"></a>
  <a href="https://github.com/sponsors/1nsharma"><img src="https://img.shields.io/badge/Sponsor-GitHub_Sponsors-pink.svg" alt="Sponsor"></a>
  <a href="https://1nsharma-labs.github.io/driftarmor/"><img src="https://img.shields.io/badge/Live_Demo-Interactive_Report-8b5cf6.svg" alt="Live Demo"></a>
</p>

---

## ⚡ What is DriftArmor?

In modern cloud teams, developers write Terraform code (`.tf`) to manage infrastructure. But two major problems constantly burn cloud budgets and trigger production outages:

1. **💸 Hidden Infrastructure Bill Surprises:** Merging a PR that upgrades an RDS database or adds an `m6i.xlarge` instance causes silent monthly cost increases of thousands of dollars.
2. **⚠️ Out-of-Band Console Drift:** Engineers frequently make emergency tweaks directly in the AWS/GCP web console (e.g. opening security groups, resizing disks). The next `terraform apply` either wipes out the fix or crashes.

**DriftArmor** parses your Terraform code, estimates exact monthly cost deltas before you merge, detects out-of-band console drift, and comments directly on your GitHub Pull Requests.

* 💰 **Pre-Merge Cost Estimation:** Calculates monthly spend ($/mo) and annualized run-rate ($/yr) for EC2, RDS, NAT Gateways, EBS, EKS, and GKE.
* 🔍 **Console Drift Detection:** Identifies manual out-of-band changes that diverge from your code.
* 💬 **GitHub PR Cost Comments:** Outputs clean, formatted Markdown tables for your CI/CD pipelines.
* 📊 **Executive HTML Reports:** Visual FinOps dashboard for engineering leadership and cloud architects.
* ⚡ **Zero External Dependencies:** Pure Node.js ESM. Runs in `< 40ms` without bulky CLI bloat.

---

## 🌐 Live Interactive Demo

View a sample executive Terraform cost & drift audit report in your browser without cloning or installing:
👉 [**https://1nsharma-labs.github.io/driftarmor/**](https://1nsharma-labs.github.io/driftarmor/)

---

## 🚀 Quick Start (30 Seconds)

### Run via npx (Zero Installation)

```bash
# 1. Estimate monthly cloud costs for your Terraform files
npx @1nsharma-labs/driftarmor cost ./terraform

# 2. Inspect manual out-of-band console drift
npx @1nsharma-labs/driftarmor drift ./terraform

# 3. Generate interactive executive HTML report
npx @1nsharma-labs/driftarmor report ./terraform --output drift-report.html

# 4. Generate GitHub Pull Request Markdown comment for CI/CD
npx @1nsharma-labs/driftarmor pr-comment ./terraform
```

---

## 💻 Sample Terminal Output

```text
  ==============================================================
    🛡️  DriftArmor — Terraform Drift & Cost Firewall v1.0.0
    🏢  Organization: 1nsharma-labs
  ==============================================================
  
  💰 TERRAFORM PLANNED COST ESTIMATION:
  --------------------------------------------------------------
  💵 Total Planned Monthly Cost:   $725.15 / month
  📅 Total Annualized Run-Rate:    $8701.80 / year
  📦 Managed Cloud Resources:      5 resources
  --------------------------------------------------------------
  
  RESOURCE COST BREAKDOWN:
  ---------------------------------------------------------------------------
  RESOURCE NAME                   TYPE                 ACTION     MONTHLY
  ---------------------------------------------------------------------------
  api_gateway_vm                  aws_instance         CREATE     $140.16/mo
  primary_postgres                aws_db_instance      UPDATE     $399.14/mo
  vpc_nat_gw                      aws_nat_gateway      CREATE     $32.85/mo
  analytics_data_disk             aws_ebs_volume       UPDATE     $80.00/mo
  production_cluster              aws_eks_cluster      CREATE     $73.00/mo
  ---------------------------------------------------------------------------
```

---

## 🤖 GitHub Actions Pull Request Integration

Add DriftArmor to your GitHub Actions workflow to post automated cost impact comments on every pull request:

```yaml
name: Terraform Cost Firewall
on: [pull_request]

jobs:
  cost-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
      - name: Run DriftArmor Cost Check
        run: npx @1nsharma-labs/driftarmor pr-comment ./terraform
```

---

## 💼 Dual Licensing & Open-Core Model

* **Community Core (`/core`):** Licensed under **Apache License 2.0**. 100% free for individual developers and organizations managing up to 50 cloud resources.
* **Enterprise Edition (`/ee`):** Licensed under **Business Source License (BSL 1.1)**. Includes automated CI/CD PR merge blockers, budget gatekeepers, and Slack/Teams approval bots.

See [PRICING.md](PRICING.md) for pricing tiers.

---

## 🤝 Support & Enterprise

* **Direct Personal Email:** [tech@mowglai.com](mailto:tech@mowglai.com)
* **Enterprise Inquiries & Bounties:** [polar.sh/1nsharma-labs](https://polar.sh/1nsharma-labs)
* **Founder & Lead:** **Amit Sharma** (@1nsharma)
* **GitHub Sponsors:** [github.com/sponsors/1nsharma](https://github.com/sponsors/1nsharma)
* **Polar.sh:** [polar.sh/1nsharma-labs](https://polar.sh/1nsharma-labs)

---

## 🌐 The 1nsharma-labs Open-Source Suite

* 🛡️ [**TokenArmor**](https://github.com/1nsharma-labs/tokenarmor): AI Gateway & Token FinOps Firewall.
* ☸️ [**KubePrune**](https://github.com/1nsharma-labs/kubeprune): Kubernetes Over-Provisioning & Pod Waste Killer.
* 🍃 [**CloudPrune**](https://github.com/1nsharma-labs/cloudprune): AWS & GCP Cloud Waste & Zombie Resource Killer.
* 🔒 [**CompliGuard**](https://github.com/1nsharma-labs/compliguard): Continuous SOC 2 & ISO 27001 Evidence Engine.
* 🔑 [**SecretArmor**](https://github.com/1nsharma-labs/secretarmor): Zero-Trust Secret Sprawl & API Key Leak Firewall.
* 🏗️ [**DriftArmor**](https://github.com/1nsharma-labs/driftarmor): Terraform Drift Detector & Cloud Cost Firewall.
