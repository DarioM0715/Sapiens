import { useEffect, useState } from "react";

const loadImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("No se pudo cargar la imagen"));
    image.src = url;
  });

const measureLuminance = (image: HTMLImageElement) => {
  const size = 32;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;

  const context = canvas.getContext("2d");
  if (!context) return 0;

  context.drawImage(image, 0, 0, size, size);
  const { data } = context.getImageData(0, 0, size, size);

  let total = 0;
  let weight = 0;
  for (let i = 0; i < data.length; i += 4) {
    const alpha = data[i + 3] / 255;
    const luminance = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    total += luminance * alpha;
    weight += alpha;
  }

  return weight ? total / weight : 0;
};

/**
 * Devuelve true si la imagen de fondo es clara (luminancia media > 140),
 * para poder usar texto oscuro encima. Por defecto asume fondo oscuro.
 */
export const useImageContrast = (url?: string) => {
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    if (!url) {
      setIsLight(false);
      return;
    }

    let active = true;
    loadImage(url)
      .then((image) => {
        if (!active) return;
        try {
          setIsLight(measureLuminance(image) > 140);
        } catch {
          setIsLight(false);
        }
      })
      .catch(() => {
        if (active) setIsLight(false);
      });

    return () => {
      active = false;
    };
  }, [url]);

  return isLight;
};
