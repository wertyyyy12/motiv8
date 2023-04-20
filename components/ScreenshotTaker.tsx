import { useRef } from "react";

export default function ScreenshotTaker({
  onScreenshotTaken,
}: {
  onScreenshotTaken: (dataURL: string) => Promise<void>;
}) {
  const canvas = useRef<HTMLCanvasElement>();
  const player = useRef<HTMLVideoElement>();

  navigator.mediaDevices
    .getUserMedia({
      video: {
        facingMode: "environment",
      },
    })
    .then((stream) => {
      player.current.srcObject = stream;
    });
  return (
    <>
      <video controls autoPlay ref={player} />
      <button
        onClick={() => {
          // const canvas = document.getElementById('canvas');
          const context = canvas.current.getContext("2d");
          context.drawImage(
            player.current,
            0,
            0,
            canvas.current.width,
            canvas.current.height
          );
          onScreenshotTaken(canvas.current.toDataURL());
        }}
      >
        Capture
      </button>
      <canvas width="320" height="240" ref={canvas}></canvas>
    </>
  );
}
