import { ReacordTester } from "./tester"

export async function setup() {
  await ReacordTester.removeChannels()
}
