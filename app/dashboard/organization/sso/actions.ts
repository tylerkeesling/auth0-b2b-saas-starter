"use server"

import { revalidatePath } from "next/cache"
import { Session } from "@auth0/nextjs-auth0"

import { appClient, managementClient } from "@/lib/auth0"
import { verifyDnsRecords } from "@/lib/domain-verification"
import { withServerActionAuth } from "@/lib/with-server-action-auth"

export const verifyDomain = withServerActionAuth(
  async function verifyDomain(domain: string, session: Session) {
    if (!domain || typeof domain !== "string") {
      return {
        error: "Domain is required.",
      }
    }

    try {
      const verified = await verifyDnsRecords(domain, session.user.org_id)

      return { verified }
    } catch (error) {
      console.error("failed to validate the domain", error)
      return {
        error: "Failed to validate the domain.",
      }
    }
  },
  {
    role: "admin",
  }
)

export const createSSOEnrollemnt = withServerActionAuth(
  async function createSSOEntrollment() {
    const session = await appClient.getSession()

    try {
      const orgId = session?.user.org_id

      const { data: enrollmentTicket } =
        await managementClient.selfServiceProfiles.createSsoTicket(
          {
            id: "ssp_1JYaFD4Zq9wno7HaEdfmr6",
          },
          {
            enabled_organizations: [{ organization_id: orgId }],
            connection_config: {
              display_name: "Random Name 1",
              name: "random-name-1",
            },
          }
        )

      revalidatePath("/dashboard/organization/sso", "layout")

      return {
        ticketUrl: enrollmentTicket.ticket,
      }
    } catch (error) {
      return {
        error: "There was a problem creating the connection.",
      }
    }
  },
  {
    role: "admin",
  }
)
