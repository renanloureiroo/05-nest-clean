abstract class HashComparer {
  abstract compare(plain: string, hash: string): Promise<boolean>
}

export { HashComparer }
