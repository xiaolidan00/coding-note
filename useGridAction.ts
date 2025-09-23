import interact from "interactjs";
import {computed, nextTick, onBeforeUnmount, onMounted, ref, watch} from "vue";
import {useEditorStore} from "@/stores";
import {useDragSort} from "@/utils/useDragSort";

export const useGridAction = (props: any, flowRef: any) => {
  const className = ".cr-flow-panel>.cr-flow-card.active";
  const store = useEditorStore();
  const isMask = ref(false);
  const unitSize = computed(() => ({
    width: Math.floor((props.viewWidth - (props.colNum + 1) * props.gap) / props.colNum),
    height: Math.floor((props.viewHeight - (props.rowNum + 1) * props.gap) / props.rowNum)
  }));
  const unit = computed(() => ({
    w: props.gap + unitSize.value.width,
    h: props.gap + unitSize.value.height
  }));
  const sortable = useDragSort({
    activeClass: "active",
    onStart: () => {
      store.isMoveResize = true;
    },
    onMove: () => {
      store.isMoveResize = true;
    },
    onEnd: () => {
      store.isMoveResize = false;
    },
    onChange: ({sortMap}) => {
      store.isMoveResize = false;
      const elmts = store.activeElmtsConfig;
      elmts.forEach((item) => {
        item.index = sortMap[item.id];
      });
      store.setActiveElmts(elmts);
    }
  });

  const switchAction = () => {
    if (store.isMoveResize) return;
    nextTick(() => {
      if (store.currentAction === "move") {
        sortable.init(flowRef.value as HTMLElement);
        interact(className).resizable(false);
      } else {
        sortable.destroy();
        interact(className).resizable({
          edges: {top: false, left: false, right: true, bottom: true},
          listeners: {
            start: () => {
              isMask.value = true;
              store.isMoveResize = true;
            },
            move: (event) => {
              store.isMoveResize = true;
              event.target.style.width = event.rect.width + "px";
              event.target.style.height = event.rect.height + "px";
            },
            end: (event) => {
              isMask.value = false;
              store.isMoveResize = false;

              const row = Math.round(event.rect.height / unit.value.h) || 1;
              const col = Math.round(event.rect.width / unit.value.w) || 1;
              store.setElmtFlowRect(col, row);
              event.target.style.width = unitSize.value.width * col + "px";
              event.target.style.height = unitSize.value.height * row + "px";
              nextTick(() => {
                store.currentAction = "move";
              });
            }
          }
        });
      }
    });
  };
  watch(
    () => store.currentAction,
    () => {
      switchAction();
    }
  );
  watch(
    () => store.childConfigId,
    () => {
      switchAction();
    }
  );
  watch(
    () => store.activeGlobalConfig.layout,
    () => {
      switchAction();
    }
  );
  onMounted(() => {
    switchAction();
  });
  onBeforeUnmount(() => {
    if (sortable) sortable.destroy();
    interact(className).resizable(false);
  });
  return {isMask, unitSize};
};
