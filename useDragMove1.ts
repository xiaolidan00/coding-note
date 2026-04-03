export interface DragMoveConfig {
  start?: (e: MouseEvent) => void;
  move?: (e: MouseEvent) => void;
  end?: (e: MouseEvent) => void;
  isBody?: boolean;
  minMove?: number;
  start1?: (e: DragPosType) => void;
  move1?: (e: DragPosType) => void;
  end1?: (e: DragPosType) => void;
}
export type DragPosType = {
  offsetx: number;
  offsety: number;
  x: number;
  y: number;
  startx: number;
  starty: number;
  endx: number;
  endy: number;
  enable: boolean;
  move: boolean;
};
export function useDragMove(config: DragMoveConfig) {
  if (config.isBody && !config.minMove) {
    config.minMove = 5;
  }
  let el: HTMLElement;
  const state: DragPosType = {
    offsetx: 0,
    offsety: 0,
    x: 0,
    y: 0,

    startx: 0,
    starty: 0,
    endx: 0,
    endy: 0,
    enable: false,
    move: false
  };
  const onMouseDown = (ev: MouseEvent) => {
    ev.stopImmediatePropagation();
    ev.stopPropagation();
    if (config.isBody) {
      if (ev.target !== el) return;
      state.x = ev.pageX;
      state.y = ev.pageY;
      state.startx = ev.offsetX;
      state.starty = ev.offsetY;
      state.endx = ev.offsetX;
      state.endy = ev.offsetY;
      state.offsetx = 0;
      state.offsety = 0;
      state.enable = true;
      state.move = false;
      config.start1 && config.start1(state);

      document.body.addEventListener("mousemove", onMouseMove);
      document.body.addEventListener("mouseup", onMouseUp);
    } else {
      config.start && config.start(ev);
      el.addEventListener("mousemove", onMouseMove);
      el.addEventListener("mouseup", onMouseUp);
    }

    document.onselectstart = () => false;
  };
  const onMouseMove = (ev: MouseEvent) => {
    if (config.isBody) {
      if (state.enable) {
        state.offsetx += ev.pageX - state.x;
        state.offsety += ev.pageY - state.y;
        state.x = ev.pageX;
        state.y = ev.pageY;
        state.endx = state.startx + state.offsetx;
        state.endy = state.starty + state.offsety;
        if (Math.abs(state.offsetx) >= config.minMove! || Math.abs(state.offsety) >= config.minMove!) {
          state.move = true;
        }
        config.move1 && config.move1(state);
      }
    } else {
      ev.target === el && config.move && config.move(ev);
    }
  };
  const onMouseUp = (ev: MouseEvent) => {
    if (config.isBody) {
      if (state.enable) {
        config.end1 && config.end1(state);
      }
      state.enable = false;
      state.move = false;
      document.body.removeEventListener("mousemove", onMouseMove);
      document.body.removeEventListener("mouseup", onMouseUp);
    } else {
      ev.target === el && config.end && config.end(ev);
      el.removeEventListener("mousemove", onMouseMove);
      el.removeEventListener("mouseup", onMouseUp);
    }
    document.onselectstart = null;
  };
  return {
    init: (dom: HTMLElement) => {
      el = dom;
      el.addEventListener("mousedown", onMouseDown);
    },
    state,
    destroy: () => {
      if (el) el.removeEventListener("mousedown", onMouseDown);
    }
  };
}
