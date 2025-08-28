export function checkVideoPlay() {
  if (navigator?.mediaDevices?.getUserMedia) {
    navigator.mediaDevices
      .getUserMedia({audio: true, video: true})
      .then(() => {
        console.log("navigator.mediaDevices play");
        this.$refs.video.play();
      })
      .catch((err) => {
        console.log("getUserMedia Error:", err);
      });
  }
}
