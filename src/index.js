/* eslint-disable func-names, no-param-reassign, no-proto */

const Promise = window.Promise

function dispatchUnhandledRejectionEvent(promise, reason) {
  const event = document.createEvent('Event')
  Object.defineProperties(event, {
    promise: {
      value: promise,
      writable: false,
    },
    reason: {
      value: reason,
      writable: false,
    },
  })
  event.initEvent('unhandledrejection', false, true)
  window.dispatchEvent(event)
}

function MyPromise(resolver) {
  if (!(this instanceof MyPromise)) {
    throw new TypeError('Cannot call a class as a function')
  }
  const promise = new Promise((resolve, reject) =>
    resolver(resolve, arg => {
      // macro-task(setTimeout) will execute after micro-task(promise)
      setTimeout(() => {
        if (promise.handled !== true) {
          dispatchUnhandledRejectionEvent(promise, arg)
        }
      }, 0)
      return reject(arg)
    }))
  promise.__proto__ = MyPromise.prototype
  return promise
}

MyPromise.__proto__ = Promise
MyPromise.prototype.__proto__ = Promise.prototype


MyPromise.prototype.then = function (reolsve, reject) {
  return Promise.prototype.then.call(this, reolsve, reject && (arg => {
    this.handled = true
    return reject(arg)
  }))
}

MyPromise.prototype.catch = function (reject) {
  return Promise.prototype.catch.call(this, reject && (arg => {
    this.handled = true
    return reject(arg)
  }))
}

MyPromise.polyfill = () => {
  if (typeof PromiseRejectionEvent === 'undefined') {
    window.Promise = MyPromise
  }
}

MyPromise.Promise = MyPromise

export default MyPromise
