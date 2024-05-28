abstract class HashGenerator {
  abstract hash(plain: string): Promise<string>
}

export { HashGenerator }
