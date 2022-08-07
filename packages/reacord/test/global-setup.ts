import { oraPromise } from "ora"
import { ReacordTester } from "./tester"

export async function setup() {
  await oraPromise(ReacordTester.removeChannels(), "Running test setup...")
}
