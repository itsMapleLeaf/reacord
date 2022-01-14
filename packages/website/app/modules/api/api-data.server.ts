import type { JSONOutput } from "typedoc"

export type ApiData = JSONOutput.ContainerReflection

export async function loadApiData(): Promise<ApiData> {
  const data = await import("~/assets/api.json")
  return data as ApiData
}
