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

#### 作用域链

当一个块或者函数嵌套在另一个块或者函数中，就发生了作用域的嵌套，因此，如果在当前的作用域无法找到某个变量的时候，js 引擎就会在外层嵌套的作用域中去寻找，直到找到该变量或者到达最外层的作用域（也就是全局作用域）为止，这就是作用域链

### 查找变量异常

js 引擎首先会在代码执行前对其进行编译，在这个过程中，像`var a = 2` 这样的声明会被分解成两个独立的步骤

1. 首先 `var a` 会在作用域中声明新的变量，这发生在代码执行前
2. 接下来，`a = 2` 会进行 LHS 查询变量 a 并进行赋值

LHS 和 RHS 查询都会在当前作用域中开始查找，如果有需要（也就是在当前的作用域没有找到所需的变量），就会向上级作用域继续查找变量，这样每次上升一级作用域，最后抵达全局作用域，无论找到没找到都会停止

不成功的 RHS 引用会导致抛出 ReferenceError 异常。不成功的 LHS 引用会导致隐式的创建一个全局变量（非严格模式下），该变量会用 LHS 引用的目标作为变量的名称，或者抛出 ReferenceError 异常（严格模式下）

### 词法作用域

词法作用域意味着作用域是由书写代码时函数声明的位置来决定的。编译的词法分析阶段基本能够知道全部标识符在哪里以及是如何声明的，从而能够进行优化，在运行时更快的进行查找

---

### 闭包

当函数可以记住并访问所在的词法作用域，即使函数是在当前的词法作用域之外执行，这时就产生了闭包