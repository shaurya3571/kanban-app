import '@testing-library/jest-dom/vitest'

class LocalStorageMock {
  constructor() {
    this.store = {}
  }

  clear() {
    this.store = {}
  }

  getItem(key) {
    return Object.prototype.hasOwnProperty.call(this.store, key) ? this.store[key] : null
  }

  setItem(key, value) {
    this.store[key] = String(value)
  }

  removeItem(key) {
    delete this.store[key]
  }

  get length() {
    return Object.keys(this.store).length
  }

  key(index) {
    const keys = Object.keys(this.store)
    return keys[index] || null
  }
}

const storageInstance = new LocalStorageMock()

Object.defineProperty(window, 'localStorage', {
  value: storageInstance,
  configurable: true,
  writable: true,
})

Object.defineProperty(globalThis, 'localStorage', {
  value: storageInstance,
  configurable: true,
  writable: true,
})
