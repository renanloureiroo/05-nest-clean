import { Slug } from './slug'

it('should be able to create a new slu from text', () => {
  const slug = Slug.createFromText('Exemplo de título de questão!')

  expect(slug.value).toBe('exemplo-de-titulo-de-questao')
})
