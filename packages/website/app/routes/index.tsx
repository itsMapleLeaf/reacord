import clsx from "clsx"
import { useEffect, useRef, useState } from "react"
import blobComfyUrl from "~/assets/blob-comfy.png"
import cursorIbeamUrl from "~/assets/cursor-ibeam.png"
import cursorUrl from "~/assets/cursor.png"
import dotsBackgroundUrl from "~/assets/dots-background.svg"
import { AppFooter } from "~/modules/app/app-footer"
import { AppLogo } from "~/modules/app/app-logo"
import { MainNavigation } from "~/modules/navigation/main-navigation"
import { maxWidthContainer } from "~/modules/ui/components"

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
          {/* <button className="px-3 py-1.5 font-medium bg-black/25 text-sm rounded-full self-center hover:bg-black/40 transition active:transition-none active:translate-y-[2px]">
            Show Code
          </button> */}
        </div>
        <div className="text-center">
          <AppFooter />
        </div>
      </div>
    </>
  )
}

const defaultState = {
  chatInputText: "",
  chatInputCursorVisible: true,
  messageVisible: false,
  count: 0,
  cursorLeft: "25%",
  cursorBottom: "-15px",
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const animationFrame = () =>
  new Promise((resolve) => requestAnimationFrame(resolve))

function LandingAnimation() {
  const [state, setState] = useState(defaultState)
  const chatInputRef = useRef<HTMLDivElement>(null)
  const addRef = useRef<HTMLButtonElement>(null)
  const deleteRef = useRef<HTMLButtonElement>(null)
  const cursorRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const animateClick = (element: HTMLElement) =>
      element.animate(
        [{ transform: `translateY(2px)` }, { transform: `translateY(0px)` }],
        300,
      )

    let running = true

    void (async () => {
      await delay(1000)

      while (running) {
        setState(defaultState)
        await delay(1000)

        for (const letter of "/counter") {
          setState((state) => ({
            ...state,
            chatInputText: state.chatInputText + letter,
          }))
          await delay(100)
        }

        await delay(1000)

        setState((state) => ({
          ...state,
          messageVisible: true,
          chatInputText: "",
        }))
        await delay(1000)

        setState((state) => ({
          ...state,
          cursorLeft: "70px",
          cursorBottom: "40px",
        }))
        await delay(1500)

        for (let i = 0; i < 3; i++) {
          setState((state) => ({
            ...state,
            count: state.count + 1,
            chatInputCursorVisible: false,
          }))
          animateClick(addRef.current!)
          await delay(700)
        }

        await delay(500)

        setState((state) => ({
          ...state,
          cursorLeft: "140px",
        }))
        await delay(1000)

        animateClick(deleteRef.current!)
        setState((state) => ({ ...state, messageVisible: false }))
        await delay(1000)

        setState(() => ({
          ...defaultState,
          chatInputCursorVisible: false,
        }))
        await delay(500)
      }
    })()

    return () => {
      running = false
    }
  }, [])

  useEffect(() => {
    let running = true

    void (async () => {
      while (running) {
        // check if the cursor is in the input
        const cursorRect = cursorRef.current!.getBoundingClientRect()
        const chatInputRect = chatInputRef.current!.getBoundingClientRect()

        const isOverInput =
          cursorRef.current &&
          chatInputRef.current &&
          cursorRect.top + cursorRect.height / 2 > chatInputRect.top

        cursorRef.current!.src = isOverInput ? cursorIbeamUrl : cursorUrl

        await animationFrame()
      }
    })()

    return () => {
      running = false
    }
  })

  return (
    <div
      className="grid gap-2 relative pointer-events-none"
      role="presentation"
    >
      <div
        className={clsx(
          "bg-slate-800 p-4 rounded-lg shadow transition",
          state.messageVisible ? "opacity-100" : "opacity-0 -translate-y-2",
        )}
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 p-2 rounded-full bg-no-repeat bg-contain bg-black/25">
            <img
              src={blobComfyUrl}
              alt=""
              className="object-contain scale-90 w-full h-full"
            />
          </div>
          <div>
            <p className="font-bold">comfybot</p>
            <p>this button was clicked {state.count} times</p>
            <div className="mt-2 flex flex-row gap-3">
              <button
                ref={addRef}
                className="bg-emerald-700 text-white py-1.5 px-3 text-sm rounded"
              >
                +1
              </button>
              <button
                ref={deleteRef}
                className="bg-red-700 text-white py-1.5 px-3 text-sm rounded"
              >
                🗑 delete
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
        className="bg-slate-700 pb-2 pt-1.5 px-4 rounded-lg shadow"
        ref={chatInputRef}
      >
        <span
          className={clsx(
            "text-sm after:content-[attr(data-after)] after:relative after:-top-px after:-left-[2px]",
            state.chatInputCursorVisible
              ? "after:opacity-100"
              : "after:opacity-0",
          )}
          data-after="|"
        >
          {state.chatInputText || (
            <span className="opacity-50 block absolute translate-y-1">
              Message #showing-off-reacord
            </span>
          )}
        </span>
      </div>

      <img
        src={cursorUrl}
        alt=""
        className="transition-all duration-500 absolute scale-75"
        style={{ left: state.cursorLeft, bottom: state.cursorBottom }}
        ref={cursorRef}
      />
    </div>
  )
}
