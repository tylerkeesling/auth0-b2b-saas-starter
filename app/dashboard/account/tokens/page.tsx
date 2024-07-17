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

    const idToken =
      session?.idToken && JSON.parse(atob(session.idToken.split(".")[1]))

    const accessToken =
      session?.accessToken &&
      JSON.parse(atob(session.accessToken.split(".")[1]))

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
              An ID token is an artifact that proves{" "}
              <span className="font-bold">
                the user has been authenticated.
              </span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid w-full items-center gap-1.5">
              <Code
                theme="material-darker"
                className="!m-0 !rounded-xl text-sm"
                lang="json"
              >
                {JSON.stringify(idToken, null, 2)}
              </Code>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Access Token</CardTitle>
            <CardDescription>
              An access token is an artifact that{" "}
              <span className="font-bold">
                allows the client application to access the user&apos;s
                resources.
              </span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid w-full items-center gap-1.5">
              <Code
                theme="material-darker"
                className="!m-0 !rounded-xl text-sm"
                lang="json"
              >
                {JSON.stringify(accessToken, null, 2)}
              </Code>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  },
  { returnTo: "/dashboard/account/tokens" }
)
