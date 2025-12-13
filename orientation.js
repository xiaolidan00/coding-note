//横屏竖屏
function orientationChange() {
  if (window.orientation == 180 || window.orientation == 0) {
    console.log("竖屏");
  }
  if (window.orientation == 90 || window.orientation == -90) {
    console.log("横屏");
  }
}

window.addEventListener("orientationchange", orientationChange);
