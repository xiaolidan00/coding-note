import type {ElmtRect} from "@/@types";
import {useEditorStore} from "@/stores";
import {useMovable} from "@/utils/useMovable";
import interact from "interactjs";
import {nextTick, onBeforeUnmount, onMounted, watch} from "vue";

export function useCardAction(cb: (rect: ElmtRect) => void) {
  const store = useEditorStore();
  const className = ".cr-canvas-panel>.cr-canvas-card.active";
  const position = {x: 0, y: 0};
  const sizePos = {
    x: 0,
    y: 0,
    width: 0,
    height: 0
  };

  const init = () => {
    if (store.isMoveResize) return;
    interact(className).resizable(false);
    interact(className).draggable(false);

    if (store.currentAction === "resize") {
      interact(className).resizable({
        edges: {top: true, left: true, bottom: true, right: true},
        listeners: {
          start: (event) => {
            sizePos.x = 0;
            sizePos.y = 0;
            sizePos.width = event.rect.width;
            sizePos.height = event.rect.height;
            store.isMoveResize = true;

            if (store.activeElmt)
              cb({
                left: sizePos.x + store.activeElmt.screen.left,
                top: sizePos.y + store.activeElmt.screen.top,
                width: sizePos.width * store.unscaleVal,
                height: sizePos.height * store.unscaleVal
              });
          },
          move: (event) => {
            sizePos.x += event.deltaRect.left;
            sizePos.y += event.deltaRect.top;
            sizePos.width = event.rect.width;
            sizePos.height = event.rect.height;
            store.isMoveResize = true;
            event.target.style.width = sizePos.width * store.unscaleVal + "px";
            event.target.style.height = sizePos.height * store.unscaleVal + "px";
            event.target.style.transform = `translate(${sizePos.x}px, ${sizePos.y}px)`;

            if (store.activeElmt)
              cb({
                left: sizePos.x + store.activeElmt.screen.left,
                top: sizePos.y + store.activeElmt.screen.top,
                width: sizePos.width * store.unscaleVal,
                height: sizePos.height * store.unscaleVal
              });
          },
          end: (event) => {
            event.target.style.transform = "";
            store.isMoveResize = false;

            if (store.activeElmt) {
              const rect = {
                left: sizePos.x + store.activeElmt.screen.left,
                top: sizePos.y + store.activeElmt.screen.top,
                width: sizePos.width * store.unscaleVal,
                height: sizePos.height * store.unscaleVal
              };
              store.setElementSize(rect);
              cb(rect);
            }
            nextTick(() => {
              store.currentAction = "move";
            });
          }
        }
      });
    } else {
      interact(className).draggable({
        listeners: {
          start: (event) => {
            position.x = 0;
            position.y = 0;
            store.isMoveResize = true;

            if (store.activeElmt)
              cb({
                left: position.x * store.unscaleVal + store.activeElmt.screen.left,
                top: position.y * store.unscaleVal + store.activeElmt.screen.top,
                width: store.activeElmt.screen.width,
                height: store.activeElmt.screen.height
              });
          },
          move: (event) => {
            position.x += event.dx;
            position.y += event.dy;
            store.isMoveResize = true;
            event.target.style.transform = `translate(${position.x * store.unscaleVal}px, ${
              position.y * store.unscaleVal
            }px)`;
            if (store.activeElmt)
              cb({
                left: position.x * store.unscaleVal + store.activeElmt.screen.left,
                top: position.y * store.unscaleVal + store.activeElmt.screen.top,
                width: store.activeElmt.screen.width,
                height: store.activeElmt.screen.height
              });
          },
          end: (event) => {
            store.isMoveResize = false;
            event.target.style.transform = "";
            if (store.activeElmt) {
              const left = position.x * store.unscaleVal + store.activeElmt.screen.left;
              const top = position.y * store.unscaleVal + store.activeElmt.screen.top;
              store.setElementPos(left, top);
              cb({
                left,
                top,
                width: store.activeElmt.screen.width,
                height: store.activeElmt.screen.height
              });
            }
          }
        }
      });
    }
  };

  watch(
    () => store.currentAction,
    () => {
      init();
    }
  );
  watch(
    () => store.childConfigId,
    () => {
      init();
    }
  );
  watch(
    () => store.activeGlobalConfig.layout,
    () => {
      init();
    }
  );
  const destroy = () => {
    interact(className).draggable(false);
    interact(className).resizable(false);
  };
  onMounted(() => {
    init();
  });
  onBeforeUnmount(() => {
    destroy();
  });
}
