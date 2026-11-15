# Hacker News Launch: Show HN: DriftArmor – Zero-dependency Terraform cost estimator and drift detector

**Title:** Show HN: DriftArmor – Zero-dependency Terraform cost estimator and drift detector

**URL / Text:**
Hey HN! Amit here from 1nsharma-labs.

When writing Terraform code, the biggest fear before running `terraform apply` is:
1. "How much is this EC2/RDS upgrade actually going to cost us per month?"
2. "Did someone manually edit an ingress rule or disk size in the AWS Console during an incident that this apply is going to overwrite?"

Tools like Infracost and Firefly exist, but they often require signing up for third-party cloud SaaS accounts, configuring external tokens, or paying hefty monthly subscriptions.

We built **DriftArmor** – an open-source, zero-dependency Node.js CLI that parses your Terraform HCL files locally, computes the monthly cost delta ($/mo) and annualized run-rate ($/yr), detects out-of-band console drift, and generates clean GitHub Pull Request Markdown comments for your CI/CD pipelines.

Repo: https://github.com/1nsharma-labs/driftarmor
Live Interactive Report Demo: https://1nsharma-labs.github.io/driftarmor/

Features:
- Pure Node.js ESM (< 40ms execution time, zero external npm runtime dependencies)
- Standardized pricing for EC2, RDS, NAT Gateways, EBS, S3, EKS, and GKE
- Instant PR cost impact comment output (`driftarmor pr-comment`)
- Out-of-band console modification detector (`driftarmor drift`)
- Executive standalone HTML dashboard (`driftarmor report`)

Quick test without installing anything:
`npx @1nsharma-labs/driftarmor cost`

Feedback, suggestions, and feature requests are very welcome!
