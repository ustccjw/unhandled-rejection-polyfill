import '../src/auto'

let error = null
let promise = null
let gDone = null
let unhandledrejection = null

window.addEventListener('unhandledrejection', e => {
  unhandledrejection = e
  expect(e.promise).toBe(promise)
  expect(e.reason).toBe(error)
  gDone()
})

beforeEach(() => {
  error = null
  promise = null
  gDone = null
  unhandledrejection = null
})

function fn(done, reject = false) {
  gDone = done
  if (!reject) {
    setTimeout(() => {
      if (!unhandledrejection) {
        done()
      }
    }, 200)
  }
}

describe('Promise constructor', () => {
  test('resolve', done => {
    promise = new Promise(resolve => resolve(1))
    fn(done)
  })

  test('reject', done => {
    promise = new Promise((resolve, reject) => {
      error = new Error('test')
      reject(error)
    })
    fn(done, true)
  })

  test('delay reject', done => {
    promise = new Promise((resolve, reject) => {
      error = new Error('test')
      setTimeout(() => reject(error), 50)
    })
    fn(done, true)
  })

  test('then consume reject', done => {
    promise = new Promise((resolve, reject) => {
      error = new Error('test')
      setTimeout(() => reject(error), 50)
    }).then(() => {}, () => {})
    fn(done)
  })

  test('catch consume reject', done => {
    promise = new Promise((resolve, reject) => {
      error = new Error('test')
      setTimeout(() => reject(error), 50)
    }).catch(() => {})
    fn(done)
  })
})


describe('Promise resolve/reject', () => {
  test('resolve', done => {
    promise = Promise.resolve(1)
    fn(done)
  })

  test('reject', done => {
    error = new Error('test')
    promise = Promise.reject(error)
    fn(done, true)
  })

  test('then consume reject', done => {
    error = new Error('test')
    promise = Promise.reject(error).then(() => {}, () => {})
    fn(done)
  })

  test('catch consume reject', done => {
    error = new Error('test')
    promise = Promise.reject(error).catch(() => {})
    fn(done)
  })
})
