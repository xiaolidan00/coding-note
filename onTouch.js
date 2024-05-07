export function onDomTouch(dom, cb) {
  let startx, starty;
  let isTouch = "ontouchend" in document;
  //获得角度
  function getAngle(angx, angy) {
    return (Math.atan2(angy, angx) * 180) / Math.PI;
  }

  //根据起点终点返回方向
  function getDirection(startx, starty, endx, endy) {
    let angx = endx - startx;
    let angy = endy - starty;

    //如果滑动距离太短
    if (Math.abs(angx) <= 2 && Math.abs(angy) <= 2) {
      return "click";
    }

    let angle = getAngle(angx, angy);
    if (angle >= -135 && angle <= -45) {
      return "up";
    } else if (angle > 45 && angle < 135) {
      return "down";
    } else if (
      (angle >= 135 && angle <= 180) ||
      (angle >= -180 && angle < -135)
    ) {
      return "left";
    } else if (angle >= -45 && angle <= 45) {
      return "right";
    }
    return "click";
  }

  const startFun = (e) => {
    if (isTouch) {
      startx = e.touches[0].pageX;
      starty = e.touches[0].pageY;
    } else {
      startx = e.pageX;
      starty = e.pageY;
    }
  };

  const endFun = (e) => {
    let endx, endy;
    if (isTouch) {
      endx = e.changedTouches[0].pageX;
      endy = e.changedTouches[0].pageY;
    } else {
      endx = e.pageX;
      endy = e.pageY;
    }
    let direction = getDirection(startx, starty, endx, endy);
    console.log("滑动", direction);
    cb && cb(direction);
  };
  if (isTouch) {
    //手指接触屏幕
    dom.addEventListener("touchstart", startFun, false);
    //手指离开屏幕
    dom.addEventListener("touchend", endFun, false);
  } else {
    dom.addEventListener("pointerdown", startFun, false);
    dom.addEventListener("pointerup", endFun, false);
  }
  const destory = () => {
    if (isTouch) {
      //手指接触屏幕
      dom.removeEventListener("touchstart", startFun, false);
      //手指离开屏幕
      dom.removeEventListener("touchend", endFun, false);
    } else {
      dom.removeEventListener("pointerdown", startFun, false);
      dom.removeEventListener("pointerup", endFun, false);
    }
  };

  return {
    destory,
    isTouch,
  };
}
