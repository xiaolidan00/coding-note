 //拖入添加文件
  const onDragOver = (ev: DragEvent) => {
    ev.preventDefault();
  };
  const onDropFile = (ev: DragEvent) => {
    ev.preventDefault();
    let fileList: File[] = [];
    if (ev.dataTransfer?.items?.length) {
      const items = ev.dataTransfer.items;
      for (let i = 0; i < items.length; i++) {
        const item = items[i]!;
        if (item.type === 'file') {
          const f = item.getAsFile()!;
          if (f.name.endsWith('.mp4')) {
            fileList.push(f);
          }
        }
      }
    }
    if (fileList.length === 0 && ev.dataTransfer?.files?.length) {
      fileList = Array.from(ev.dataTransfer.files).filter((it) => it.name.endsWith('.mp4'));
    }
    if (fileList.length) {
      addVideo(fileList);
    }
  };

  onMounted(async () => {
   

    document.addEventListener('dragover', onDragOver);
    document.addEventListener('drop', onDropFile);
  });
  onBeforeUnmount(() => {
    
    document.removeEventListener('dragover', onDragOver);
    document.removeEventListener('drop', onDropFile);
  });