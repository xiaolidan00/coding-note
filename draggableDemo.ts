import {Sortable} from "@shopify/draggable";
let dragSort: Sortable;
const sortEnd = debounce(() => {
  const children = Array.from(videoRef.value!.children) as HTMLElement[];
  const obj: Record<string, number> = {};
  children.forEach((a, i) => {
    obj[a.title] = i;
  });
  videoList.value.sort((a, b) => (obj[a.name] || 0) - (obj[b.name] || 0));
}, 100);

//拖拽排序
if (dragSort) {
  dragSort.destroy();
}

dragSort = new Sortable(listRef.value!, {
  draggable: ".item-draggable",
  handle: ".icon-list1",
  mirror: {
    appendTo: ".video-list",
    constrainDimensions: true
  }
});
dragSort.on("sortable:sorted", sortEnd);
