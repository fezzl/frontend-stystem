### 执行上下文

#### 什么是执行上下文

执行上下文（Execution Context）是一个评估和执行 javascript 代码的抽象的环境的概念，每当 javascript 代码在运行的时候，就是在执行上下文中运行

#### 执行上下文的类型

- 全局执行上下文：这是默认的基础执行上下文，代码如果不在函数内部就是在全局的执行上下文中，它会执行两件事：创建一个全局的 window 对象（在浏览器的情况下），并且把 `this` 指向等于这个全局对象，一个程序中只有一个全局执行上下文
- 函数执行上下文：每次函数被调用时，就会创建一个函数执行上下文，每个函数都有它自己的执行上下文，不过是在被调用的时候被创建，函数执行上下文有任意个，每当一个新的执行上下文被创建，它会按定义的顺序执行一系列的步骤
- Eval 函数执行上下文：执行在 `eval` 函数内部的代码也会有属于它的执行上下文

#### 执行上下文栈

执行上下文栈（Execution Stack）是一种符合后进先出（LIFO）的数据结构的栈，被用来存储执行代码时创建的所有执行上下文。

当 javascript 引擎第一次遇到你的脚本的时候，它会创建一个全局的执行上下文并且压入当前的执行栈。每当引擎遇到一个函数的调用，它就会为该函数创建一个新的执行上下文并且压入栈顶。

引擎会执行处在栈顶的函数，当函数执行完后会从栈顶中弹出，然后会把控制权交给下一个执行上下文

```js
let a = 'Hello World!';

function first() {
  console.log('Inside first function');
  second();
  console.log('Again inside first function');
}

function second() {
  console.log('Inside second function');
}

first();
console.log('Inside Global Execution Context');

```

上述代码的执行栈


![image](https://miro.medium.com/max/2000/1*ACtBy8CIepVTOSYcVwZ34Q.png)

#### 怎么创建执行上下文

创建上下文有两个阶段

- 创建阶段，词法环境组件和变量环境组件被创建
- 执行阶段，所有变量被赋值，代码执行

---

### 词法环境和变量环境

#### 词法环境是什么

词法环境是一种持有**标识符—变量映射** 的结构，这里的标识符是指变量的名字和函数，变量可能是对对象或原始值的引用

每个词法环境有三个组件

- 环境记录器
- 对外部环境的引用
- this 的绑定

#### 环境记录器是什么

环境记录器就是一个在词法环境中储存变量和函数的声明的地方

环境记录器的类型

- 声明式环境记录器存储变量、函数、参数
- 对象环境记录器用来定义出现在全局上下文的变量和函数的关系

简单来说

- 在全局环境中。环境记录器就是对象环境记录器
- 在函数环境中，环境记录器就是声明式环境记录器

#### 对外部环境的引用

对外部环境的引用就是可以访问包含该词法环境的外部词法环境，javascript 引擎如果在当前的词法环境中查找不到某个变量，就会向它的外部词法环境中去寻找

#### this 的绑定

在这个组件中，`this`的指向会被确定和设置

在全局的执行上下文中，`this`的值指向全局对象 global （在浏览器环境中的 window 对象）

在函数执行上下文中，`this` 的值取决于函数调用的对象，如果被某个对象调用，那 `this`的值指向那个对象，如果在全局中调用的话，`this`的值指向 global 对象或者为 `undefined`（严格模式）

```js
const person = {
  name: 'peter',
  birthYear: 1994,
  calcAge: function() {
    console.log(2020 - this.birthYear);
  }
}
person.calcAge(); 
// 'this' refers to 'person', because 'calcAge' was called with //'person' object reference
const calculateAge = person.calcAge;
calculateAge();
// 'this' refers to the global window object, because no object reference was given
```

#### 词法环境的伪代码

```js
GlobalExectionContext = {
  LexicalEnvironment: {
    EnvironmentRecord: {
      Type: "Object",
      // Identifier bindings go here
    }
    outer: <null>,
    this: <global object>
  }
}
FunctionExectionContext = {
  LexicalEnvironment: {
    EnvironmentRecord: {
      Type: "Declarative",
      // Identifier bindings go here
    }
    outer: <Global or outer function environment reference>,
    this: <depends on how function is called>
  }
}
```

#### 变量环境

变量环境也是一个词法环境，它有着词法环境中的所有属性，在 ES6 中，词法环境和变量环境的区别就是前者是用来存储函数声明和变量（`let` 和 `const`）绑定，变量环境用来存储 `var` 变量绑定

#### 变量提升

在执行上下文创建阶段，js 引擎检查代码找出变量和函数声明，虽然函数声明完全存储在环境中，但是变量的初始值设置为 `undefined`（`var`声明），或者未初始化（`let` 和 `const`声明）

这就是为什么你可以在声明之前访问 `var`定义的变量（虽然是 undefined），但是在声明之前访问 `let` 和 `const` 的变量会得到一个引用错误

这就是我们说的变量提升

注意：在执行阶段时，如果 js 引擎不能找到 `let` 声明变量的值，那就会被赋值为 `undefined`

---

### 作用域

#### 作用域是什么

作用域是根据名称查找变量的一套规则，如果查找的目的是对变量进行赋值，那么就会使用 LHS 查询;如果目的是获取变量的值，就会使用 RHS 查询

#### 块作用域

ES6 可以通过 `let`和`const` 关键字来实现块级作用域（{} 就是一个块作用域），js 是通过变量环境来实现变量提升，块作用域通过词法环境的栈结构实现的，通过两者的结合 js 引擎同事支持变量提升和块级作用域

```js
function foo(){
    var a = 1
    let b = 2
    {
      let b = 3
      var c = 4
      let d = 5
      console.log(a)
      console.log(b)
    }
    console.log(b) 
    console.log(c)
    console.log(d)
}   
foo()
```

变量在函数中的查找过程如下

![image](https://static001.geekbang.org/resource/image/06/08/06c06a756632acb12aa97b3be57bb908.png)

在词法环境内部，维护了一个小型的栈结构，栈底是最外层的变量，进入一个块作用域后，会把该块作用域的变量压入栈顶；当该块作用域执行完之后，该块作用域的信息就会从栈顶弹出。

查找方式：沿着词法环境的栈顶向下查找，如果在词法环境中的某个块作用域中找到就会返回给 js 引擎，如果没找到就会在变量环境中查找，完整的查找过程涉及到作用域链，下面会说到

#### 词法作用域

词法作用域意味着作用域是由书写代码时函数声明的位置来决定的。编译的词法分析阶段基本能够知道全部标识符在哪里以及是如何声明的，从而能够进行优化，在运行时更快的进行查找

#### 作用域链

当一个块或者函数嵌套在另一个块或者函数中，就发生了作用域的嵌套，因此，如果在当前的作用域无法找到某个变量的时候，js 引擎就会在外层嵌套的作用域中去寻找，直到找到该变量或者到达最外层的作用域（也就是全局作用域）为止，这就是作用域链，作用域链是由词法作用域决定的，通过在变量环境中的 outer 引用，可以查找到父词法作用域的变量

下面是代码的完整查找变量的过程，顺序是 1 -> 2 -> 3 -> 4 -> 5

![image](https://static001.geekbang.org/resource/image/25/a7/25053af5ae30c8be991fa14631cde0a7.png)



#### 查找变量异常

js 引擎首先会在代码执行前对其进行编译，在这个过程中，像`var a = 2` 这样的声明会被分解成两个独立的步骤

1. 首先 `var a` 会在作用域中声明新的变量，这发生在代码执行前
2. 接下来，`a = 2` 会进行 LHS 查询变量 a 并进行赋值

LHS 和 RHS 查询都会在当前作用域中开始查找，如果有需要（也就是在当前的作用域没有找到所需的变量），就会向上级作用域继续查找变量，这样每次上升一级作用域，最后抵达全局作用域，无论找到没找到都会停止

不成功的 RHS 引用会导致抛出 ReferenceError 异常。不成功的 LHS 引用会导致隐式的创建一个全局变量（非严格模式下），该变量会用 LHS 引用的目标作为变量的名称，或者抛出 ReferenceError 异常（严格模式下）

---

### 闭包

#### 闭包是什么

当函数可以记住并访问所在的词法作用域，即使函数是在当前的词法作用域之外执行，这时就产生了闭包；在 js 中根据词法作用域的规则，内部函数总是可以访问外部函数的声明的变量，当通过调用一个外部函数返回一个内部函数后，即使外部函数已经执行结束了，但是内部函数引用外部函数的变量依然保存在内存中，我们把这些**变量的集合**称为闭包。

```js

function foo() {
    var myName = "极客时间"
    let test1 = 1
    const test2 = 2
    var innerBar = {
        getName:function(){
            console.log(test1)
            return myName
        },
        setName:function(newName){
            myName = newName
        }
    }
    return innerBar
}
var bar = foo()
bar.setName("极客邦")
bar.getName()
console.log(bar.getName())
```

当 foo 函数执行完之后，调用栈的状态如图所示

![image](https://static001.geekbang.org/resource/image/ee/3f/ee7c1ca481875ad4bdeb4383bd1f883f.png)

当 foo 函数执行完之后，其执行上下文从调用栈中弹出，但是返回的函数 setName 和 getName 方法使用了 foo 函数的变量 myName 和 test1，所以这两个变量还保存在内存中，这就像是 setName 和 getName 背的一个专属背包，无论在哪调用了 setName 和 getName 方法，它们都会背着这个 foo 函数的专属背包

除了 setName 和 getName 函数外，其他任何地方都无法访问这个背包，可以把这个背包叫做 foo 函数的闭包

当执行到 setName 的时候，js 引擎会沿着 setName 的执行上下文 -> foo 函数的闭包 -> 全局执行上下文的顺序查询 myName 变量

![image](https://static001.geekbang.org/resource/image/50/46/50e4ba60fc7e420e83b35b95e379b246.png)

#### 闭包如何回收

如果引用闭包的函数是一个全局变量，那这个闭包会一直存在直到页面关闭，如果这个闭包不再使用的话就会造成内存泄露

如果引用闭包的函数是一个局部变量，等函数销毁后，js 引擎执行垃圾回收机制就会判断闭包这块内容已经不再使用，那么 js 引擎就会回收这块内存

---

### this

#### this 是什么

this 会隐式传递一个对象的引用，this 是运行时进行绑定的，并不是在编写时绑定的，它的指向取决于函数如何调用的，如果是被一个对象调用的话就指向那个对象，如果是单纯的函数调用的话就指向全局对象 window（严格模式下为 undefined）

this 是和执行上下文绑定的，也就是每一个执行上下文都有一个 this

![imae](https://static001.geekbang.org/resource/image/b3/8d/b398610fd8060b381d33afc9b86f988d.png)

#### this 的绑定

- 默认绑定，在严格模式下绑定到 undefined，否则绑定到全局对象
- 隐式绑定，由对象调用则绑定到那个对象
- 显示绑定，call、apply、bind 显示绑定执行的对象
- new 绑定，new 一个函数，绑定到新创建的对象

优先级： new > 显示 > 隐式 > 默认

#### 嵌套函数 this 指向

this 没有作用域的限制，所以嵌套函数不会从调用它的函数中继承 this，有两种方法解决此问题

- 把 this 保存为一个 self 变量，再利用变量的作用域链机制传递给嵌套函数，把 this 的体系变为作用域的体系
- 把嵌套函数变成箭头函数，因为箭头函数没有自己 this，所以它会继承嵌套函数的 this

---

### 原型

#### 构造函数

用 new 调用的函数就叫做构造函数，new 做了什么？

- 先创建一个新的对象
- 把这个对象的原型指向构造函数的 prototype
- 把构造函数的 this 指向新创建的对象
- 如果函数有返回值则返回对应的值，没有返回值则返回新创建的对象

```js
function Person() {
  
}
var person = new Person()
person.name = 'zzl'
console.log(person.name) // zzl
```

在这个例子，Person 是一个构造函数，用 new 创建了一个实例对象 person

#### prototype

每个函数都有一个 prototype 属性

```js
function Person() {

}
Person.prototype.name = 'zzl'
var person1 = new Person()
var person1 = new Person()
console.log(person1.name) // zzl
console.log(person2.name) // zzl
```

函数的 prototype 的属性指向一个对象，这个对象就是调用该构造函数而创建的实例的原型，也就是 person1 和 person2 的原型，每一个 js 对象（除了 null ）在创建的时候都会与之关联另一个对象，这个对象也就是原型，每一个对象都会从原型上“继承”属性

![image](https://github.com/mqyqingfeng/Blog/raw/master/Images/prototype1.png)

#### \__proto__

每一个 js 对象（除了 null ）都具有的一个属性，这个属性会指向该对象的原型，绝大数浏览器都支持这个非标准的方法访问原型，然后它并不存在 Person.prototype 中，实际上，它是来自 Object.prototype，它实际上是一个 getter/setter，当使用 obj.\__proto__。可以理解返回了 Object.getPrototypeOf(obj)

```js
function Peron() {
  
}
var person = new Person()
console.log(person.__proto__ === Person.prototype) // true
```

![image](https://github.com/mqyqingfeng/Blog/raw/master/Images/prototype2.png)

\__proto__ 的实现

```js
Object.defineProperty(Object.prototype, "__proto__",  {
  get: function() {
    return Object.getPrototypeOf(this)
  },
  set: function(o) {
		Object.setPrototypeOf(this, o)
    return o
  }
})
```

#### constructor

每一个原型都有一个 constructor 属性指向关联的构造函数

```js
function Person() {

}
console.log(Person.prototype.constructor === Person) // true
var person = new Person()
console.log(person.constructor === Person) // true
```

当获取 person.constructor 时，其实 person 中并没有 constructor 属性，当获取不到 constructor 属性时，就会沿着原型链向上找，也就是会去原型 Person.prototype 中去读取，正好原型上有这个属性，所以：

```js
person.constructor === Person.prototype.constructor
```

![image](https://github.com/mqyqingfeng/Blog/raw/master/Images/prototype3.png)

#### 原型链

当在一个对象查找一个属性时，如果在这个对象查找不到，就会沿着原型链上去查找，直到查找到 Object.prototype 为止

![image](https://github.com/mqyqingfeng/Blog/raw/master/Images/prototype5.png)

原型链也就是沿着 \__proto__ 查找的一个链条

#### 原型“继承”

每一个对象都会从原型“继承”属性这种说法其实不太正确，继承意味着复制操作，然而 js 默认不会复制对象的属性，js 只是在两个对象之间创建一个关联，这样，一个对象就可以通过委托访问另一个对象的属性和方法，所以与其叫继承，委托的说法更加准确

---

### 继承

#### 原型链继承

```js
function Parent() {
  this.name = 'kevin'
}
Parent.prototype.getName = function() {
  console.log(this.name)
}
function Child() {
  
}
Child.prototype = new Parent()
const child1 = new Child()
console.log(child1.getName()) // kevin
```

缺点：

1. 引用类型的属性会被所有实例共享
2. 在创建 Child 的实例时，不能向 Parent 传参

例如：

```js
function Parent() {
  this.names = ['kevin', 'daisy']
}
function Child () {
  
}
Child.prototype = new Parent()
const child1 = new Child()
child1.names.push('zhangzelin')
console.log(child1.names) // ['kevin', 'daisy', 'zhangzelin']
const child2 = new Child()
console.log(child2.names) // ['kevin', 'daisy', 'zhangzelin']
```

#### 构造函数继承

```js
function Parent() {
  this.names = ['kevin', 'daisy']
}
function Child() {
  Parent.call(this)
}
const child1 = new Child()
child1.names.push('zhangzelin')
console.log(child1.names) // ['kevin', 'daisy', 'zhangzelin']
const child2 = new Child()
console.log(child2.names) // ['kevin', 'daisy']
```

优点：

1. 避免了引用类型属性被所有实例共享
2. 可以在 Child 中向 Parent 中传参

例如：

```js
function Parent(name) {
  this.name = name
}
function Child(name) {
  Parent.call(this, name)
}
const child1 = new Child('kevin')
console.log(child1.name) // kevin
const child2 = new Child('zhangzelin')
console.log(child2.name) // zhangzelin
```

缺点：

1. 方法都在构造函数中定义，每次创建实例都会创建一遍方法
2. 不能继承父类原型上的属性和方法

#### 组合继承

原型链继承和构造函数继承的组合

```js
function Parent (name) {
  this.name = name
  this.colors = ['red', 'blue', 'green']
}
Parent.prototype.getName = function () {
  console.log(this.name)
}
function Child(name, age) {
  Parent.call(this, name)
  this.age = age
}
Child.prototype = new Parent()
Child.prototype.constructor = Child

const child1 = new Child('kevin', 18)
child1.colors.push('black')
console.log(child1.name) // kevin
console.log(child1.age) // 18
console.log(child1.colors) // ['red', 'blue', 'green', 'black']

const child2 = new Child('daisy', 20)
console.log(child2.name) // daisy
console.log(child2.age) // 20
console.log(child2.colors) // ['red', 'blue', 'green']
```

优点：融合了原型链继承和构造函数继承的特点，是 js 中最常用的继承模式

缺点：会调用两次父构造函数，一次是设置子类原型的时候，一次是实例化子类的时候

#### 寄生组合继承

```js
function Parent (name) {
  this.name = name
  this.color = ['red', 'blue', 'green']
}
Parent.prototype.getName = function() {
  console.log(this.name)
}
function Child(name, age) {
  Parent.call(this, name)
  this.age = age
}
// 关键一步，让子类的原型能直接访问父类的原型
Child.prototype = Object.create(Parent.prototype)
Child.prototype.constructor = Child

const child1 = new Child('kevin', 18)
console.log(child1)
```

优点：只调用了一次父构造函数，因此避免了在 Child.prototype 上创建不必要的、多余的属性，原型链还能保持不变，能够正常的使用 instanceof 和 isPrototypeOf

---

### 深拷贝与浅拷贝

#### 深拷贝与浅拷贝的区别

1. 层次
   - 浅拷贝只会将对象的各个属性进行复制，并不会递归的复制，也就是只复制对象的第一层属性
   - 深拷贝不只拷贝对象的第一层属性，而会递归的拷贝对象的所有属性
2. 是否开辟新的栈
   - 浅拷贝对于目标对象的第一层为基本数据类型的数据，就是直接赋值，即传值；而对于目标对象第一层为引用类型的数据，就是直接赋值存于栈内存中的堆内存地址，即传址，并没有开辟新的栈，也就是复制的结果是两个对象指向同一个地址，修改一个对象的属性，另一个对象的属性也会改变
   - 深拷贝是开辟新的栈，两个对象对应两个不同的地址，修改一个对象的属性，不会改变另一个对象的属性

#### 浅拷贝

数组 `concat`、`slice` ，对象`Object.assgin()`都是浅拷贝，浅拷贝的实现

```js
function shallowCopy(obj) {
  // 只拷贝对象
  if (typeof obj !== 'object') return obj
  // 根据 obj 的类型创建一个数组或者对象
  const newObj = obj instanceof Array ? [] : {}
  // 遍历 obj 拷贝 obj 的属性
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      newObj[key] = obj[key]
    }
  }
  return newObj
}
```

#### 深拷贝

`JSON.parse(JSON.stringify(obj))` 可以实现深拷贝，但是不能拷贝函数、正则、undefined、symbol，因为 `JSON.stringify()` 在对象遇到 undefined 、function 和 symbol 会自动忽略，在数组中返回 null

递归实现深拷贝

```js
function deepCopy (obj) {
  if (typeof obj !== 'object') return obj
  const newObj = obj instanceof Array ? [] : {}
  for(let key in obj) {
    if (obj.hasOwnProperty(key)) {
      newObj[key] = typeof obj[key] === 'object' ? deepCopy(obj[key]) : obj[key]
    }
  }
  return newObj
}
```

缺点：

1. 递归爆栈，可以用循环解决
2. 无法解决循环引用问题，可以创建一个记忆的数组，如果已经拷贝过的对象就直接从数组中取出来

---

### Event loop

#### 消息队列和事件循环

![image](https://static001.geekbang.org/resource/image/e2/c6/e2582e980632fd2df5043f81a11461c6.png)

- 事件循环：在线程执行中接收并处理新的任务，本质上是 for 循环

- 消息队列：接收其他线程发送过来的任务

#### 页面使用单线程的缺点

- 如何处理高优先级的任务，例如监听 DOM 的变化
  - 使用微任务，消息队列的任务称为宏任务，每个宏任务都包含一个微任务队列，当宏任务执行完之后，渲染引擎并不着急去执行下一个宏任务，而是执行当前宏任务中微任务队列中的所有微任务
- 如何解决单个任务执行时长过久的问题
  - 通过回调功能来规避这种问题，也就是让要执行的 js 任务滞后执行

#### setTimeout

1. 延迟队列：浏览器中有一个延迟队列，setTimeout 会被添加进延迟队列中，当指定的延迟时间到了之后会定时器的回调会被添加到消息队列中执行，如果正在执行一个非常耗时的任务，会导致延迟执行的时间大于指定延迟的时间
2. 存在嵌套调用 setTimeout 的时候，系统会设置最小延迟时间 4ms ( 超过5层 )
3. 未激活的页面，setTimeout 最小间隔为 1000 ms
4. 延时执行时间的最大值2147483647（24.8天），溢出会导致定时器立即执行
5. setTimeout 设置回调函数 this 会是回调时候对应的 this 对象，可以使用箭头函数解决

#### 宏任务和微任务

宏任务：

- 渲染事件（解析 DOM，计算布局、绘制等）
- 用户的交互事件（鼠标点击、滚动、放大缩小）
- js 脚本执行
- 网络请求、文件读写

微任务：

- MutationObserve 监控 DOM 节点的变化
- Promise.resolve() 和 Promose.reject()

每一个宏任务都有一个微任务队列，当一个宏任务快执行完成，js 引擎就会去检查这个宏任务中的微任务队列是否有微任务，如果有则按顺序执行微任务，在执行微任务的时候如果产生了微任务的话，就会继续放在微任务队列里执行，直到微任务队列为空，才会去执行下一个宏任务，js 执行微任务的时机叫做检查点（checkpoint）, 有多个 checkpoint

![image](https://static001.geekbang.org/resource/image/83/88/839f468be3d683019c309e0acd8cd788.png)

![image](https://static001.geekbang.org/resource/image/1d/92/1db319c879610816c0cfea22723fc492.png)

