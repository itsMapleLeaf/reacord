import type { ReacordInstance } from "../library/main"
import { Button, useInstance } from "../library/main"
import type { MessageSample } from "./test-adapter"
import { ReacordTester } from "./test-adapter"
import { describe, expect, it } from "vitest"

describe("useInstance", () => {
	it("returns the instance of itself", async () => {
		let instanceFromHook: ReacordInstance | undefined

		function TestComponent({ name }: { name: string }) {
			const instance = useInstance()
			instanceFromHook ??= instance
			return (
				<>
					<Button
						label={`create ${name}`}
						onClick={(event) => {
							event.reply(<TestComponent name="child" />)
						}}
					/>
					<Button
						label={`destroy ${name}`}
						onClick={() => instance.destroy()}
					/>
				</>
			)
		}

		function messageOutput(name: string): MessageSample {
			return {
				content: "",
				embeds: [],
				actionRows: [
					[
						{
							type: "button",
							label: `create ${name}`,
							style: "secondary",
						},
						{
							type: "button",
							label: `destroy ${name}`,
							style: "secondary",
						},
					],
				],
			}
		}

		const tester = new ReacordTester()
		const instance = tester.send(<TestComponent name="parent" />)

		await tester.assertMessages([messageOutput("parent")])
		expect(instanceFromHook).toBe(instance)

		await tester.findButtonByLabel("create parent").click()
		await tester.assertMessages([
			messageOutput("parent"),
			messageOutput("child"),
		])

		// this test ensures that the only the child instance is destroyed,
		// and not the parent instance
		await tester.findButtonByLabel("destroy child").click()
		await tester.assertMessages([messageOutput("parent")])

		await tester.findButtonByLabel("destroy parent").click()
		await tester.assertMessages([])
	})
})
