import packageJson from "reacord/package.json"
import type { LoaderFunction } from "remix"
import { Link, useLoaderData } from "remix"
import LandingExample from "~/components/landing-example.mdx"
import { MainNavigation } from "~/components/main-navigation"
import type { ContentIndexEntry } from "~/helpers/create-index.server"
import { createContentIndex } from "~/helpers/create-index.server"
import { maxWidthContainer } from "~/styles"

type LoaderData = ContentIndexEntry[]

export const loader: LoaderFunction = async () => {
  const data: LoaderData = await createContentIndex("app/routes/docs/guides")
  return data
}

export default function Landing() {
  const data: LoaderData = useLoaderData()
  return (
    <div className="flex flex-col min-w-0 min-h-screen text-center">
      <header className={maxWidthContainer}>
        <MainNavigation guideRoutes={data} />
      </header>
      <div className="px-4 pb-8 flex flex-1">
        <main className="px-4 py-6 rounded-lg shadow bg-slate-800 space-y-5 m-auto w-full max-w-xl">
          <h1 className="text-6xl font-light">reacord</h1>
          <section className="mx-auto text-sm sm:text-base">
            <LandingExample />
          </section>
          <p className="text-2xl font-light">{packageJson.description}</p>
          <Link
            to="/docs/guides/getting-started"
            className="inline-block px-4 py-3 text-xl transition rounded-lg bg-emerald-700 hover:translate-y-[-2px] hover:bg-emerald-800 hover:shadow"
          >
            Get Started
          </Link>
        </main>
      </div>
    </div>
  )
}
