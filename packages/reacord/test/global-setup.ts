import { ReacordTester } from "./tester"

export async function setup() {
  console.info("Running test setup...")
  await ReacordTester.removeChannels()
}
