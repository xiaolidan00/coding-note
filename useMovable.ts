export const useMovable = (className: string, startFun: Function, moveFun: Function, endFun: Function) => {
  const str = className.split(".").filter((a) => a);
  const pos = {x: 0, y: 0, offsetx: 0, offsety: 0};
  const onMouseMove = (ev: MouseEvent) => {
    pos.offsetx += ev.pageX - pos.x;
    pos.offsety += ev.pageY - pos.y;
    pos.x = ev.pageX;
    pos.y = ev.pageY;

    moveFun({
      event: ev,
      pos
    });
  };
  const onMouseUp = (ev: MouseEvent) => {
    pos.offsetx += ev.pageX - pos.x;
    pos.offsety += ev.pageY - pos.y;
    pos.x = ev.pageX;
    pos.y = ev.pageY;
    document.onselectstart = null;
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);

    endFun({
      event: ev,
      pos
    });
  };
  const onMouseDown = (ev: MouseEvent) => {
    const target = ev.target as HTMLElement;

    for (let i = 0; i < str.length; i++) {
      if (!target.classList.contains(str[i])) {
        return;
      }
    }
    pos.x = ev.pageX;
    pos.y = ev.pageY;
    pos.offsetx = 0;
    pos.offsety = 0;
    document.onselectstart = () => false;
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    startFun({
      event: ev,
      pos
    });
  };
  const init = () => {
    document.addEventListener("mousedown", onMouseDown);
  };
  const destroy = () => {
    document.removeEventListener("mousedown", onMouseDown);
    document.onselectstart = null;
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
  };
  return {
    init,
    destroy,
    onMouseDown
  };
};
