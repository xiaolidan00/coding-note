//拖拽排序

const defaultConfig = {
  data: [],
  activeStyle: {
    transition: "all 1s ease-in-out",
    cursor: "move",
  },
  activeClass: "moving",
  onStart: (e) => e,
  onChange: (e) => e,
  onEnd: (e) => e,
  onMove: (e) => e,
};
export class DragSort {
  constructor(container, config = defaultConfig) {
    this.container = container;
    this.config = Object.assign(defaultConfig, config);
    this.sourceNode = null;
    this.init();
  }
  setChildDraggable() {
    const children = Array.from(this.container.children);
    for (let i = 0; i < children.length; i++) {
      children[i].setAttribute("draggable", true);
    }
    this.children = children;
  }
  init() {
    this.container.addEventListener(
      "DOMSubtreeModified",
      this.setChildDraggable.bind(this),
      false
    );
    this.setChildDraggable();
    this.container.addEventListener("dragstart", this.onDragStart.bind(this));
    this.container.addEventListener("dragover", this.onDragOver.bind(this));
    this.container.addEventListener("dragend", this.onDragEnd.bind(this));
    this.container.addEventListener("dragenter", this.onDragEnter.bind(this));
  }
  onDragOver(e) {
    this.config.onMove && this.config.onMove(e);
  }
  onDragEnd(e) {
    for (let k in this.config.activeStyle) {
      this.sourceNode.style[k] = this.defatultStyle[k];
    }
    if (this.config.activeClass) {
      e.target.classList.remove(this.config.activeClass);
    }
    this.config.onEnd &&
      this.config.onEnd({ event: e, data: this.config.data });
  }
  onDragStart(e) {
    this.sourceNode = e.target;
    this.defatultStyle = {};
    for (let k in this.config.activeStyle) {
      this.defatultStyle[k] = e.target.style[k];
      e.target.style[k] = this.config.activeStyle[k];
    }
    if (this.config.activeClass) {
      e.target.classList.add(this.config.activeClass);
    }
    const sourceIndex = this.children.indexOf(this.sourceNode);
    this.config.onStart &&
      this.config.onStart({
        event: e,
        sourceIndex,
        sourceNode: this.sourceNode,
      });
  }
  onDragEnter(e) {
    e.preventDefault(); // 清除默认事件
    let target = e.target;
    if (target === this.sourceNode || target === this.container) {
      // 放置目标不是自身元素或者最外层容器时有效
      return;
    }
    while (target.parentNode !== this.container) {
      target = target.parentNode;
    }

    const sourceIndex = this.children.indexOf(this.sourceNode); // 获取拖动元素的下标
    const targetIndex = this.children.indexOf(target); // 获取目标元素的下标
    if (sourceIndex > targetIndex) {
      // 向上拖动
      this.container.insertBefore(this.sourceNode, target); // 将拖动元素插入目标元素之前
    } else {
      // 向下拖动
      // 将拖动元素插入目标元素之后
      this.container.insertBefore(
        this.sourceNode,
        this.children[targetIndex + 1]
      );
    }
    this.swapData(targetIndex, sourceIndex);
    // console.log(this.config.data.map((it) => it.idx));
    this.config.onChange &&
      this.config.onChange({
        event: e,
        sourceIndex,
        sourceNode: this.sourceNode,
        target,
        targetIndex,
      });
  }
  swapData(startIndex, targetIndex) {
    const temp = this.config.data[startIndex];
    this.config.data[startIndex] = this.config.data[targetIndex];
    this.config.data[targetIndex] = temp;
  }
  destroy() {
    this.container.removeEventListener(
      "dragenter",
      this.onDragEnter.bind(this)
    );
    this.container.removeEventListener("dragover", this.onDragOver.bind(this));
    this.container.removeEventListener("dragend", this.onDragEnd.bind(this));
    this.container.removeEventListener(
      "dragstart",
      this.onDragStart.bind(this)
    );
    this.container.removeEventListener(
      "DOMSubtreeModified",
      this.setChildDraggable.bind(this),
      false
    );
  }
}
