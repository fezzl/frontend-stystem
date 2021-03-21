### flat

#### 递归

```js
function flat(arr) {
  const res = []
  for (let value of arr) {
    if (Array.isArray(value)) {
      res.push(...flat(value))
    } else {
      res.push(value)
    }
  }
  return res
}
```

#### reduce + 递归

```js
function flat(arr) {
  return arr.reduce((pre, cur) => {
    return pre.concat(Array.isArray(cur) ? flat(cur) : cur)
  }, [])
}
```

#### 使用 stack 实现

```js
function flat(arr) {
  const res = []
  const stack = [].concat(arr)
  while(stack.length !== 0) {
    const val = stack.pop()
    if (Array.isArray(val)) {
      stack.push(...val)
    } else {
      res.unshift(val)
    }
  }
  return res
}
```
---

### call/apply/bind

#### call

```js
Function.prototype.myCall = function(context) {
  let ctx = context || window
  ctx.fn = this

  const args = []
  for (let i = 1; i < arguments.length; i++) {
    args.push(`arguments[${i}]`)
  }

  const res = eval(`ctx.fn(${args})`)

  delete ctx.fn
  return res
}
```

#### apply

```js
Function.prototype.myApply = function(context, arr) {
  let ctx = context || window
  ctx.fn = this

  let res
  if (!arr) {
    res = ctx.fn()
  } else {
    const args = []
    for (let i = 0; i < arr.length; i++) {
      args.push(`arr[${i}]`)
    }
    res = eval(`ctx.fn(${args})`)
  }

  delete ctx.fn
  return res
}
```

#### bind

```js
Function.prototype.myBind = function(context) {
  if (typeof this !== 'function') {
    throw new Error('obj bind not a function')
  }
  const self = this
  const args = Array.prototype.slice.apply(arguments, 1)

  function fNop() {}
  function fBound() {
    const bindArgs = Array.prototype.slice.apply(arguments)
    return self.apply(this instanceof fNop ? this : context, args.concat(bindArgs))
  }

  fNop.prototype = this.prototype
  fBound.prototype = new fNop()

  return fBound

}
```

---
### new

```js
function objFactory() {
  const obj = {}
  const Constructor = [].shift.call(arguments)
  obj.__proto__ = Constructor.prototype
  const res = Constructor.apply(obj, arguments)

  return typeof res === 'object' ? res : obj
}
```

---
### debounce/throttle 

#### debounce

原理：你尽管触发事件，但是我一定在事件触发 n 秒后才执行，如果你在一个事件触发的 n 秒内又触发了这个事件，那我就以新的事件的时间为准，n 秒后才执行，总之，就是要等你触发完事件 n 秒内不再触发事件

```js
function debounce(func, wait, immediate) {
  let timeout, result

  const debounced = function() {
    const context = this
    const args = arguments

    if (timeout) clearTimeout(timeout)
    if (immediate) {
      let callNow = !timeout
      timeout = setTimeout(() => {
        timeout = null
      }, wait)
      if (callNow) result = func.apply(context, args)
    } else {
      timeout = setTimeout(() => {
        func.apply(context, args)
      }, wait)
    }
  }

  debounced.cancel = function() {
    clearTimeout(timeout)
    timeout = null
  }

  return debounced
}
```

#### throttle

原理：如果你持续触发事件，每隔一段时间，只执行一次事件

1. 时间戳
```js
function throttle(func, wait) {
  let previous = 0

  return function() {
    let now = Date.now()
    let context = this
    let args = arguments
    if (now - previous > wait) {
      func.apply(context, args)
      previous = now
    }
  }
}
```
2. 定时器
```js
function throttle(func, wait) {
  let timeout
  
  return function () {
    let context = this
    let args = arguments

    if (!timeout) {
      timeout = setTimeout(() => {
        func.apply(context, args)
        timeout = null
      }, wait)
    }
  }
}
```

---

### reduce

```js
Array.prototype.myReduce = function(executor, initialValue) {
  const arr = this
  let startIndex = 1
  let accumulator = arr[0]
  if (initialValue !== undefined) {
    startIndex = 0
    accumulator = initialValue
  }
  for (let index = startIndex; index < arr.length; index++) {
    accumulator = executor(accumulator, arr[index], index, arr)
  }
  return accumulator
}
```

---

### Promise

#### Promise 的核心代码

```js
function Promise(executor) {
  const self = this
  self.status = 'pending'
  self.data = undefined
  self.onResolvedCallback = []
  self.onRejectedCallback = []
  
  function resolve(value) {
    if (value instanceof Promise) {
      return value.then(resolve, reject)
    }
    setTimeout(function() {
      if (self.status === 'pending') {
        self.status = 'resolved'
        self.data = value
        for (let i = 0; i < onResolvedCallback.length; i++) {
          self.onResolvedCallback[i](value)
        }
      }
    })
  }
  
  function reject(reason) {
    setTimeout(function() {
      if (self.status === 'pending') {
        self.status = 'rejected'
        self.data = reason
      }
      for (let i = 0; i < onRejectedCallback.length; i++) {
        self.onRejectedCallback[i](reason)
      }
    })
  }
  
  try {
    executor(resolve, reject)
  } catch(e) {
    reject(e)
  }
}

Promise.prototype.then = function(onReolved, onRejected) {
  const self = this
  let promise2
  
  onReolved = typeof onReolved === 'function' ? onReolved : function(value) {return value}
  onRejected = typeof onRejected === 'function' ? onRejected : function(reson) {throw reason}
	
  if (self.status === 'resolved') {
    return promise2 = new Promise(function (resolve, reject) {
      setTimeout(function() {
        try {
          const x = onReolved(self.data)
          if (x instanceof Promise) {
            x.then(resolve, reject)
          }
          resolve(x)
        } catch(e) {
          reject(e)
        }
      })
    })
  }
  
  if (self.status === 'rejected') {
    return promise2 = new Promise(function(resolve, reject) {
      setTimeout(function() {
        try {
          const x = onRejected(self.data)
          if (x instanceof Promise) {
            x.then(resolve, reject)
          }
          resolve(x)
        } catch(e) {
          reject(e)
        }
      })
    })
  }
  
  if (self.status === 'pending') {
    return promise2 = new Promise(function(resolve, reject) {
      self.onResolvedCallback.push(function(value) {
        try {
          const x = onRejected(value)
          if (x instanceof Promise) {
            x.then(resolve, reject)
          }
          resolve(x)
        } catch(e) {
          reject(e)
        }
      })
      self.onRejectedCallback.push(function(reason) {
        try {
          const x = onReolved(reason)
          if (x instanceof Promise) {
            x.then(resolve, reject)
          }
          resolve(x)
        } catch(e) {
          reject(e)
        }
      })
    })
  }
}

Promise.prototype.catch = function(onRejected) {
  return this.then(null, onRejected)
}
```

#### Promise.all

```js
Promise.all = function(promises) {
  const res = []
  return new Promise((resolve, reject) => {
    for (let i = 0; i < promises.length; i++) {
      Promise.resolve(promises[i]).then(value => {
        res[i] = value
        if (res.length === promises.length) {
          resolve(res)
        }
      }).catch(err => {
        reject(err)
      })
    }
  })
}
```

#### Promise.race

```js
Promise.race = function(promises) {
  return new Promise((resolve, reject) => {
    for (let i = 0; i < promises.length; i++) {
    	Promise.resolve(promises[i]).then(value => {
        resolve(value)
      }).catch(err => {
        reject(err)
      })
    }
  })
}
```

---

Event Bus

```js
class EventEmitter {
  constructor() {
    this.events = this.events || new Map()
  }
  
  subscribe(type, fn) {
    if (!this.events.get(type)) {
      this.events.set(type, fn)
    }
  }
  
  emit(type, ...args) {
    const handler = this.events.get(type)
    handler.apply(this, args)
  }
  
  unsubscribe(type) {
    this.events.delete(type)
  }
}
```





