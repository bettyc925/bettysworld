import { useRef, useEffect, useState } from 'react';

interface BackgroundProcessor {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  tempCanvas: HTMLCanvasElement;
  tempCtx: CanvasRenderingContext2D;
}

export type BackgroundMode = 'none' | 'blur' | 'image';

export class VideoBackgroundProcessor {
  private processor: BackgroundProcessor | null = null;
  private backgroundImage: HTMLImageElement | null = null;
  private mode: BackgroundMode = 'none';
  private blurAmount = 10;

  constructor() {
    this.setupProcessor();
  }

  private setupProcessor() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');

    if (!ctx || !tempCtx) {
      console.error('Could not create canvas contexts');
      return;
    }

    this.processor = {
      canvas,
      ctx,
      tempCanvas,
      tempCtx
    };
  }

  setBackgroundMode(mode: BackgroundMode) {
    this.mode = mode;
  }

  setBlurAmount(amount: number) {
    this.blurAmount = Math.max(1, Math.min(50, amount));
  }

  setBackgroundImage(imageUrl: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        this.backgroundImage = img;
        resolve();
      };
      img.onerror = reject;
      img.src = imageUrl;
    });
  }

  processFrame(video: HTMLVideoElement): HTMLCanvasElement | null {
    if (!this.processor || this.mode === 'none') {
      return null;
    }

    const { canvas, ctx, tempCanvas, tempCtx } = this.processor;
    const { videoWidth, videoHeight } = video;

    if (videoWidth === 0 || videoHeight === 0) return null;

    // Set canvas dimensions
    canvas.width = videoWidth;
    canvas.height = videoHeight;
    tempCanvas.width = videoWidth;
    tempCanvas.height = videoHeight;

    try {
      switch (this.mode) {
        case 'blur':
          return this.applyBlur(video, ctx, canvas);
        case 'image':
          return this.applyVirtualBackground(video, ctx, tempCtx, canvas, tempCanvas);
        default:
          return null;
      }
    } catch (error) {
      console.error('Error processing video frame:', error);
      return null;
    }
  }

  private applyBlur(video: HTMLVideoElement, ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement): HTMLCanvasElement {
    // Draw video frame
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Apply blur filter
    ctx.filter = `blur(${this.blurAmount}px)`;
    ctx.drawImage(canvas, 0, 0);
    ctx.filter = 'none';

    // Create a simple mask effect (center area less blurred)
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(canvas.width, canvas.height) * 0.3;

    // Create radial gradient for mask
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
    gradient.addColorStop(0, 'rgba(255,255,255,0.8)');
    gradient.addColorStop(1, 'rgba(255,255,255,0.1)');

    // Apply mask
    ctx.globalCompositeOperation = 'source-atop';
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = 'source-over';

    return canvas;
  }

  private applyVirtualBackground(
    video: HTMLVideoElement, 
    ctx: CanvasRenderingContext2D, 
    tempCtx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    tempCanvas: HTMLCanvasElement
  ): HTMLCanvasElement {
    // Draw background image
    if (this.backgroundImage) {
      ctx.drawImage(this.backgroundImage, 0, 0, canvas.width, canvas.height);
    } else {
      // Fallback to gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#667eea');
      gradient.addColorStop(1, '#764ba2');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Simple person detection (basic edge detection)
    tempCtx.drawImage(video, 0, 0, tempCanvas.width, tempCanvas.height);
    const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
    const data = imageData.data;

    // Create a simple mask based on movement/contrast
    const mask = new Uint8Array(data.length / 4);
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      // Simple skin tone detection and movement
      const brightness = (r + g + b) / 3;
      const skinTone = r > 95 && g > 40 && b > 20 && r > g && r > b;
      const isPersonPixel = skinTone || brightness > 100;
      
      mask[i / 4] = isPersonPixel ? 255 : 0;
    }

    // Apply smoothing to mask
    this.smoothMask(mask, tempCanvas.width, tempCanvas.height);

    // Composite the person over the background
    const personData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
    const bgData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < personData.data.length; i += 4) {
      const alpha = mask[i / 4] / 255;
      if (alpha > 0.5) {
        bgData.data[i] = personData.data[i];
        bgData.data[i + 1] = personData.data[i + 1];
        bgData.data[i + 2] = personData.data[i + 2];
      }
    }

    ctx.putImageData(bgData, 0, 0);
    return canvas;
  }

  private smoothMask(mask: Uint8Array, width: number, height: number) {
    const smoothed = new Uint8Array(mask);
    const radius = 2;

    for (let y = radius; y < height - radius; y++) {
      for (let x = radius; x < width - radius; x++) {
        let sum = 0;
        let count = 0;

        for (let dy = -radius; dy <= radius; dy++) {
          for (let dx = -radius; dx <= radius; dx++) {
            const idx = (y + dy) * width + (x + dx);
            sum += mask[idx];
            count++;
          }
        }

        smoothed[y * width + x] = sum / count;
      }
    }

    mask.set(smoothed);
  }

  dispose() {
    this.processor = null;
    this.backgroundImage = null;
  }
}

export const useVideoBackground = () => {
  const processorRef = useRef<VideoBackgroundProcessor | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    processorRef.current = new VideoBackgroundProcessor();
    return () => {
      processorRef.current?.dispose();
    };
  }, []);

  const setBackgroundMode = (mode: BackgroundMode) => {
    processorRef.current?.setBackgroundMode(mode);
    setIsProcessing(mode !== 'none');
  };

  const setBlurAmount = (amount: number) => {
    processorRef.current?.setBlurAmount(amount);
  };

  const setBackgroundImage = async (imageUrl: string) => {
    if (processorRef.current) {
      await processorRef.current.setBackgroundImage(imageUrl);
    }
  };

  const processFrame = (video: HTMLVideoElement) => {
    return processorRef.current?.processFrame(video) || null;
  };

  return {
    setBackgroundMode,
    setBlurAmount,
    setBackgroundImage,
    processFrame,
    isProcessing
  };
};