import type { JSONOutput } from "typedoc"
import apiData from "~/assets/api.json"

export type ApiData = JSONOutput.ContainerReflection

export function getApiData(): ApiData {
  return apiData as ApiData
}
