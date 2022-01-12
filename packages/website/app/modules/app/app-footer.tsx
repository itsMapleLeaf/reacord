import { HeartIcon } from "@heroicons/react/solid"
import clsx from "clsx"
import { ExternalLink } from "~/modules/dom/external-link"
import { linkClass, maxWidthContainer } from "~/modules/ui/components"

export function AppFooter() {
  return (
    <footer className={clsx(maxWidthContainer, "text-xs opacity-75")}>
      <address className="not-italic">
        &copy; {new Date().getFullYear()} itsMapleLeaf
      </address>
      <p>
        Coded with <HeartIcon className="inline w-4 align-sub" /> using{" "}
        <ExternalLink className={linkClass} href="https://remix.run">
          Remix
        </ExternalLink>
      </p>
      <p>
        Uses{" "}
        <ExternalLink className={linkClass} href="https://umami.is/">
          umami
        </ExternalLink>{" "}
        for simple, non-identifying analytics.
      </p>
    </footer>
  )
}
