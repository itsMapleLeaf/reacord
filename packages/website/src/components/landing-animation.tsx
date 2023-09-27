import clsx from "clsx"
import { useEffect, useRef, useState } from "react"
import blobComfyUrl from "~/assets/blob-comfy.png"
import cursorIbeamUrl from "~/assets/cursor-ibeam.png"
import cursorUrl from "~/assets/cursor.png"

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

export function LandingAnimation() {
	const [state, setState] = useState(defaultState)
	const chatInputRef = useRef<HTMLDivElement>(null)
	const addRef = useRef<HTMLDivElement>(null)
	const deleteRef = useRef<HTMLDivElement>(null)
	const cursorRef = useRef<HTMLImageElement>(null)

	useEffect(() => {
		const animateClick = (element: HTMLElement) =>
			element.animate(
				[{ transform: `translateY(2px)` }, { transform: `translateY(0px)` }],
				300,
			)

		let running = true

		void (async () => {
			// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
			while (running) {
				setState(defaultState)
				await delay(700)

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
			// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
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
			className="animate-fade-in pointer-events-none relative grid select-none gap-2"
			role="presentation"
		>
			<div
				className={clsx(
					"rounded-lg bg-slate-800 p-4 shadow transition",
					state.messageVisible ? "opacity-100" : "-translate-y-2 opacity-0",
				)}
			>
				<div className="flex items-start gap-4">
					<div className="h-12 w-12 rounded-full bg-black/25 bg-contain bg-no-repeat p-2">
						<img
							src={blobComfyUrl}
							alt=""
							className="h-full w-full scale-90 object-contain"
						/>
					</div>
					<div>
						<p className="font-bold">comfybot</p>
						<p>this button was clicked {state.count} times</p>
						<div className="mt-2 flex flex-row gap-3">
							<div
								ref={addRef}
								className="rounded bg-emerald-700 px-3 py-1.5 text-sm text-white"
							>
								+1
							</div>
							<div
								ref={deleteRef}
								className="rounded bg-red-700 px-3 py-1.5 text-sm text-white"
							>
								🗑 delete
							</div>
						</div>
					</div>
				</div>
			</div>
			<div
				className="rounded-lg bg-slate-700 px-4 pb-2 pt-1.5 shadow"
				ref={chatInputRef}
			>
				<span
					className={clsx(
						"text-sm after:relative after:-left-[2px] after:-top-px after:content-[attr(data-after)]",
						state.chatInputCursorVisible
							? "after:opacity-100"
							: "after:opacity-0",
					)}
					data-after="|"
				>
					{state.chatInputText || (
						<span className="absolute block translate-y-1 opacity-50">
							Message #showing-off-reacord
						</span>
					)}
				</span>
			</div>

			<img
				src={cursorUrl}
				alt=""
				className="absolute scale-75 bg-transparent transition-all duration-500"
				style={{ left: state.cursorLeft, bottom: state.cursorBottom }}
				ref={cursorRef}
			/>
		</div>
	)
}
