import {useEditorStore} from "@/stores";
import interact from "interactjs";
export const useMoveResize = (
  className: string,
  cb: {
    moveStart?: Function;
    move?: Function;
    moveEnd?: Function;
    resizeStart?: Function;
    resize?: Function;
    resizeEnd?: Function;
  }
) => {
  const store = useEditorStore();
  const position = {x: 0, y: 0};
  const sizePos = {
    x: 0,
    y: 0,
    width: 0,
    height: 0
  };

  return {
    init: () => {
      interact(className).draggable({
        listeners: {
          start: (event) => {
            position.x = 0;
            position.y = 0;
            cb.moveStart &&
              cb.moveStart({
                event,
                type: "move",
                position
              });
          },
          move: (event) => {
            position.x += event.dx;
            position.y += event.dy;

            event.target.style.transform = `translate(${position.x * store.unscaleVal}px, ${
              position.y * store.unscaleVal
            }px)`;
            cb.move &&
              cb.move({
                event,
                type: "move",
                position
              });
          },
          end: (event) => {
            event.target.style.transform = "";
            cb.moveEnd &&
              cb.moveEnd({
                event,
                type: "move",
                position
              });
          }
        }
      });

      interact(className).resizable({
        edges: {top: true, left: true, bottom: true, right: true},
        listeners: {
          start: (event) => {
            sizePos.x = 0;
            sizePos.y = 0;
            sizePos.width = event.rect.width;
            sizePos.height = event.rect.height;
            cb.resizeStart &&
              cb.resizeStart({
                event,
                type: "resize",
                sizePos
              });
          },
          move: (event) => {
            sizePos.x += event.deltaRect.left;
            sizePos.y += event.deltaRect.top;
            sizePos.width = event.rect.width;
            sizePos.height = event.rect.height;

            event.target.style.width = sizePos.width * store.unscaleVal + "px";
            event.target.style.height = sizePos.height * store.unscaleVal + "px";
            event.target.style.transform = `translate(${sizePos.x}px, ${sizePos.y}px)`;

            cb.resize &&
              cb.resize({
                event,
                type: "resize",
                sizePos
              });
          },
          end: (event) => {
            event.target.style.transform = "";

            cb.resizeEnd &&
              cb.resizeEnd({
                event,
                type: "resize",
                sizePos
              });
          }
        }
      });
    },
    destroy: () => {
      interact(className).draggable(false);
      interact(className).resizable(false);
    }
  };
};
