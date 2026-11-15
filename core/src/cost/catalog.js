/**
 * DriftArmor Cloud Resource Pricing Benchmarks (Standard US-East / us-central)
 */
export const INSTANCE_PRICING = {
  // AWS EC2
  't3.micro': 7.59,
  't3.small': 15.18,
  't3.medium': 30.37,
  't3.large': 60.74,
  't3.xlarge': 121.47,
  'm6i.large': 70.08,
  'm6i.xlarge': 140.16,
  'm6i.2xlarge': 280.32,
  'c6i.xlarge': 122.64,
  'c6i.2xlarge': 245.28,

  // AWS RDS
  'db.t3.micro': 12.41,
  'db.t3.small': 24.82,
  'db.t3.medium': 49.64,
  'db.r6g.large': 170.82,
  'db.r6g.xlarge': 341.64,

  // GCP Compute Engine
  'e2-micro': 6.11,
  'e2-small': 12.23,
  'e2-medium': 24.46,
  'e2-standard-2': 48.91,
  'e2-standard-4': 97.82,
  'n2-standard-4': 141.62
};

export const FIXED_RESOURCE_PRICING = {
  'aws_nat_gateway': 32.85,
  'aws_eks_cluster': 73.00,
  'google_container_cluster': 73.00,
  'aws_elastic_load_balancer': 16.20,
  'aws_alb': 22.50
};

export const EBS_PRICE_PER_GB = 0.08;

/**
 * Estimate monthly cost for a single Terraform resource
 */
export function estimateResourceCost(resource) {
  const type = resource.type;
  const attrs = resource.attributes || {};

  // 1. EC2 Compute
  if (type === 'aws_instance' || type === 'google_compute_instance') {
    const inst = attrs.instance_type || attrs.machine_type || 't3.medium';
    return INSTANCE_PRICING[inst] || 30.37;
  }

  // 2. RDS Database
  if (type === 'aws_db_instance' || type === 'google_sql_database_instance') {
    const dbClass = attrs.instance_class || 'db.t3.medium';
    const baseCost = INSTANCE_PRICING[dbClass] || 49.64;
    const storageGb = attrs.storage_gb || 20;
    const storageCost = storageGb * 0.115; // RDS gp3 is ~$0.115/GB
    return Number((baseCost + storageCost).toFixed(2));
  }

  // 3. Fixed pricing resources (NAT Gateway, EKS, etc.)
  if (FIXED_RESOURCE_PRICING[type]) {
    return FIXED_RESOURCE_PRICING[type];
  }

  // 4. EBS Volumes
  if (type === 'aws_ebs_volume') {
    const size = attrs.storage_gb || 100;
    return Number((size * EBS_PRICE_PER_GB).toFixed(2));
  }

  return 15.00; // generic cloud resource default estimate
}

/**
 * Estimate total monthly cost delta for a collection of Terraform resources
 */
export function estimatePlanCost(resources = []) {
  let monthlyTotalUSD = 0;
  const breakdown = [];

  for (const r of resources) {
    const cost = estimateResourceCost(r);
    monthlyTotalUSD += cost;

    breakdown.push({
      file: r.file,
      type: r.type,
      name: r.name,
      action: r.action || 'manage',
      monthlyUSD: Number(cost.toFixed(2)),
      annualUSD: Number((cost * 12).toFixed(2))
    });
  }

  return {
    totalMonthlyUSD: Number(monthlyTotalUSD.toFixed(2)),
    totalAnnualUSD: Number((monthlyTotalUSD * 12).toFixed(2)),
    resourceCount: resources.length,
    breakdown
  };
}
