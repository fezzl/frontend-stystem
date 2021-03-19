### js flat

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