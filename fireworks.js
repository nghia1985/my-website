(function() {
  let canvas, ctx;
  let fireworks = [];
  let animationFrameId;
  let isRunning = false;

  // Lớp pháo hoa
  class Firework {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.particles = [];
      this.createParticles();
    }

    createParticles() {
      const count = 30; // số hạt pháo hoa
      for (let i = 0; i < count; i++) {
        this.particles.push({
          x: this.x,
          y: this.y,
          vx: (Math.random() - 0.5) * 5,
          vy: (Math.random() - 0.5) * 5,
          alpha: 1,
          size: Math.random() * 3 + 1,
          color: `hsl(${Math.random() * 360}, 100%, 50%)`
        });
      }
    }

    update() {
      this.particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.05; // trọng lực
        p.alpha -= 0.02;
        if (p.alpha < 0) p.alpha = 0;
      });
      this.particles = this.particles.filter(p => p.alpha > 0);
    }

    draw(ctx) {
      this.particles.forEach(p => {
        ctx.fillStyle = `rgba(${hexToRgb(p.color)},${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    isDone() {
      return this.particles.length === 0;
    }
  }

  // Chuyển màu HSL sang RGB (dùng canvas ẩn)
  function hexToRgb(hsl) {
    const cvs = document.createElement('canvas');
    const ctx = cvs.getContext('2d');
    ctx.fillStyle = hsl;
    return ctx.fillStyle.match(/\d+/g).slice(0,3).join(',');
  }

  // Tạo canvas hiệu ứng pháo hoa
  function createCanvas() {
    canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = 0;
    canvas.style.left = 0;
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none'; // không chắn chuột
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);
    ctx = canvas.getContext('2d');
  }

  // Cập nhật kích thước canvas khi resize
  function resizeCanvas() {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  // Tạo 1 pháo hoa ngẫu nhiên
  function launchFirework() {
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight * 0.5;
    fireworks.push(new Firework(x, y));
  }

  // Vòng lặp vẽ và cập nhật pháo hoa
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    fireworks.forEach(fw => {
      fw.update();
      fw.draw(ctx);
    });

    fireworks = fireworks.filter(fw => !fw.isDone());

    if (isRunning) {
      if (Math.random() < 0.05) {
        launchFirework();
      }
      animationFrameId = requestAnimationFrame(animate);
    }
  }

  // Hàm bật hiệu ứng pháo hoa
  window.startFireworks = function() {
    if (isRunning) return;
    if (!canvas) {
      createCanvas();
      window.addEventListener('resize', resizeCanvas);
    }
    isRunning = true;
    animate();
  };

  // Hàm tắt hiệu ứng pháo hoa
  window.stopFireworks = function() {
    isRunning = false;
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
    if (canvas) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };
})();
