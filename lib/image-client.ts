export function isDataUrl(value: string | null | undefined): value is string {
  return Boolean(value?.startsWith("data:"));
}

export function isPublicAsset(value: string | null | undefined): value is string {
  return Boolean(value?.startsWith("/") && !value.startsWith("//"));
}

export async function blobFromDataUrl(dataUrl: string) {
  const response = await fetch(dataUrl);
  return response.blob();
}

export function fileFromBlob(blob: Blob, name: string) {
  const ext = blob.type.includes("png")
    ? "png"
    : blob.type.includes("webp")
      ? "webp"
      : "jpg";
  return new File([blob], `${name}.${ext}`, { type: blob.type || "image/jpeg" });
}

export function loadHtmlImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.decoding = "async";
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("No se pudo leer la imagen"));
    image.src = src;
  });
}

export async function compressImageSrc(
  src: string,
  maxEdge = 1600,
  quality = 0.82,
): Promise<{ url: string; width: number; height: number }> {
  const image = await loadHtmlImage(src);
  const scale = Math.min(1, maxEdge / Math.max(image.naturalWidth, image.naturalHeight));
  const width = Math.max(1, Math.round(image.naturalWidth * scale));
  const height = Math.max(1, Math.round(image.naturalHeight * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return { url: src, width: image.naturalWidth, height: image.naturalHeight };
  ctx.drawImage(image, 0, 0, width, height);
  const url = canvas.toDataURL("image/webp", quality);
  return {
    url: url.startsWith("data:image/webp") ? url : canvas.toDataURL("image/jpeg", quality),
    width,
    height,
  };
}
