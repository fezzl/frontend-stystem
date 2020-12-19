### meta 标签

- 简介：meta 是元数据，用于描述数据的数据，它不会显示在页面上，但是会被机器识别
- 作用：meta 通常用于定义页面的说明，关键字，最后修改日期等元数据，这些元数据可以被浏览器页面，搜索引擎和其他网络服务所使用
- 组成：mata 标签有四个个属性，分别是 name、content、http-equiv、charset

#### name 属性

name 属性主要用来描述网页，比如网页的关键词、描述等，与之对应的属性是 content，content 的内容是对 name 填入类型的描述，便于搜索引擎的抓取，格式如下

```html
<meta name="参数" content="具体的描述">
```
name 有以下几种参数

1. keywords(关键字)
```html
// 用于告诉搜索引擎，你网页的关键字
<meta name="keywords" content="zzl, 个人博客">
```
2. description(描述)
```html
// 用于告诉搜索引擎，你网页的内容
<meta name="description" content="张泽林，一年工作经验的前端">
```
3. viewport(移动端的窗口)
```html
// 常用于移动端网页
<meta name="viewport" content="width=device-width, initial-scale=1">
```
4. renderer(双核浏览器渲染方式)
```html
// 用于指定双核浏览器用哪个内核渲染页面
<meta name="renderer" content="webkit"> //默认webkit内核
```

#### http-equiv 属性

相当于 http 的作用，可以定义 http 参数，meta 标签中 http-equiv 的格式如下
```html
<meta http-equiv="参数" content="具体描述">
```

http-equiv 有如下的参数
1. content-Type(设定网页字符集)
```html
// 用于设定网页的字符集，便于浏览器渲染解析页面
<meta http-equiv="content-Type" content="text/html;charset=utf-8">  //旧的HTML，不推荐

<meta charset="utf-8"> //HTML5设定网页字符集的方式，推荐使用UTF-8
```
2. X-UA-Compatible(浏览器采取哪种版本渲染当前页面)
```html
// 用于告诉浏览器以何种版本渲染页面(一般设置为最新模式)
 <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"/> //指定IE和Chrome使用最新版本渲染当前页面
```
3. cache-control(指定请求和响应遵循的缓存机制)
```html
// 指导浏览器如何缓存某个响应以及缓存多久
<meta http-equiv="cache-control" content="no-cache">
```
共有下面几种用法：
- no-cache: 每次请求都要去服务器验证是否过期，没过期的话就使用缓存
- no-store: 不使用缓存，每次都要去服务器获取资源
- public: 可以被任意机器缓存，包括客户端，代理服务器等
- private: 只能被客户端缓存，不能被代理服务器缓存

### position

- static
  - 静态定位，html 元素定位的默认属性，处于正常文档流，top/bottom/left/right/z-index 都没作用
- releative
  - 相对定位，相对于自身的定位，处于正常的文档流，top/bottom/left/right/z-index 可以起作用，当 z-index 不为 auto 时为创建一个层叠上下文
- absolute
  - 绝对定位，相对于有定位的（非 static）祖先元素的定位，脱离正常的文档流，不会出现边距重叠，当 z-index 不为 auto 时为创建一个层叠上下文
- fixed
  - 固定定位，相对于视口的固定定位（如果祖先元素没有设置 transform，perspective，filter 属性为 none)，不会被滚动改变定位，脱离文档流，总是为创建层叠上下文
- sticky
  - 粘性定位，相对定位和固定定位的结合，初始表现为相对定位，当指定元素滚动到小于滚动容器（如果没有滚动容器则相对于视口）的指定阈值时表现为固定定位，总是会创建层叠上下文

---



## flex 布局

flex 布局有一个主轴和侧轴，flex 布局包括 flex container 和 flex item，通过下面两种方式声明 flex 布局，设置 flex 布局之后子元素的 float、clear、vertical-align 属性将会失效

```css
.container {
  display: flex | inline-flex;
}
```

#### flex container

1. flex-direction: 决定主轴的方向（项目的排列方向）

   ```css
   .container {
     flex-direction: row | row-reverse | column | column-reverse
   }
   ```

   - row: 主轴为水平方向，起点在左边
   - row-reverse: 主轴为水平方向，起点在右边
   - column: 主轴为垂直方向，起点在上面
   - column: 主轴为垂直方向，起点在下面

2. flex-wrap: 决定容器内的元素是否可以换行

   ```css
   .container {
   	flex-wrap: nowrap | wrap | wrap-reverse;
   }
   ```

   - nowrap: 不换行，当空间不足时会调整为不会挤到下一行
   - wrap: 换行，当容器的空间被占满时会换行，第一行在上面
   - wrap-reverse: 换行，第一行在下面

3. flex-flow: flex-direction 和 flex-wrap 的组合

   ```css
   .container {
   	flex-flow: <flex-direction> || <flex-wrap>;
   }
   ```

4. justify-content: 定义了元素在主轴的对齐方式

   ```css
   .container {
   	justify-content: flex-start | flex-end | center | space-between | space-around
   }
   ```

   - flex-start: 左对齐
   - flex-end: 右对齐
   - center: 居中
   - space-between: 两端对齐，元素之间的间隔相等
   - space-around: 每个元素的两侧间隔相等

5. align-item: 定义元素在侧轴的对齐方式

   ```css
   .container {
   	align-items: flex-start | flex-end | center | baseline | stretch;
   }
   ```

   - stretch: 默认值。如果元素没设置高度或者设为 auto，将占满整个容器的高度
   - flex-start: 侧轴起点对齐
   - flex-end: 侧轴终点对齐
   - center: 侧轴的中点对齐
   - baseline: 元素的第一行文字基线对齐

6. align-content: 定义了多根轴线的对齐方式，如果只有一条轴线，那么该属性不会起作用

   ```css
   .container {
   	align-content: flex-start | flex-end | center | space-between | space-around | stretch;
   }
   ```

   - stretch: 默认值，多条轴线平分容器垂直方向的空间
   - flex-start: 轴线都在侧轴起点对齐
   - flex-end: 轴线都在侧轴的终点对齐
   - center: 轴线都在侧轴的中点对齐
   - space-between: 轴线在侧轴的两侧对齐，之间的间隔相等
   - space-around: 每个轴线的两侧相等，所以轴线之间的间隔比轴线与边缘的间隔大一倍

#### flex item

1. order: 定义元素在容器中的排列顺序，数值约小排的越前，默认为0

   ```css
   .item {
   	order: <integer>;
   }
   ```

2. flex-basis: 定义了在分配多余的空间之前，元素占据的主轴空间，浏览器会根据这个属性计算主轴是否还有剩余空间

   ```css
   .item {
   	flex-basis: <length> | auto;
   }
   ```

   默认值为 auto，即项目本来的大小，这时候 item 的宽高取决于 width 和 height 值。

   **当主轴为水平方向时，元素设置了 flex-basis 后，元素的宽高会失效， flex-basis 需要和 flex-grow 和 flex-shrink 配合使用**

3. flex-grow: 定义元素放大的比例

   ```css
   .item {
   	flex-grow: <number>;
   }
   ```

   默认值为0，即如果存在空间也不会放大

4. flex-shrink: 定义元素缩小的比例

   ```css
   .item {
   	flex-shrink: <number>;
   }
   ```

   默认值为1，即如果空间不足时，元素会缩小，负值对该属性无效

5. flex: flex-grow，flex-shrink，flex-basis 的组合

   ```css
   .item {
   		flex: none | [ <'flex-grow'> <'flex-shrink'>? || <'flex-basis'> ]
   }
   ```

   简写：auto (1 1 auto) 和 none (0 0 auto)

   当 flex 取一个非负数字，该数字为 flex-grow 的值，flex-shrink 取 1，flex-basis 取 0%，下面两种写法是相同的：

   ```css
   .item {
   	flex: 1;
   }
   .item {
     flex-grow: 1;
     flex-shrink: 1;
     flex-basis: 0%;
   }
   ```

6. align-self: 单个元素覆盖父元素的 align-item 的属性

   ```css
   .item {
     align-self: auto | flex-start | flex-end | center | baseline | stretch;
   }
   ```

---



### 垂直居中布局

1. 行内/行内块/图片

   原理：`text-align: center;` 控制行内元素相对块元素居中，然后就是 `line-height` 和 `vertical-align` 的基友关系使其垂直居中，`font-size: 0;` 是为了消除近似居中的 bug

   ```css
   .parent {
     height: 150px;
     line-height: 150px; /*行高的值与height相等*/
     text-align: center;
     font-size: 0; /*消除幽灵空白节点的bug*/
   }
   .son {
     /*display: inline-block;*/  /*如果是块级元素需改为行内或行内块级才生效*/
     vertical-align: middle;
   }
   ```

   优缺点

   - 优点：代码简单，兼容性好（ie8+）
   - 缺点：只对行内元素有效；需要添加 `font-size:0` 才可以完全居中；熟悉 `line-height` 和 `vertical-align` 的关系比较难

2. table-cell

   原理：CSS Table，使表格内容的对齐方式为 middle，然后根据是块级元素还是行内元素采取不同的方式达到水平居中

   ```css
   .parent {
     height: 150px;
     width: 200px;
     display: table-cell;
     vertical: middle;
     /*text-align: center;*/   /*如果是行内元素就添加这个*/
   }
   .son {
     /*margin: 0 auto;*/    /*如果是块级元素就添加这个*/
     width: 100px;
     height: 50px;
   }
   ```

   优缺点

   - 优点：简单；适用于宽度高度未知情况；兼容性好（ie8+）
   - 缺点：设置 table-cell 的元素，宽度和高度的值设置百分比无效，需要给它的父元素设置 `display:table;` 才生效；table-cell 不感知 margin，在父元素上设置 table-row 等属性，也会使其不感知 height

3. 绝对定位

   原理：子绝父相，top、right、bottom、left 的值是相对父元素尺寸的，然后 margin 或者 transform 是相对自身尺寸的，组合达到几何上的水平居中

   ```css
   .parent {
     position: relative;
   }
   .son {
     position: absolute;
     top: 50%;
     left: 50%;
     /*定宽高时等同于margin-left:负自身宽度一半;margin-top:负自身高度一半;*/
     transform: translate(-50%,-50%);
   }
   ```

   优缺点

   - 优点：使用 margin 兼容性好；不管是块级元素还是行内元素都可以实现
   - 缺点：代码较多；脱离文档流；使用 margin 需要知道宽高；使用 transform 兼容性不好（ie9+）

4. 绝对居中

   原理：当top、bottom为0时,margin-top&bottom设置auto的话会无限延伸占满空间并且平分；当left、right为0时,margin-left&right设置auto的话会无限延伸占满空间并且平分

   ```css
   .parent {
     position: relative;
   }
   .son {
     position: absolute;
     margin: auto;
     width: 100px;
     height: 100px;
     top: 0;
     bottom: 0;
     left: 0;
     right: 0;
   }
   ```

   优缺点

   - 优点：无需关注宽高；兼容性好（ie8+）
   - 缺点：代码较多，脱离文档流

5. flex

   原理：justify-content + align-items 实现垂直居中布局

   ```css
   .parent {
     display: flex;
     justify-content: center;
     align-items: center;
   }
   .son {
     width: 100px;
     height: 100px;
   }
   ```

---



### 层叠上下文

#### 什么是层叠上下文

层叠上下文（stacking context）是 HTML 中的一个三维的概念，每个盒模型的位置是三维的，分别有平面上的 x 轴，y 轴 以及表示层级的 z 轴，当元素发生堆叠的时候，会发现一个元素会覆盖一个元素的情况，如果一个元素含有层叠上下文（层叠上下文元素），我们可以理解为这个元素在 z 轴上高人一等，最终表现为离屏幕的观察者更近

#### 层叠水平

层叠水平（stacking level）决定了同一层叠上下文中元素在 z 轴的显示顺序，简单来说就是比较两个层叠元素的层级需要找到他们的父元素或者祖先元素是在同一层叠上下文（兄弟节点）下进行比较层级 

#### 怎么产生层叠上下文

- HTML 中的根元素 `<html></html>`本身具有层叠上下文，称为"根层叠上下文"
- position 属性为 relative 和 absolute 并且 z-index 不为 auto 的元素会产生层叠上下文
- position 属性为 fixed 或 sticky
- css3 属性
  1. `z-index`值不为`auto`的`flex`项(父元素`display:flex|inline-flex`).
  2. 元素的`opacity`值不是`1`.
  3. 元素的`transform`值不是`none`.
  4. 元素`mix-blend-mode`值不是`normal`.
  5. 元素的`filter`值不是`none`.
  6. 元素的`isolation`值是`isolate`.
  7. `will-change`指定的属性值为上面任意一个。
  8. 元素的`-webkit-overflow-scrolling`设为`touch`

#### 层叠顺序

![image](https://image.zhangxinxu.com/image/blog/201601/2016-01-09_211116.png)

#### 层叠准则

1. 谁大谁上：处于同一层叠上下文中，z-index 大的元素会覆盖 z-index 小的元素
2. 后来居上：当元素的层叠水平相同，层叠顺序相同，在 DOM 流中处于后面的元素会覆盖后面的元素

---

### BFC

#### 什么是 BFC

Block Formatting Context，块级格式化上下文，是 css 渲染的一部分，用于决定块盒子的布局以及浮动的相互影响的一个区域，在 BFC 中的元素不会影响外面的元素，反之亦然

#### 怎么创建 BFC

- 根元素 html 标签
- 浮动元素，float 不为 none
- overflow 值不为 visible
- 定位元素 poisition 为 absolute 或 fixed
- display 值为 inline-block`、`table-cell`、`table-caption`、`table`、`inline-table`、`flex`、`inline-flex`、`grid`、`inline-grid、flow-root

#### BFC 的作用

1. 解决浮动元素导致的高度坍塌，在 BFC 中浮动的元素高度会参与高度计算
2. 解决文字环绕浮动元素的问题
3. 解决边距重叠

---

### SEO

#### SEO 是什么

SEO 是搜索引擎优化，SEO 是伴随着搜索引擎的出现而来的，两者是相互促进，互利共生的关系。SEO 的存在就是为了提高网页在搜索引擎搜索结果的收录数量和排序位置而做的优化。而优化的目的就是为了提升网站在搜索引擎中的权重，增加对搜索引擎的友好，使得用户在搜索网站的时候能排到前面

#### SEO 优化手段

1. 对网站的标题、关键字、描述精心设置，反映网站的定位，让搜索引擎明白网站是做什么的；

2. 网站内容优化：内容与关键字的对应，增加关键字的密度；

3. 在网站上合理设置Robot.txt文件；

4. 生成针对搜索引擎友好的网站地图；

5. 增加外部链接，到各个网站上宣传。
6. ssr，服务端渲染

---

### css 预处理器

css 预处理器是一个能让你通过预处理器自己独有的语法来生成 css 的程序，绝大多数 css 预处理器会增加一些原生 css 不具备或不完善的高级特性，这些特性让 css 的结构更加具有可读性且易于维护

- [Sass](http://sass-lang.com/)：2007 年诞生，最早也是最成熟的 CSS 预处理器，拥有 Ruby 社区的支持和 Compass 这一最强大的 CSS 框架，目前受 LESS 影响，已经进化到了全面兼容 CSS 的 SCSS。
- [Less](http://lesscss.org/)：2009年出现，受 SASS 的影响较大，但又使用 CSS 的语法，让大部分开发者和设计师更容易上手，在 Ruby 社区之外支持者远超过 SASS，其缺点是比起 SASS 来，可编程功能不够，不过优点是简单和兼容 CSS，反过来也影响了 SASS 演变到了 SCSS 的时代，著名的 Twitter Bootstrap 就是采用 LESS 做底层语言的。
- [Stylus](http://stylus-lang.com/)：Stylus 是一个CSS的预处理框架，2010 年产生，来自 Node.js 社区，主要用来给 Node 项目进行 CSS 预处理支持，所以 Stylus 是一种新型语言，可以创建健壮的、动态的、富有表现力的 CSS。比较年轻，其本质上做的事情与 SASS/LESS 等类似，

预处理器的优点：

- 变量
- 代码混合
- 嵌套
- 代码模块化













