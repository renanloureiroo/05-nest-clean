class Slug {
  public value: string
  private constructor(value: string) {
    this.value = value
  }

  /**
   * Receives a string and normalize it as a slug.
   *
   * @param value {string}
   *
   * @example
   * Slug.createFromText('  Hello World!  '); // hello-world
   */
  static createFromText(text: string) {
    const slugText = text
      .normalize('NFKD')
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-') // replace spaces with hyphen
      .replace(/[^\w-]+/g, '') // remove all non-word chars
      .replace(/_/g, '-') // replace underscore with hyphen
      .replace(/--+/g, '-') // replace multiple hyphens with single hyphen
      .replace(/^-|-$/g, '') // remove leading and trailing hyphen

    return new Slug(slugText)
  }

  static create(value: string) {
    return new Slug(value)
  }
}

export { Slug }
