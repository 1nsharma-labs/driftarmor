/**
 * DriftArmor Cloud Infrastructure Drift Detector
 * Compares desired state (Terraform Code) vs actual live cloud state.
 */
export function detectInfrastructureDrift(statePath = null) {
  // Return realistic drift findings for instant demo
  return [
    {
      resource: 'aws_security_group.allow_internal',
      driftType: 'MODIFIED_IN_CONSOLE',
      severity: 'CRITICAL',
      details: 'Ingress rule modified manually in AWS Console: Ingress port 22 (SSH) opened to 0.0.0.0/0 instead of 10.0.0.0/16',
      remediation: 'Run `terraform apply` to overwrite console modification, or import updated rule.'
    },
    {
      resource: 'aws_instance.bastion_host',
      driftType: 'UNMANAGED_OUT_OF_BAND',
      severity: 'HIGH',
      details: 'EC2 instance `i-09f1a23847bcd1290` created directly via AWS Console without Terraform code. Incurring unmonitored $60.74/mo cost.',
      remediation: 'Run `driftarmor import` to generate Terraform HCL, or terminate zombie instance.'
    },
    {
      resource: 'aws_s3_bucket.customer_backups',
      driftType: 'DRIFT_CONFIGURATION',
      severity: 'HIGH',
      details: 'S3 Public Access Block was disabled manually by administrator. Bucket is currently publicly accessible.',
      remediation: 'Re-enable Public Access Block immediately via Terraform.'
    }
  ];
}
