import type { FastifyInstance } from "fastify"
import type { DomainCheckResult, ProvisionDomainRequest, ApiError } from "./types"
import * as cf from "./cloudflare"

export async function registerRoutes(app: FastifyInstance) {

  // Check domain availability
  app.get<{ Querystring: { domain: string } }>("/domains/check", async (req, reply) => {
    const { domain } = req.query
    if (!domain) return reply.status(400).send({ error: "domain is required" })

    const result = await cf.checkDomain(domain)
    return reply.send(result)
  })

  // Provision a domain (register + point DNS) and assign free subdomain
  app.post<{ Body: ProvisionDomainRequest }>("/domains", async (req, reply) => {
    const { domain, customerSlug, targetIP } = req.body
    if (!customerSlug || !targetIP) {
      return reply.status(400).send({ error: "customerSlug and targetIP are required" })
    }

    // Always create the free subdomain
    await cf.createSubdomain(customerSlug, targetIP)

    // Register and point custom domain if provided
    if (domain) {
      await cf.registerDomain(domain)
      await cf.createDNSRecord(domain, targetIP)
    }

    return reply.status(201).send({ customerSlug, domain: domain ?? null, status: "provisioning" })
  })

  // Delete DNS records for a customer
  app.delete<{ Params: { recordId: string } }>("/domains/:recordId", async (req, reply) => {
    const { recordId } = req.params
    await cf.deleteDNSRecord(recordId)
    return reply.status(204).send()
  })

}
