/* eslint-disable func-names, no-param-reassign, no-proto */

const self = global || window
const Promise = self.Promise

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
    resolver(resolve, reason => {
      // macro-task(setTimeout) will execute after micro-task(promise)
      setTimeout(() => {
        if (promise.handled !== true) dispatchUnhandledRejectionEvent(promise, reason)
      }, 0)
      return reject(reason)
    }))
  promise.__proto__ = MyPromise.prototype
  return promise
}

MyPromise.__proto__ = Promise
MyPromise.prototype.__proto__ = Promise.prototype


MyPromise.prototype.then = function (resolve, reject) {
  return Promise.prototype.then.call(this, resolve, reject && (reason => {
    this.handled = true
    return reject(reason)
  }))
}

MyPromise.prototype.catch = function (reject) {
  return Promise.prototype.catch.call(this, reject && (reason => {
    this.handled = true
    return reject(reason)
  }))
}

MyPromise.polyfill = () => {
  if (typeof PromiseRejectionEvent === 'undefined') window.Promise = MyPromise
}

MyPromise.Promise = MyPromise

export default MyPromise
