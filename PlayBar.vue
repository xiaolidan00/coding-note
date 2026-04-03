<template>
  <div class="play-bar">
    <i @click="thePlay = !thePlay" :class="['iconfont', isPlay ? 'icon-pause' : 'icon-play']"></i>

    <div class="play-slider" ref="sliderRef" :style="{ '--range-value': percent + '%' }">
      <div class="bar"></div>
      <div class="circle"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useDragMove, type DragPosType } from "@/utils/useDragMove";
  import { debounce } from "lodash-es";
  import { computed, onBeforeMount, onBeforeUnmount, onMounted, ref, useTemplateRef, watch } from "vue";

  const sliderRef = useTemplateRef("sliderRef");
  const emit = defineEmits(["update:time", "update:is-play", "changeTime", "play", "pause"]);

  const props = withDefaults(defineProps<{ isPlay: boolean; total: number }>(), {
    total: 10
  });
  const thePlay = computed({
    get: () => props.isPlay,
    set: (v) => {
      emit("update:is-play", v);
      if (v) {
        emit("play");
      } else {
        emit("pause");
      }
    }
  });
  const theTime = defineModel<number>();
  theTime.value = 0;
  //   const theTime = computed({
  //     get: () => props.time,
  //     set: (v) => {
  //       emit("update:time", v);
  //       emit("changeTime", v);
  //     }
  //   });

  const percent = ref("0");

  let width = 100;
  const onMove = (ev: DragPosType) => {
    let v = ev.endx / width;
    if (v < 0) v = 0;
    else if (v > 1) v = 1;
    theTime.value = Math.round(v * props.total);
    percent.value = (100 * v).toFixed(2);
  };
  const move = useDragMove({
    isBody: true,
    move1: onMove,
    end1: onMove
  });
  watch(
    () => theTime.value,
    (v) => {
      percent.value = ((100 * v!) / props.total).toFixed(2);
    }
  );
  onMounted(() => {
    move.init(sliderRef.value!);
    width = sliderRef.value!.offsetWidth;
  });
  onBeforeUnmount(() => {
    move.destroy();
  });
</script>

<style lang="scss" scoped>
  .play-bar {
    width: 600px;
    position: fixed;
    bottom: 20px;
    left: calc(50% - 300px);
    height: 60px;
    background: var(--boxbg-color);
    backdrop-filter: var(--boxbg-blur);
    border-radius: 30px;
    display: flex;
    align-items: center;
    padding: 0 20px;
    gap: 10px;
    box-shadow: 2px 2px 16px 0px rgba(0, 0, 0, 0.2008);
    i.iconfont {
      color: white;
      background-color: var(--default-color);
      height: 40px;
      width: 40px;
      font-size: 24px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      cursor: pointer;
      box-shadow: 0 0 8px rgba(0, 0, 0, 0.2008);
    }
    .play-slider {
      width: calc(100% - 50px);
      margin: 0px;
      padding: 0px;
      height: 10px;
      --range-value: 0%;
      display: inline-flex;
      flex-direction: column;
      cursor: pointer;
      .bar {
        flex: none;
        background: linear-gradient(
          to right,
          var(--default-color) 0%,
          var(--default-color) var(--range-value, 0%),
          #ddd var(--range-value, 0%)
        );
        border-radius: 3px;
        height: 6px;
        pointer-events: none;
      }
      .circle {
        flex: none;
        // appearance: none;
        border-radius: 50%;
        height: 20px;
        width: 20px;

        position: relative;
        background-color: var(--default-color);
        color: var(--default-color);
        box-shadow: 0 0 8px rgba(0, 0, 0, 0.5);
        top: -13px;
        left: var(--range-value);
        pointer-events: none;
      }
    }
  }
</style>
