import dotsBackgroundUrl from "~/assets/dots-background.svg"
import { AppFooter } from "~/modules/app/app-footer"
import { AppLogo } from "~/modules/app/app-logo"
import LandingCode from "~/modules/landing/landing-code.mdx"
import { MainNavigation } from "~/modules/navigation/main-navigation"
import { buttonClass, maxWidthContainer } from "~/modules/ui/components"
import { LandingAnimation } from "../modules/landing/landing-animation"
import { UncontrolledModal } from "../modules/ui/modal"

export default function Landing() {
  return (
    <>
      <div
        className="fixed inset-0 rotate-6 scale-125 opacity-20"
        style={{ backgroundImage: `url(${dotsBackgroundUrl})` }}
      />
      <div className="flex flex-col relative min-w-0 min-h-screen pb-4 gap-4">
        <header className={maxWidthContainer}>
          <MainNavigation />
        </header>
        <div className="flex flex-col gap-4 my-auto px-4">
          <AppLogo className="w-full max-w-lg mx-auto" />

          <div className="max-w-md w-full mx-auto">
            <LandingAnimation />
          </div>

          <p className="text-center text-lg font-light -mb-1">
            Create interactive Discord messages with React.
          </p>

          <div className="flex gap-4 self-center">
            <a
              href="/guides/getting-started"
              className={buttonClass({ variant: "solid" })}
            >
              Get Started
            </a>

            <UncontrolledModal
              button={(button) => (
                <button
                  {...button}
                  className={buttonClass({ variant: "semiblack" })}
                >
                  Show Code
                </button>
              )}
            >
              <div className="text-sm sm:text-base">
                <LandingCode />
              </div>
            </UncontrolledModal>
          </div>
        </div>

        <div className="text-center">
          <AppFooter />
        </div>
      </div>
    </>
  )
}
