import { raise } from "./raise.js"

export function getEnvironmentValue(name: string) {
  return process.env[name] ?? raise(`Missing environment variable: ${name}`)
}
