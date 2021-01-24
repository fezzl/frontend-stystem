### let & const

#### let

1. 不存在变量提升

   ```js
   // var 的情况
   console.log(foo); // 输出undefined
   var foo = 2;
   
   // let 的情况
   console.log(bar); // 报错ReferenceError
   let bar = 2;
   ```

2. 暂时性死区（TDZ）: 只要块级作用域内存在 let 命令，它所声明的变量就绑定这个区域，不再受外部影响

   ```js
   var tmp = 123;
   
   if (true) {
     tmp = 'abc'; // ReferenceError
     let tmp;
   }
   ```

3. 不允许重复声明

   ```js
   // 报错
   function func() {
     let a = 10;
     var a = 1;
   }
   
   // 报错
   function func() {
     let a = 10;
     let a = 1;
   }
   ```

4. 块级作用域

   ```js
   function f1() {
     let n = 5;
     if (true) {
       let n = 10;
     }
     console.log(n); // 5
   }
   ```

#### const

const 也有和 let 一样的特性，const 声明一个只读的常量，一旦声明，常量的值不能改变，如果声明的是一个引用类型对象，指的是引用的地址不可改变，还是可以添加属性

```js
const PI = 3.1415;
PI // 3.1415

PI = 3;
// TypeError: Assignment to constant variable.

const foo = {};

// 为 foo 添加一个属性，可以成功
foo.prop = 123;
foo.prop // 123

// 将 foo 指向另一个对象，就会报错
foo = {}; // TypeError: "foo" is read-only
```

---

### 箭头函数

1. 函数体内的 `this` 对象，就是定义时的所在的对象，而不是使用时的所在的对象
2. 不可以当做构造函数，也就是说，不可以使用 `new` 命令，否则会抛出一个错误
3. 不可以使用 `arguments` 对象，该对象在函数体内不存在，如果要用，可以用 rest 参数代替
4. 不可以使用 `yield`命令，因此箭头函数不能用作 Generator 函数

箭头函数转为 ES5 的代码如下

```js
// ES6
function foo() {
  setTimeout(() => {
    console.log(this.id)
  }, 100)
}

// ES5
function foo() {
  var _this = this
  setTimeout(() => {
    console.log(_this.id)
  }, 100)
}
```

---

### 对象属性

ES6 一共有5中方法可以遍历对象的属性

1. for...in，循环遍历对象自身和继承的可枚举属性（不含 Symbol 属性）
2. Object.keys(obj)，返回一个数组，包括对象自身（不含继承）所有可枚举属性（不含 Symbol 属性）的键名
3. Object.getOwnPropertyNames(obj) 返回一个数组。包含对象自身所有属性（不含 Symbol 属性，但是包括不可枚举属性）的键名
4. Object.getOwnPropertySymbols(obj) 返回一个数组，包含对象自身的所有 Symbol 属性的键名
5. Reflect.ownKeys(obj) 返回一个数组，包含对象自身（不含继承）的所有属性，不管键名是 Symbol 还是字符串，也不管是否可枚举

以上的5种方法遍历对象的键名，都遵守同样的属性遍历的次序规则

- 首先遍历所有的数值键，按照数值升序排列
- 其次遍历所有字符串键，按照加入时间升序排列
- 最后遍历所有的 Symbol 键，按照加入时间升序排序

---

### Symbol

`Symbol`的目的：保证每个对象的属性名都是独一无二的，防止属性名冲突，通过 `Symbol` 函数生成

```js
let s = Symbol()

typeof s
// "symbol"
```

`Symbol` 函数可以接受一个字符串作为参数，表示对 Symbol 实例的描述，主要是为了在控制台显示，或者转为字符串时，容易区分

```js
let s1 = Symbol('foo');
let s2 = Symbol('bar');

s1 // Symbol(foo)
s2 // Symbol(bar)

s1.toString() // "Symbol(foo)"
s2.toString() // "Symbol(bar)"
```

---

### Set & Map

#### Set

它类似于数组，当时成员的值都是唯一的，没有重复的值。

```js
// 数组去重
[...new Set(Array)]

// 字符串去重
[...new Set('ababbc')].join('') // "abc"
```

Set 内部判断相等的算法类似于 `===` ，主要区别是向 Set 加入值时认为 `NAN` 等于自身

#### Set 实例的属性和方法

属性：

- `Set.prototype.constructor` 构造函数，默认是 `Set` 函数
- `Set.prototype.size` 返回`Set` 实例的个数

操作方法：

- `Set.prototype.add(value)` 添加某个值，返回 Set 结构本身
- `Set.prototyoe,delete(value)` 删除某个值，返回一个布尔值，表示是否删除成功
- `Set.prototype.has(value)` 返回一个布尔值，表示是否是 Set 的成员
- `Set.prototype.clear()` 清除所有成员，没有返回值

遍历方法：可以直接 `for of` 遍历

- `Set.prototype.keys()` 返回键名的遍历器
- `Set.prototype.values()` 返回键值的遍历器
- `Set.prototype.entries()` 返回键值对的遍历器
- `Set.prototype.forEach()` 使用回调函数遍历每个成员

#### WeakSet 

WeakSet 结构和 Set 类似，也是不重复的值的集合，和 Set 的区别有两个，WeakSet 的成员只能是对象，而不能是其他值，WeakSet 中的对象都是弱引用，即垃圾回收机制不考虑 WeakSet 对该对象的引用，如果其他对象不再引用该对象，那么垃圾回收就会回收这块对象所占的内存，不考虑该对象还存在 WeakSet 之中

#### Map

传统的对象，本质上键值对的集合，但是只能用字符串当做键，Map 数据结构，类似于对象，也是键值对集合，但是键的值不限于字符串，各种类型都可以当做键，只有对同一个对象的引用，Map 结构才将其视为同一个键。这一点要非常小心

```js
const map = new Map([
  ['name', '张三'],
  ['title', 'Author']
]);

map.size // 2
map.has('name') // true
map.get('name') // "张三"
map.has('title') // true
map.get('title') // "Author"
```

#### Map 的属性和方法

- `size` 属性，返回 Map 结构的成员总数
- `Map.prototype.set(key,value)` 设置键名 key 对应的 value，返回整个 Map 结构
- `Map.prototype.get(key)` 读取对应的 key  键值，如果找不到就返回 undefined
- `Map.prototype.has(key)` 返回一个布尔值，判断某个键是否在 map 对象中
- `Map.prototype.delete(key)` 删除某个键
- `Map.prototype.clear()` clear 方法清除所有成员

遍历方法：

- `Map.prototype.keys()`：返回键名的遍历器。
- `Map.prototype.values()`：返回键值的遍历器。
- `Map.prototype.entries()`：返回所有成员的遍历器。
- `Map.prototype.forEach()`：遍历 Map 的所有成员

#### WeakMap

WeakMap 只接收对象作为键名吗，不接受其他类型的值作为键名，WeakMap 的键名指向的对象不计入垃圾回收机制

---

### Proxy

Proxy 代理用于修改某些操作的默认行为，等于在语言层面做出修改，所以属于一种“元编程”，即对编程语言进行编程，可以理解为在目标对象之前架设一层“拦截”，外界对该对象进行访问，都必须通过这层拦截，因此可以对外界的访问进行过滤和改写。

``` js
var obj = new Proxy({}, {
  get: function (target, propKey, receiver) {
    console.log(`getting ${propKey}!`);
    return Reflect.get(target, propKey, receiver);
  },
  set: function (target, propKey, value, receiver) {
    console.log(`setting ${propKey}!`);
    return Reflect.set(target, propKey, value, receiver);
  }
});
```

上面代码对一个空对象架设了一层拦截，重定义了属性的读取（get）和设置（set）行为

Proxy 对象的用法

```js
var proxy = new Proxy(target, handler);
```

`new Proxy()` 表示生成一个 `Proxy` 实例，`target` 参数表示要拦截的目标对象，`handler` 参数也是一个对象，用来定制拦截行为

---

### Reflect

`Reflect` 对象和 `Proxy` 对象一样，也是 es6 为了操作对象提供的新 API，Reflect 对象的设计目的有几个

1. 将`Object` 对象的一些属于语言内部的方法（`Object.defineProperty`），放到`Reflect`对象上
2. 修改某些 `Object`方法返回的结果，让其变的更加合理，比如`Object.defineProperty(obj, name, desc)`在无法定义属性时，会抛出一个错误，而`Reflect.defineProperty(obj, name, desc)`则会返回false
3. 让`Object`操作都变成函数行为。某些`Object`操作是命令式，比如`name in obj` 和 `delete obj[name]`，而`Reflect.has(obj, name)` 和 `Reflect.deleteProperty(obj, name)` 让他们变成函数行为
4. `Reflect`对象的方法和`Proxy`对象的方法一一对应，只要是`Proxy`对象的方法就能在`Reflect`对象上找到对应的方法

### Proxy 实现观察者模式

观察者模式指的是函数自动观察数据对象，一旦对象有变化，就会自动执行观察者函数

```js
const person = observable({
  name: '张三',
  age: 20
});

function print() {
  console.log(`${person.name}, ${person.age}`)
}

observe(print);
person.name = '李四';
// 输出
// 李四, 20
```

数据对象 person 是观察目标，函数 print 是观察者，一旦数据变化就会执行 print 函数

```js
const queuedObservers = new Set()

const observe = fn => queuedObervers.add(fn)
const observable = obj => new Proxy(obj, {set})

function set(target, key, value, receiver) {
  const result = Reflect.set(target, key, value, receiver)
  queuedObservers.forEach(observer => observer())
  return result
}
```

---

### Promise

#### Promise 的含义

Promise 是异步编程的一种解决方案，简单来说就是一个容器，里面保存着某个未来才会结束的事件（通常是一个异步操作）的结果，Promise 对象有两个特点

1. 对象的状态不受外界影响。有三种状态：`pending`进行中、`fulfilled`已成功、`rejected`已失败。只有异步操作的结果能决定当前的状态、任何其他的操作都无法改变这个状态
2. 一旦状态改变，就不会再变，Promise 对象的状态改变，只有两种可能：从`pending`变为`fulfilled`和从`pending`变为`rejected`

#### Promise 用法

Promise 对象是一个构造函数，用来生成 Promise 实例

```js
const promise = new Promise(function(resolve, reject) {
  // ... some code

  if (/* 异步操作成功 */){
    resolve(value);
  } else {
    reject(error);
  }
});

promise.then(function(value) {
  // success
}, function(error) {
  // failure
});
```

如果在一个 Promise 中返回另一个 Promise 则状态由返回的 Promise 决定

```js
const p1 = new Promise(function (resolve, reject) {
  setTimeout(() => reject(new Error('fail')), 3000)
})

const p2 = new Promise(function (resolve, reject) {
  setTimeout(() => resolve(p1), 1000)
})

p2
  .then(result => console.log(result))
  .catch(error => console.log(error))
// Error: fail
```

#### Promise.prototype.then()

它的作用是为 Promise 实例添加状态改变时的回调函数。then 方法的第一个参数是 resolved 状态的回调函数，第二个参数是 rejected 状态的回调函数，都是可选的。then 方法返回一个新的 promise 实例，因此可以采用链式写法

```js
getJSON("/posts.json").then(function(json) {
  return json.post;
}).then(function(post) {
  // ...
});
```

#### Promise.prototype.catch()

用于指定发生错误时的回调函数

```js
getJSON('/posts.json').then(function(posts) {
  // ...
}).catch(function(error) {
  // 处理 getJSON 和 前一个回调函数运行时发生的错误
  console.log('发生错误！', error);
});
```

reject() 方法的作用，等同于抛出错误，如果 Promise 状态已经变成 resolved，再抛出错误是无效的，Promise 对象的错误具有冒泡性质，会一直向后传递，直到被捕获为止，也就是说，错误总是会被下一个 catch 语句捕获，通过 throw 实现错误冒泡

```js
getJSON('/post/1.json').then(function(post) {
  return getJSON(post.commentURL);
}).then(function(comments) {
  // some code
}).catch(function(error) {
  // 处理前面三个Promise产生的错误
});
```

#### Promise.prototype.finally

finally 方法用于指定不管 Promise 对象最后状态如何，都会执行的操作

```js
promise
.then(result => {···})
.catch(error => {···})
.finally(() => {···});
```

finally 方法的实现

```js
Promise.prototype.finally = function (callback) {
  let P = this.constructor;
  return this.then(
    value  => P.resolve(callback()).then(() => value),
    reason => P.resolve(callback()).then(() => { throw reason })
  );
};
```

#### Promise.all

Promise 方法用于将多个 Promise 实例，包装成一个新的 Promise 实例

```js
const p = Promise.all([p1, p2, p3])
```

Promise.all 方法接受一个数组作为参数，p1，p2，p3 都是 Promise 实例，如果不是，就会先调用 Promise.resolve 方法，将参数转为 Promise 实例，Promise.all 方法的参数可以不是数组，但必须具有 Iterator 接口，且返回的每个成员都是 Promise 实例

p 的状态由 p1，p2，p3 决定

1. 只有 p1，p2，p3 的状态都变成 fulfilled，p的状态才会变成 fulfilled，此时 p1，p2，p3 的返回值组成一个数组，传递给 p 的回调函数
2. 只要 p1，p2，p3 之中有一个被 rejected ，p 的状态就变成 rejected，此时第一个被 reject 的实例的返回值，会传递给 p 的回调函数

```js
// 生成一个Promise对象的数组
const promises = [2, 3, 5, 7, 11, 13].map(function (id) {
  return getJSON('/post/' + id + ".json");
});

Promise.all(promises).then(function (posts) {
  // ...
}).catch(function(reason){
  // ...
});
```

如果作为参数的 Promise 的实例，自己定义了 catch 方法，那么它一旦被 rejected，并不会触发 Promise.all() 的 catch 方法

```js
const p1 = new Promise((resolve, reject) => {
  resolve('hello');
})
.then(result => result)
.catch(e => e);

const p2 = new Promise((resolve, reject) => {
  throw new Error('报错了');
})
.then(result => result)
.catch(e => e);

Promise.all([p1, p2])
.then(result => console.log(result))
.catch(e => console.log(e));
// ["hello", Error: 报错了]

```

上面代码中，p1 会 resolved，p2 首先会 rejected，但是 p2 有自己的 catch 方法，该方法一个新的 Promise 的实例，p2 实际就是这个新的实例，该实例执行完 catch 方法后，也会变成 resolved，导致 Promise.all() 方法参数两个实例都是 resolved，因此会调用 then 方法指定的回调函数，而不会调用 catch 方法指定的回调函数

#### Promise.race

Promise.race() 方法是将多个 Promise 的实例，包装成一个新的 Promise 实例

```js
const p = Promise.race([p1, p2, p3])
```

只要 p1，p2，p3 之中有一个实例先改变状态，p 的状态就跟着改变，那个先改变的 Promise 实例的返回值，就传递给 p 的回调函数，如果 Promise.race 的参数不是 Promise 实例，就会调用 Promise.resolve() 方法，将参数转为 Promise 实例

```js
const p = Promise.race([
  fetch('/resource-that-may-take-a-while'),
  new Promise(function (resolve, reject) {
    setTimeout(() => reject(new Error('request timeout')), 5000)
  })
]);

p
.then(console.log)
.catch(console.error);
```

#### Promise.allSettled

Promise.allSettled 方法接受一组 Promise 实例作为参数，包装成一个新的 Promise 实例。只有等到所有参数的实例都返回结果，不管是 fulfilled 还是 rejected，包装实例才会结束

```js
const promises = [
  fetch('/api-1'),
  fetch('/api-2'),
  fetch('/api-3'),
];

await Promise.allSettled(promises);
removeLoadingIndicator();
```

#### Promise.any

该方法接受一组 Promise 实例作为参数，包装成一个新的 Promise 实例返回，只要参数实例有一个变成 fulfilled 状态，包装实例就会变成 fulfilled 状态; 如果所有参数的实例都变成 rejected 状态，包装实例就会变成 rejected 状态

```js
const promises = [
  fetch('/endpoint-a').then(() => 'a'),
  fetch('/endpoint-b').then(() => 'b'),
  fetch('/endpoint-c').then(() => 'c'),
];
try {
  const first = await Promise.any(promises);
  console.log(first);
} catch (error) {
  console.log(error);
}
```

#### Promise.resolve

需要将现有对象转为 Promise 对象，Promise.resolve 方法就起到这个作用，Promise.resolve() 等价于下面的写法

```js
Promise.resolve('foo')
// 等价于
new Promise(resolve => resolve('foo'))
```

Promise.resolve() 方法的参数分成四种情况

1. 参数是一个Promise 实例

   如果参数是 Promise 实例，那么 Promise.resolve 将不做任何修改、原封不动地返回这个实例

2. 参数是一个 thenable 对象

   thenable 对象指的是具有 then 方法的对象，比如下面这个对象

   ```js
   let thenable = {
     then: function (resolve, reject) {
       resolve(42)
     }
   }
   ```

   Promise.resolve 方法会将这个对象转为 Promise 对象，然后立即执行 thenable 对象的 then 方法

   ```js
   let thenable = {
     then: function(resolve, reject) {
       resolve(42);
     }
   };
   
   let p1 = Promise.resolve(thenable);
   p1.then(function (value) {
     console.log(value);  // 42
   });
   ```

3. 参数不是具有 then 方法的对象，或根本就不是对象

   如果参数是一个原始值，或者一个不具有 then 方法的对象，则 Promise.resolve 方法返回一个新的 Promise 对象，状态为 resolved

   ```js
   const p = Promise.resolve('Hello')
   
   p.then(function (value) {
     console.log(value)
   })
   // Hello
   ```

4. 不带有任何参数

   Promise.resolve 方法允许调用时不带参数，直接返回一个 resolved 状态的 Promise 对象

   ```js
   const p = Promise.resolve()
   
   p.then(function() {
     
   })
   ```

Promise.resolve 是微任务，所以是在本轮事件循环结束时执行

```js
setTimeout(function () {
  console.log('three');
}, 0);

Promise.resolve().then(function () {
  console.log('two');
});

console.log('one');

// one
// two
// three
```

#### Promise.reject

Promise.reject(reason) 方法也会返回一个新的 Promise 实例，该实例状态为 rejected

```js
const p = Promise.reject('出错了')
// 等同于
const p = new Promise((resolve, reject) => reject('出错了'))

p.then(null, function (s) {
  console.log(s)
})
// 出错了
```

---

### Iterator & for...of 循环

#### Iterator (遍历器)概念

遍历器（Iterator）是一种接口，为各种不同的数据结构提供统一的访问机制。任何数据结构只要部署了 Iterator 接口，就可以完成遍历操作

Iterator 的作用有三个：一是为各种数据结构提供一个统一的、简便的访问接口；二是使得数据结构的成员能够按某种次序排序；三是 ES6 创造了一种新的遍历命令 for...of 循环，Iterator 接口主要供 for...of 消费

Iterator 的遍历过程是这样的

1. 创建一个指针对象，指向当前数据结构的起始位置，也就是遍历器对象本质上，就是一个指针对象
2. 第一次调用指针对象的 next 方法，可以将指针对象指向数据结构的第一个成员
3. 第二次调用指针对象的 next 方法，可以将指针对象指向数据结构的第二个成员
4. 不断调用指针对象的 next 方法，直到它指向数据结构的结束位置

 每一次调用 next 方法，都会返回数据结构的当前的成员信息，具体来说，就是返回一个包含 value 和 done 两个属性的对象，value 属性是当前成员的值，done 属性是一个布尔值，表示遍历是否结束

```js
var it = makeIterator(['a', 'b']);

it.next() // { value: "a", done: false }
it.next() // { value: "b", done: false }
it.next() // { value: undefined, done: true }

function makeIterator(array) {
  var nextIndex = 0;
  return {
    next: function() {
      return nextIndex < array.length ?
        {value: array[nextIndex++], done: false} :
        {value: undefined, done: true};
    }
  };
}
```

#### 默认 Iterator 接口

原生具备 Iterator 接口的数据结构如下

- Array
- Map
- Set
- String
- TypedArray
- 函数的 arguments 对象
- NodeList 对象

#### 调用 Iterator 接口的场合

1. 解构赋值

   对数组和 set 解构进行解构赋值时，会默认调用 Symbol.iterator

   ```js
   let set = new Set().add('a').add('b').add('c');
   
   let [x,y] = set;
   // x='a'; y='b'
   
   let [first, ...rest] = set;
   // first='a'; rest=['b','c'];
   ```

2. 扩展运算符

   只要某个数据结构部署了 Iterator 接口，就可以对它使用扩展运算符，将其转为数组

   ```js
   let arr = [...iterable]
   ```

3. yield*

   yield* 后面跟的是一个可遍历的结构，它会调用该结构的遍历器接口

   ```js
   let generator = function* () {
     yield 1;
     yield* [2,3,4];
     yield 5;
   };
   
   var iterator = generator();
   
   iterator.next() // { value: 1, done: false }
   iterator.next() // { value: 2, done: false }
   iterator.next() // { value: 3, done: false }
   iterator.next() // { value: 4, done: false }
   iterator.next() // { value: 5, done: false }
   iterator.next() // { value: undefined, done: true }
   ```

4. 其他场合

   由于数组的遍历会调用遍历器接口，所以任何接受数组作为参数的场合，其实都调用了遍历器接口

   - for...of
   - Array.from()
   - Map(), Set(), WeakMap(), WeakSet()（比如`new Map([['a',1],['b',2]])`）
   - Promise.all()
   - Promise.race()

#### for...of

一个数据结构只要部署了 Symbol.iterator 属性，就被视为具有 iterator 接口，就可以用 for...of 循环遍历它的成员，也就是说，for...of 循环内部调用的是数据结构的 Symbol.iterator 方法

for...of 循环可以使用的范围包括数组、Set 和 Map 结构、某些类似数组对象（arguments 对象、DOM NodeList 对象）、Generator 对象、字符串

for...in 的缺点：

- 数组的键名是数字，但是 for...in 循环是以字符串作为键名
- for..in 会遍历原型上的属性
- for..in 不会按顺序遍历键名

---

### Generator 函数

#### 基本概念

Generator 函数是一个状态机，封装了多个内部状态，执行后会返回一个遍历器对象，也就是说 Generator 函数除了状态机，还是一个遍历器对象生成函数。返回的遍历器对象，可以一次遍历 Generator 函数内部的每一个状态

两个特征：

- function 关键字与函数名之前有一个星号
- 函数体内部使用 yield 表达式，定义内部不同的状态

```js
function* helloWorldGenerator() {
  yield 'hello';
  yield 'world';
  return 'ending';
}

var hw = helloWorldGenerator();

hw.next()
// { value: 'hello', done: false }

hw.next()
// { value: 'world', done: false }

hw.next()
// { value: 'ending', done: true }

hw.next()
// { value: undefined, done: true }
```

#### Generator 与协程

协程是一种程序的运行方式，可以理解成“协作的线程”或“协作的函数”，可以并行执行、交换执行权的线程（函数）就称为协程，协程是同时存在多个栈，但只有一个栈是在运行状态，也就是说协程是以多占用内存为代价，实现多任务的并行

Generator 函数通过 yield 表达式交换控制权

---

### async 函数

#### 含义

async 函数是 Generator 函数的语法糖，将 Generator 函数的星号* 替换成 async，将 yield 替换成 await，async 的改进

1. 内置执行器

   async 函数的执行，与普通函数一模一样

2. 更好的语义

   async 和 await，比起星号和 yield，语义更加清楚。async 表示函数有异步操作，await 表示紧跟在后面的表达式需要等待结果

3. 更广的适用性

   async 函数的 await 命令后面可以是 Promise 对象和原始类型的值（数值、字符串和布尔值，但这时会自动转成立即 resolved 的 Promise 对象）

4. 返回值是 Promise

   async 函数的返回值是 Promise 对象

#### async 函数的实现原理

async 函数的实现原理，就是 Generator 函数和自动执行器包装在一个函数里

```js
async function fn(args) {
  // ...
}

// 等同于

function fn(args) {
  return spawn(function* () {
    // ...
  });
}
```

---

### Class

#### 概念

Class 是构造函数的语法糖

```js
function Point(x, y) {
  this.x = x;
  this.y = y;
}

Point.prototype.toString = function () {
  return '(' + this.x + ', ' + this.y + ')';
};

var p = new Point(1, 2);
// 等同于
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  toString() {
    return '(' + this.x + ', ' + this.y + ')';
  }
}
```

#### 静态方法

类相当于实例的原型，所有在类中定义的方法都会被实例继承，如果在一个方法前面加上一个 static 关键字，就表示该方法不会被实继承，而是直接通过类来调用，这种就叫做静态方法

```js
class Foo {
  static classMethod() {
    return 'hello';
  }
}

Foo.classMethod() // 'hello'

var foo = new Foo();
foo.classMethod()
// TypeError: foo.classMethod is not a function
```

静态方法中的 this 指向类，而不是实例，静态方法可以被子类继承

#### 实例属性的新写法

实例属性除了定义在 constructor 方法里面的 this 上面，也可以定义在类的最顶层

```js
class IncreasingCounter {
  _count = 0;
  get value() {
    console.log('Getting the current value!');
    return this._count;
  }
  increment() {
    this._count++;
  }
}
```

#### 静态属性

静态属性指的是 Class 本身的属性，即 Class.propName，而不是定义在实例对象（this）上的属性

```js
class MyClass {
  static myStaticProp = 42;

  constructor() {
    console.log(MyClass.myStaticProp); // 42
  }
}
```

