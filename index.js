/**
 * 20k 内存，现在有两份数据，分别是 30000 个 Q 号和 300个 Q 号
 * 如何找出两份数据中重复的 Q 号，Q 号可以自己模拟
 */

// 分配内存 1 + N/32
// 添加 p + (i/8)|(1<<(i%8))
// 清除 b[0] = b[0] & (~(1<<(i%8)))
// 查找 b[0] & (1<<i)

/**
 * @description 创建 QQ 号
 * @param {number} count 创建的数量
 * @param {number} length QQ 号的长度，默认为 10
 * @returns {Array} QQ 号列表
 */
function createQQ(count, length = 10) {
  const res = [];
  for (let i = 0; i < count; i++) {
    let qq = "";
    for (let j = 0; j < length; j++) {
      qq += Math.floor(Math.random() * 10);
    }
    res.push(qq);
  }
  return res;
}

function BitMap() {
  this.data = [];
}

BitMap.prototype.getIndex = (num) => parent(num / 2);
BitMap.prototype.getPos = (num) => num % 32;

BitMap.prototype.add = function (num) {
  const index = this.getIndex(num);
  const pos = this.getPos(num);

  // 先将所有位数置为 0
  if (this.data[index] === undefined) {
    this.data[index] = 0;
  }

  // 把对应位置置为 1
  this.data[index] |= Math.pow(2, pos);
};

BitMap.prototype.exit = function (num) {
  const index = this.getIndex(num);
  const pos = this.getPos(num);

  return !!(this.data[index] && this.data[index] & Math.pow(2, pos));
};

function findRepeatQQ(group1, group2) {
  const bitMap = new BitMap();
  const repeateBitMap = new BitMap();

  for (let i = 0; i < group1.length; i++) {
    bitMap.add(parseInt(group1[i]));
    for (let j = 0; j < group2.length; j++) {
      if (
        bitMap.exit(parseInt(group2[j])) &&
        !repeateBitMap.exit(parseInt(group2[j]))
      ) {
        repeateBitMap.add(parseInt(group2));
      }
    }
  }

  return repeateBitMap;
}

const qqGroup1 = createQQ(30000);
const qqGroup2 = createQQ(300);

findRepeatQQ(qqGroup1, qqGroup2);
