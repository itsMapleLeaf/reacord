import packageJson from "reacord/package.json"
import { Link } from "remix"
import LandingExample from "~/components/landing-example.mdx"

export default function Landing() {
  return (
    <main className="flex min-w-0 min-h-screen p-4 text-center">
      <div className="w-full max-w-screen-md px-4 py-6 m-auto space-y-5 rounded-lg shadow-md bg-slate-800">
        <h1 className="text-6xl font-light">reacord</h1>
        <div className="w-full overflow-x-auto">
          <section className="mx-auto text-sm shadow w-fit sm:text-base">
            <LandingExample />
          </section>
        </div>
        <p className="px-8 text-2xl font-light">{packageJson.description}</p>
        <Link
          to="/docs/guides/getting-started"
          className="inline-block px-4 py-3 text-xl transition rounded-lg bg-emerald-700 hover:translate-y-[-2px] hover:bg-emerald-800 hover:shadow-md "
        >
          Get Started
        </Link>
      </div>
    </main>
  )
}
