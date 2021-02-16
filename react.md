### React key

React 通过比较子元素的 key 属性，判断该元素是新增，移动，删除，替换。从而优化 diff 的比较。key 要保证在相邻的子元素中唯一，如果使用 index 作为 key 会导致重新排序，新增子元素的时候出现问题

---

### 受控组件 vs 非受控组件

非受控组件也就是不用 value 去控制表单的值，就想传统的表单，如果你想获取表单的值，就可以通过 ref 去获取表单的值，可以通过 defaultValue 设置非受控组件的默认值。

受控组件需要通过 value 和 onChange 去控制表单的值，value 代表表单最新的值，数据和 ui 同步更改

非受控组件可以应用在表单只是单纯的展示值，如果表单的值需要校验，通过判断表单的有效值去禁用按钮，或者表单的值需要一定格式这些复杂的场景就需要使用受控组件

---

### Hooks

#### Hooks 解决的问题

- 解决 React 复用逻辑的问题，以前复用逻辑使用的是 render props 和 hoc ，但这两种方式会让 React 组件嵌套的更深，导致看起来很臃肿，hooks 可以提取出复用的逻辑，这样可以更好的复用和测试，并且不用改变组件的嵌套结构
- 解决生命周期混乱的问题，class 组件中副作用会写在生命周期中，但是会把多种不同的逻辑写在同一个生命周期中，这样会造成结构不清晰，而且出现 bug 难以定位，hooks 可以把不同的逻辑写在不同的副作用钩子中。
- 解决 class 组件的难以理解的 this 问题，在 class 组件需要处理事件处理函数的 this 指向问题，需要手动 bind this，或者使用箭头函数等方法去处理 this 指向的问题，这些很容易被忽略；hooks 使用函数组件的写法，所以可以不用处理复杂的 this 指向问题

#### Hooks 的原理

React 通过数组来处理 Hooks 的调用，所以 Hooks 要保证在每次调用组件渲染的时候调用的顺序一致，所以 Hooks 只能出现在 React 的最顶层，不能出现在条件判断，循环体，函数里面

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

### React 理念

> 我们认为，React 是用 JavaScript 构建快速响应的大型 Web 应用程序的首选方式。它在 Facebook 和 Instagram 上表现优秀。

有两类场景会影响到快速响应：

- 当遇到大计算量的操作或者设备性能不足导致页面掉帧，卡顿
- 发送网络请求的时候，需要等待数据返回之后才能进一步的操作导致不能快速响应

可以概括为：

- CPU 的瓶颈
- IO 的瓶颈

#### CPU 瓶颈

主流浏览器的刷新评率是 60HZ，即每(1000ms/60HZ) 16.6ms 浏览器刷新一次，应为 GUI 渲染线程和 js 线程都是运行在主线程上，所以 js 脚本和浏览器的渲染布局不能同时进行，如果当 js 的执行超过 16.6ms，这次刷新的时间就没有执行样式的布局和绘制

React 通过在浏览器每一帧时间中预留一些时间给 js 线程，React 利用这个时间更新组件，初始预留时间是 5ms

当预留的时间不够用时，React 将线程控制权交给浏览器使其有时间渲染 UI，React 则等待下一帧时间到来继续执行中断的任务

> 这种将长任务拆分到每一帧中，被称为时间切片

解决 CPU 瓶颈的关键是时间切片，而时间切片的关键是，将同步的更新变成可中断的异步更新

#### io 瓶颈

网络延迟是前端开发者无法解决的，所以如何在网络延迟的客观存在中，减少用户对网络延迟的感知，React 给出的答案是将人际交互的研究结果整合到真实的 UI 中

---

### React 15 架构

React 15 架构可以分为两层：

- Reconciler （协调器）—— 负责找出变化的组件
- Renderer（渲染器）—— 负责将变化的组件渲染到页面上

#### Reconciler （协调器）

在 React 中可以通过 this.setState、this.forceUpdate、ReactDom.render 等 API 触发更新

每当有更新发生时，Reconciler 会做如下工作：

- 调用函数组件、class 组件的 render 方法，将返回的 jsx 转化为虚拟 DOM
- 将虚拟 DOM 和上次更新时的虚拟 DOM 做对比 diff
- 通过对比找出本次更新中变化的虚拟 DOM
- 通知 Renderer 将变化的虚拟 DOM 渲染到页面上

#### Renderer （渲染器）

由于 React 支持跨平台，所以不同平台有不同的 renderer。负责在浏览器环境渲染的 Renderer —— ReactDom

除此之外，还有：

- ReactNative 渲染器，渲染 App 原生组件
- ReactTest 渲染器，渲染出纯 JS 对象用于测试
- ReactArt 渲染器，渲染到 Canvas，SVG 或 VML（IE8）

在每次更新发生时，Renderer 接到 Reconciler 通知，将变化的组件渲染在当前的宿主环境

#### React 15 架构的缺点

在 Reconciler 中，mount 组件会调用 mountComponent，update 组件会调用 updateComponent，这两个方法都会递归的更新子组件

递归更新的缺点：
由于递归更新，所以更新一旦开始，中途就无法中断，当层级很深时，递归的时间超过 16ms，用户交互就会卡顿

可以使用可中断的异步更新优化吗？
因为 Reconciler 和 Renderer 是交替工作的，所以如果中断更新会导致页面只更新一部分，基于这个原因所以 React 决定重写整个架构

---

### React 16 架构

React 的架构可以分为三层：

- Scheduler（调度器）—— 调度任务的优先级，高优先级的任务优先进去 Reconclier
- Reconclier（协调器）—— 负责找出变化的组件
- Renderer（渲染器）—— 负责将变化的组件渲染到页面上

可以看到比 React 15 架构新增了 Scheduler 调度器

#### Scheduler 调度器

我们以浏览器是否有剩余的时间来当做任务中断的标准，需要一种机制，在浏览器中空闲时间去通知我们，其实部分浏览器已经实现了这个 API，这就是  requestIdleCallback，但是有以下的缺点，所以 React 放弃使用

- 浏览器的兼容性问题
- 触发评率不稳定，例如当 tab 切换的时候，之前的 tab 的 requestIdleCallback 的触发频率降低

基于以上的原因，React 实现了更加完善的 requestIdleCallback 的 polyfill，这就是 Scheduler，除了在空闲的时间触发回调，Scheduler 还提供调度任务优先级的设置

#### Reconclier 协调器

React 15 的协调器是递归虚拟 DOM 找出变化的 DOM，所以不可中断，在 React 16 中，Reconciler 使用循环去遍历虚拟 DOM，每次循环都会用 shouldYield 判断当前是否有空余的时间

```js
/** @noinline */
function workLoopConcurrent() {
  // Perform work until Scheduler asks us to yield
  while (workInProgress !== null && !shouldYield()) {
    workInProgress = performUnitOfWork(workInProgress);
  }
}
```

React 16 如何解决中断更新时 DOM 更新不完整？

在 React 16中，Reconclier 和 Renderer 不再是交替工作，当 Scheduler 把任务交给 Reconclier，会为虚拟 DOM 打上 增删改的标记

```js
export const Placement = /*             */ 0b0000000000010;
export const Update = /*                */ 0b0000000000100;
export const PlacementAndUpdate = /*    */ 0b0000000000110;
export const Deletion = /*              */ 0b0000000001000;
```

整个 Scheduler 和 Reconclier 的工作都是在内存中完成，只有当所有组件都完成 Reconclier 的工作时，才会统一交给 Renderer 更新页面

#### Renderer 渲染器

Renderer 会根据 Reconclier 为虚拟 DOM 的标记，同步更新 DOM 的操作

![image](https://react.iamkasong.com/img/process.png)

其中红框中的任务可以因为下面的原因中断

- 有更高的优先级的任务
- 当前帧没有足够时间

因为 Scheduler 和 Reconclier 的工作是在内存上完成的，所以即使中断多次，用户也是不会看到更新不完整的 DOM，这对用户是无感知的

---

### React Fiber

React Fiber 是 React 内部的一个状态更新机制，支持任务的不同优先级，任务可以中断和恢复，并且恢复后可以复用之前的中间状态，每个任务更新的单元为 React Element 对应的 Fiber 节点

#### Fiber 的含义

- 作为架构来说，之前 React 15 的 Reconclier 是通过递归方式执行，数据保存在递归调用栈中，所以叫做 stack Reconclier，在 React 16 中，Reconclier 是通过 Fiber 节点实现的，所以叫做 Fiber Reconclier
- 作为静态的数据结构来说，每个 Fiber 节点对应一个 React Element，包含组件的类型（类组件，函数组件，原生组件），对应的 DOM 节点信息等
- 作为动态的数据结构来说，每个 Fiber 节点保存组件中在本次更新中的改变的状态，要更新的工作（增删改）

#### Fiber 的结构

作为架构来说，每个 Fiber 对应的 React Element，是如何连成树的

```js
this.return = null;
// 指向子Fiber节点
this.child = null;
// 指向右边第一个兄弟Fiber节点
this.sibling = null;
```

如下的组件：

```js
function App() {
  return (
    <div>
      i am
      <span>KaSong</span>
    </div>
  )
}
```

对应的 Fiber 结构

![image](https://react.iamkasong.com/img/fiber.png)

作为静态数据结构，保存了组件的类型等

```js
// Fiber对应组件的类型 Function/Class/Host...
this.tag = tag;
// key属性
this.key = key;
// 大部分情况同type，某些情况不同，比如FunctionComponent使用React.memo包裹
this.elementType = null;
// 对于 FunctionComponent，指函数本身，对于ClassComponent，指class，对于HostComponent，指DOM节点tagName
this.type = null;
// Fiber对应的真实DOM节点
this.stateNode = null;
```

作为动态的工作单元，Fiber 保存了本次更新的相关信息等

```js
// 保存本次更新造成的状态改变相关信息
this.pendingProps = pendingProps;
this.memoizedProps = null;
this.updateQueue = null;
this.memoizedState = null;
this.dependencies = null;

this.mode = mode;

// 保存本次更新会造成的DOM操作
this.effectTag = NoEffect;
this.nextEffect = null;

this.firstEffect = null;
this.lastEffect = null;
```

下面两个字段和优先级有关

```js
// 调度优先级相关
this.lanes = NoLanes;
this.childLanes = NoLanes;
```

#### Fiber 工作原理

Fiber 节点可以保存对应的 DOM 节点，所以 Fiber 树可以对应 DOM 树，Fiber 使用双缓存技术完成 Fiber 树（DOM 树）的更新，在内存中的构建与替换的技术叫做双缓存技术。

#### 双缓存 Fiber 树

在 React 有两个 Fiber 树，一个是显示在当前页面上内容对应的 current Fiber 树，一个是在内存中构建的 workInProgress Fiber 树，current Fiber 的 Fiber 节点和 workInProgress 的 Fiber 节点通过 alternate 属性连接

```js
currentFiber.alternate === workInProgressFiber;
workInProgressFiber.alternate === currentFiber;
```

React 项目通过 current 指针在不同 Fiber 树的 rootFiber  中切换实现 Fiber 树的切换，当在 workInProgress 中构建完 Fiber 树并且交给 Renderer 去渲染页面时，应用的根节点就会把 current 指针指向 workInProgress Fiber 树，workInProgress Fiber 树就会变成 current Fiber 树。

每次状态更新时就会在内存中构建 workInProgress Fiber 树，通过 current 指针完成 workInProgress 和 current Fiber 树的切换，完成 DOM 的更新

#### 组件 mount 和 update 过程

```js
function App() {
  const [num, add] = useState(0);
  return (
    <p onClick={() => add(num + 1)}>{num}</p>
  )
}

ReactDOM.render(<App/>, document.getElementById('root'));
```

Mount 阶段

1. 首次调用 ReactDOM.render 时会创建 fiberRoot 和 rootFiber。fiberRoot 是整个应用的入口根节点，rootFiber 因为可以调用多次，所以不止有一个，它代表组件的根节点，fiberRoot 的 current 会指向当前页面上的 Fiber 树，被称作 current Fiber 树。

   ```js
   fiberRootNode.current = rootFiber;
   ```

   因为首屏渲染，所以还没有 DOM 挂载，所以 rootFiber 没有任何的子 Fiber 节点

   ![image](https://react.iamkasong.com/img/rootfiber.png)

2. 接下来就是调用组件的 render 方法，返回的 jsx 会在内存中构建 workInProgress Fiber 树，并且 workInProgress Fiber 节点通过 alternate 复用 rootFiber 的 Fiber 节点

   ![image](https://react.iamkasong.com/img/workInProgressFiber.png)

3. 最后把 workInProgress Fiber 树在 commit 阶段渲染到页面中，通过把 fiberRoot 的 current 指针指向 workInProgress Fiber 树，使其变成 current Fiber 树

   ![image](https://react.iamkasong.com/img/wipTreeFinish.png)

Update 更新阶段

1. 当点击按钮时候，会触发 render 阶段 ，这时会在内存中构建 workInProgress Fiber 树，workInProgress 可以决定是否复用 current Fiber 的节点，这个决定是否复用的过程就是 React 的 Diff 算法

   ![image](https://react.iamkasong.com/img/wipTreeUpdate.png)

2. 当完成 render 阶段之后，就进入 commit 阶段，fiberRoot 的 current 指针会指向 workInProgress Fiber 树，这时 workInProgress Fiber 树就会变成 current Fiber 树

   ![image](https://react.iamkasong.com/img/currentTreeUpdate.png)

#### render & commit 阶段

- Reconclier 工作被称为 render 阶段，在这个阶段会调用组件的 render 方法
- Renderer 工作被称为 commit 阶段，就像写代码的时候，需要把代码 commit ，commit 就是把 render 阶段提交的信息渲染到页面上
- render 和 commit 阶段称为 work，即 React 在工作中，在 Scheduler 中调度的任务不属于 work

#### diff 算法

diff 算法的本质是将组件生成的 jsx 对象，和 current Fiber 进行比较生成 workInProgress Fiber 的过程。由于 diff 算法本身就会造成性能损耗，将前后两颗树的比较的时间复杂度是 On3 次方。

为了降低 diff 算法的时间复杂度，React 团队做除了下面的限制：

1. 只对同级的元素进行 diff，如果一个元素在更新完跨越了层级，不会对他进行复用
2. 两个不同类型的元素会产生不同的树，如从 div 变成 p 标签，React 会销毁 div 及其子孙元素，会重新构建 p 及其子孙元素
3. 开发者可以通过 key 来暗示哪些子元素在不同渲染中保持稳定



