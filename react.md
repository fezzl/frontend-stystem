### react key

React 通过比较子元素的 key 属性，判断该元素是新增，移动，删除，替换。从而优化 diff 的比较。key 要保证在相邻的子元素中唯一，如果使用 index 作为 key 会导致重新排序，新增子元素的时候出现问题

---

### 受控组件 vs 非受控组件

非受控组件也就是不用 value 去控制表单的值，就想传统的表单，如果你想获取表单的值，就可以通过 ref 去获取表单的值，可以通过 defaultValue 设置非受控组件的默认值。

受控组件需要通过 value 和 onChange 去控制表单的值，value 代表表单最新的值，数据和 ui 同步更改

非受控组件可以应用在表单只是单纯的展示值，如果表单的值需要校验，通过判断表单的有效值去禁用按钮，或者表单的值需要一定格式这些复杂的场景就需要使用受控组件

---

### Hooks

#### Hooks 解决的问题

- 解决 react 复用逻辑的问题，以前复用逻辑使用的是 render props 和 hoc ，但这两种方式会让 react 组件嵌套的更深，导致看起来很臃肿，hooks 可以提取出复用的逻辑，这样可以更好的复用和测试，并且不用改变组件的嵌套结构
- 解决生命周期混乱的问题，class 组件中副作用会写在生命周期中，但是会把多种不同的逻辑写在同一个生命周期中，这样会造成结构不清晰，而且出现 bug 难以定位，hooks 可以把不同的逻辑写在不同的副作用钩子中。
- 解决 class 组件的难以理解的 this 问题，在 class 组件需要处理事件处理函数的 this 指向问题，需要手动 bind this，或者使用箭头函数等方法去处理 this 指向的问题，这些很容易被忽略；hooks 使用函数组件的写法，所以可以不用处理复杂的 this 指向问题

#### Hooks 的原理

react 通过数组来处理 Hooks 的调用，所以 Hooks 要保证在每次调用组件渲染的时候调用的顺序一致，所以 Hooks 只能出现在 react 的最顶层，不能出现在条件判断，循环体，函数里面

Hooks 的伪代码实现

```js
let state = [];
let setters = [];
let firstRun = true;
let cursor = 0;

function createSetter(cursor) {
  return function setterWithCursor(newVal) {
    state[cursor] = newVal;
  };
}

// This is the pseudocode for the useState helper
export function useState(initVal) {
  if (firstRun) {
    state.push(initVal);
    setters.push(createSetter(cursor));
    firstRun = false;
  }

  const setter = setters[cursor];
  const value = state[cursor];

  cursor++;
  return [value, setter];
}
```

first render

![image](https://miro.medium.com/max/1260/1*8TpWnrL-Jqh7PymLWKXbWg.png)

subsequent render

![image](https://miro.medium.com/max/1254/1*qtwvPWj-K3PkLQ6SzE2u8w.png)

event handing

![image](https://miro.medium.com/max/1260/1*3L8YJnn5eV5ev1FuN6rKSQ.png)

### react 理念

> 我们认为，React 是用 JavaScript 构建快速响应的大型 Web 应用程序的首选方式。它在 Facebook 和 Instagram 上表现优秀。

有两类场景会影响到快速响应：

- 当遇到大计算量的操作或者设备性能不足导致页面掉帧，卡顿
- 发送网络请求的时候，需要等待数据返回之后才能进一步的操作导致不能快速响应

可以概括为：

- cpu 的瓶颈
- IO 的瓶颈

#### cpu 瓶颈

主流浏览器的刷新评率是 60HZ，即每(1000ms/60HZ) 16.6ms 浏览器刷新一次，应为 GUI 渲染线程和 js 线程都是运行在主线程上，所以 js 脚本和浏览器的渲染布局不能同时进行，如果当 js 的执行超过 16.6ms，这次刷新的时间就没有执行样式的布局和绘制

react 通过在浏览器每一帧时间中预留一些时间给 js 线程，react 利用这个时间更新组件，初始预留时间是 5ms

当预留的时间不够用时，react 将线程控制权交给浏览器使其有时间渲染 UI，react 则等待下一帧时间到来继续执行中断的任务

> 这种将长任务拆分到每一帧中，被称为时间切片

#### io 瓶颈
