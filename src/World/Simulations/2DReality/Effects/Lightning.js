const Lightning = (canvasId) => {
  let boltFadeDuration,
    boltFlashDuration,
    bolts,
    canvas,
    context,
    flashOpacity,
    fps,
    height,
    lastFrame,
    launchBolt,
    recursiveLaunchBolt,
    scale,
    setCanvasSize,
    tick,
    totalBoltDuration,
    width;

  canvas = document.getElementById(canvasId);

  context = canvas.getContext("2d");

  width = 0.0;

  height = 0.0;

  scale = 1.0;

  fps = 45.0;

  lastFrame = new Date().getTime();

  flashOpacity = 0.0;

  boltFlashDuration = 0.25;

  boltFadeDuration = 0.5;

  totalBoltDuration = boltFlashDuration + boltFadeDuration;

  bolts = [];

  setCanvasSize = function () {
    let bolt, _i, _len;
    canvas.setAttribute("width", window.innerWidth);
    canvas.setAttribute("height", window.innerHeight);
    for (_i = 0, _len = bolts.length; _i < _len; _i++) {
      bolt = bolts[_i];
      bolt.canvas.width = window.innerWidth;
      bolt.canvas.height = window.innerHeight;
    }
    width = Math.ceil(window.innerWidth / scale);
    return (height = Math.ceil(window.innerHeight / scale));
  };

  launchBolt = function (x, y, length, direction) {
    let boltCanvas, boltContext;
    flashOpacity = 0.15 + Math.random() * 0.2;
    boltCanvas = document.createElement("canvas");
    boltCanvas.width = window.innerWidth;
    boltCanvas.height = window.innerHeight;
    boltContext = boltCanvas.getContext("2d");
    boltContext.scale(scale, scale);
    bolts.push({
      canvas: boltCanvas,
      duration: 0.0,
    });
    return recursiveLaunchBolt(x, y, length, direction, boltContext);
  };

  recursiveLaunchBolt = function (x, y, length, direction, boltContext) {
    let boltInterval, originalDirection;
    originalDirection = direction;
    return (boltInterval = setInterval(function () {
      let alpha, i, x1, y1;
      if (length <= 0) {
        clearInterval(boltInterval);
        return;
      }
      i = 0;
      while (i++ < Math.floor(45 / scale) && length > 0) {
        x1 = Math.floor(x);
        y1 = Math.floor(y);
        x += Math.cos(direction);
        y -= Math.sin(direction);
        length--;
        if (x1 !== Math.floor(x) || y1 !== Math.floor(y)) {
          alpha = Math.min(1.0, length / 350.0);
          boltContext.fillStyle = "rgba(255, 255, 255, " + alpha + ")";
          boltContext.fillRect(x1, y1, 1.0, 1.0);
          direction =
            originalDirection +
            (-Math.PI / 8.0 + Math.random() * (Math.PI / 4.0));
          if (Math.random() > 0.98) {
            recursiveLaunchBolt(
              x1,
              y1,
              length * (0.3 + Math.random() * 0.4),
              originalDirection +
                (-Math.PI / 6.0 + Math.random() * (Math.PI / 3.0)),
              boltContext
            );
          } else if (Math.random() > 0.95) {
            recursiveLaunchBolt(
              x1,
              y1,
              length,
              originalDirection +
                (-Math.PI / 6.0 + Math.random() * (Math.PI / 3.0)),
              boltContext
            );
            length = 0;
          }
        }
      }
      return void 0;
    }, 10));
  };

  tick = function () {
    let bolt, elapsed, frame, i, length, x, y, _i, _len;
    frame = new Date().getTime();
    elapsed = (frame - lastFrame) / 1000.0;
    lastFrame = frame;
    context.clearRect(0.0, 0.0, window.innerWidth, window.innerHeight);
    if (Math.random() > 0.98) {
      x = Math.floor(-10.0 + Math.random() * (width + 20.0));
      y = Math.floor(5.0 + Math.random() * (height / 3.0));
      length = Math.floor(height / 2.0 + Math.random() * (height / 3.0));
      launchBolt(x, y, length, (Math.PI * 3.0) / 2.0);
    }
    if (flashOpacity > 0.0) {
      context.fillStyle = "rgba(255, 255, 255, " + flashOpacity + ")";
      context.fillRect(0.0, 0.0, window.innerWidth, window.innerHeight);
      flashOpacity = Math.max(0.0, flashOpacity - 2.0 * elapsed);
    }
    for (i = _i = 0, _len = bolts.length; _i < _len; i = ++_i) {
      bolt = bolts[i];
      bolt.duration += elapsed;
      if (bolt.duration >= totalBoltDuration) {
        bolts.splice(i, 1);
        i--;
        return;
      }
      context.globalAlpha = Math.max(
        0.0,
        Math.min(1.0, (totalBoltDuration - bolt.duration) / boltFadeDuration)
      );
      context.drawImage(bolt.canvas, 0.0, 0.0);
    }
    return void 0;
  };

  window.addEventListener("resize", setCanvasSize);

  setCanvasSize();

  setInterval(tick, 1000.0 / fps);
};

export default Lightning;
