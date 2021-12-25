export abstract class Node {
  abstract get name(): string
  abstract props: Record<string, unknown>
}
