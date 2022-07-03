export const resizeImage = async (original: string) => {
  const loaded: HTMLImageElement = await new Promise(
    (
      resolve: (value: HTMLImageElement | PromiseLike<HTMLImageElement>) => void
    ) => {
      const img: HTMLImageElement = new Image();
      img.src = original;
      img.onload = () => resolve(img);
    }
  );
  const canvas: HTMLCanvasElement = document.createElement("canvas");
  const MAX_WIDTH: number = 640;
  const IMG_WIDTH: number = loaded.naturalWidth;
  const IMG_HEIGHT: number = loaded.naturalHeight;
  const SCALING: number = MAX_WIDTH / IMG_WIDTH;
  canvas.width = MAX_WIDTH;
  canvas.height = IMG_HEIGHT * SCALING;
  const context: CanvasRenderingContext2D = canvas.getContext("2d")!;
  context.drawImage(loaded, 0, 0, canvas.width, canvas.height);
  const resized: string = context.canvas.toDataURL();
  const result: string = [original, resized].sort(
    (a: string, b: string) => a.length - b.length
  )[0];
  return result;
};
