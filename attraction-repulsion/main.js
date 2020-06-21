import Dot from './dot.js';
import F from './functions.js';
{
  const config = {
    radius: { min: 6, max: 20 },
    color: 'rgba(255, 193, 7, 0.9)',
    massFactor: 0.002,
    smooth: 0.15,
    sphereRad: 350,
    lifetime: { from: -1, to: -1, step: 1 },
    mouseDot: {
      radius: { min: 80, max: 80 },
      collisionRadius: 120,
      life: -1,
      color: 'rgba(255, 103, 7, 1)',
    },
  };

  const canvas = document.getElementById('main');
  const ctx = canvas.getContext('2d');

  const dots = [
    new Dot({
      position: { x: 0, y: 0 },
      ...config,
      ...config.mouseDot,
    }),
  ];

  const mouse = {
    x: 0,
    y: 0,
    isDown: false,
    dot: dots[0],
  };

  init();

  function init() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.addEventListener('mousemove', setMousePosition);
    document.addEventListener('mousedown', setMouseDown);
    document.addEventListener('mouseup', setMouseDown);

    dots.push(
      new Dot({
        position: { x: 100, y: 100 },
        ...config,
      })
    );
    dots.push(
      new Dot({
        position: { x: 120, y: 300 },
        ...config,
      })
    );

    dots.push(
      new Dot({
        position: { x: 520, y: 180 },
        ...config,
      })
    );

    loop();
  }

  function setMouseDown() {
    mouse.isDown = !mouse.isDown;
  }

  function setMousePosition({ clientX, clientY }) {
    [mouse.x, mouse.y] = [clientX, clientY];
  }

  function loop() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    console.log('loop');
    if (mouse.isDown) {
      dots.push(
        new Dot({
          position: { ...mouse },
          life: F.random(config.lifetime.from, config.lifetime.to),
          ...config,
        })
      );
    }
    updateDots();
    window.requestAnimationFrame(loop);
  }

  function updateDots() {
    for (let left = 0; left < dots.length; left++) {
      const currentDot = dots[left];
      if (currentDot.isDead()) {
        dots.splice(left, 1);
        continue;
      }
      const acceleration = { x: 0, y: 0 };
      // Рассчитываем ускорение для частицы на основе положения всех остальных частиц
      for (let right = 0; right < dots.length; right++) {
        if (left === right) continue;
        const nextDot = dots[right];

        const delta = {
          x: nextDot.position.x - currentDot.position.x,
          y: nextDot.position.y - currentDot.position.y,
        };
        const dist = Math.sqrt(delta.x * delta.x + delta.y * delta.y) || 1;
        let force = ((dist - config.sphereRad) / dist) * nextDot.mass;

        if (nextDot === mouse.dot) {
          dist < config.mouseDot.collisionRadius
            ? (force = (dist - config.mouseDot.collisionRadius) * nextDot.mass)
            : (force = currentDot.mass);
        }

        acceleration.x += delta.x * force;
        acceleration.y += delta.y * force;
      }

      currentDot.velocity.x =
        currentDot.velocity.x * config.smooth +
        acceleration.x * currentDot.mass;
      currentDot.velocity.y =
        currentDot.velocity.y * config.smooth +
        acceleration.y * currentDot.mass;

      if (currentDot === mouse.dot) {
        currentDot.position = mouse;
        currentDot.velocity = { x: 0, y: 0 };
      }
    }
    dots.forEach((dot) => {
      dot.wearOut(config.lifetime.step);
      dot.draw(ctx);
    });
  }
}
