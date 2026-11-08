export const createFrameCanvas = (canvas, frames) => {
  const ctx = canvas.getContext('2d', { alpha: false });
  let target = 0;
  let drawn = null;
  let raf = 0;

  const draw = () => {
    raf = 0;
    const img = frames.nearest(target);
    if (!img || img === drawn) return;

    const { width: cw, height: ch } = canvas;
    const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
    const w = img.naturalWidth * scale;
    const h = img.naturalHeight * scale;
    ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
    drawn = img;
  };

  const request = () => {
    if (!raf) raf = requestAnimationFrame(draw);
  };

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio, 2);
    canvas.width = Math.round(canvas.clientWidth * dpr);
    canvas.height = Math.round(canvas.clientHeight * dpr);
    ctx.imageSmoothingQuality = 'high';
    drawn = null;
    request();
  };

  const setFrame = (i) => {
    if (i === target) return;
    target = i;
    request();
  };

  const onFrameLoaded = (i) => {
    if (Math.abs(i - target) <= 8) request();
  };

  resize();
  window.addEventListener('resize', resize);

  return { setFrame, onFrameLoaded, refresh: request };
};
