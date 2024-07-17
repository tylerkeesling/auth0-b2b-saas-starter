import { Code } from "bright"

import { appClient } from "@/lib/auth0"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { PageHeader } from "@/components/page-header"

export default appClient.withPageAuthRequired(
  async function Profile() {
    const session = await appClient.getSession()

    const arrayToken = session?.idToken?.split(".")
    const tokenPayload = arrayToken && JSON.parse(atob(arrayToken[1]))

    return (
      <div className="space-y-2">
        <PageHeader
          title="Tokens"
          description="View your ID Token and Access Token."
        />
        <Card>
          <CardHeader>
            <CardTitle>ID Token</CardTitle>
            <CardDescription>
              This token represents who you are.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid w-full items-center gap-1.5">
              <Code lang="json">{JSON.stringify(tokenPayload, null, 2)}</Code>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">The Footer</CardFooter>
        </Card>
      </div>
    )
  },
  { returnTo: "/dashboard/account/tokens" }
)
