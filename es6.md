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

