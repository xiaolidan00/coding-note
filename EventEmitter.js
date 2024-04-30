export class EventEmitter {
  constructor() {
    this.eventMap = new Map();
  }
  on(event, fn) {
    if (typeof fn === "function") {
      const fns = this.eventMap.get(event);
      if (fns) {
        if (!fns.has(fn)) {
          fns.set(fn, 1);
        }
      } else {
        //采用map可以更加快速增删改查
        const fns = new Map();
        fns.set(fn, 1);
        this.eventMap.set(event, fns.set(fn, 1));
      }
    }
  }
  off(event, fn) {
    if (typeof fn === "function") {
      const fns = this.eventMap.get(event);
      if (fns?.has(fn)) {
        fns.delete(fn);
      }
    }
  }
  emit(event, data) {
    const fns = this.eventMap.get(event);
    if (fns) {
      fns.forEach((i, fn) => {
        fn(data);
      });
    }
  }
  once(event, fn) {
    //包裹一层function，一旦触发就销毁
    const fun = (data) => {
      fn(data);
      this.off(event, fun);
    };
    this.on(event, fun);
  }
}
