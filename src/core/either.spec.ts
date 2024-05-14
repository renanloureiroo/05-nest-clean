import { Either, left, right } from './either'

function doSomething(shouldSuccess: boolean): Either<string, number> {
  if (shouldSuccess) {
    return right(2)
  } else {
    return left('error')
  }
}

test('success result', () => {
  const result = doSomething(true)

  if (result.isRight()) {
    console.log(result.value)
  }

  expect(result.value).toEqual(2)
  expect(result.isRight()).toBeTruthy()
  expect(result.isLeft()).toBeFalsy()
})

test('error result', () => {
  const result = doSomething(false)
  expect(result.value).toEqual('error')
  expect(result.isRight()).toBeFalsy()
  expect(result.isLeft()).toBeTruthy()
})
