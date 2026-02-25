import Cloudflare from "cloudflare"
import type { DomainCheckResult, DomainRecord } from "./types"

const cf = new Cloudflare({ apiToken: process.env.CLOUDFLARE_API_TOKEN })

const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID!
const ZONE_ID    = process.env.CLOUDFLARE_ZONE_ID!      // crimata.com zone
const BASE_DOMAIN = process.env.BASE_DOMAIN ?? "crimata.com"

export async function checkDomain(domain: string): Promise<DomainCheckResult> {
  const result = await cf.registrar.domains.get(domain, { account_id: ACCOUNT_ID })
  return {
    domain,
    available: !result.registered_at,
  }
}

export async function registerDomain(domain: string): Promise<string> {
  const result = await cf.registrar.domains.update(domain, {
    account_id: ACCOUNT_ID,
    auto_renew: true,
    locked: false,
    privacy: true,
  })
  return result.id ?? domain
}

export async function createDNSRecord(domain: string, target: string): Promise<string> {
  // Point the custom domain at the ALB/target
  const record = await cf.dns.records.create({
    zone_id: ZONE_ID,
    type: "CNAME",
    name: domain,
    content: target,
    ttl: 1,      // auto
    proxied: true,
  })
  return record.id!
}

export async function createSubdomain(slug: string, target: string): Promise<string> {
  // Free subdomain: slug.crimata.com
  const record = await cf.dns.records.create({
    zone_id: ZONE_ID,
    type: "CNAME",
    name: `${slug}.${BASE_DOMAIN}`,
    content: target,
    ttl: 1,
    proxied: true,
  })
  return record.id!
}

export async function deleteDNSRecord(recordId: string): Promise<void> {
  await cf.dns.records.delete(recordId, { zone_id: ZONE_ID })
}
