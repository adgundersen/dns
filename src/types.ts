export interface DomainCheckResult {
  domain: string
  available: boolean
  price?: number
  currency?: string
}

export interface ProvisionDomainRequest {
  domain: string
  customerSlug: string
  targetIP: string  // IP or hostname to point DNS at
}

export interface DomainRecord {
  domain: string
  customerSlug: string
  cloudflareZoneId: string
  status: DomainStatus
  createdAt: string
}

export type DomainStatus = "provisioning" | "active" | "failed" | "released"

export interface ApiError {
  error: string
}
