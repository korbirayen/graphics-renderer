const canvas = document.getElementById('physicsCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 512;
canvas.height = 512;

const particles = [];
const gravity = 0.1;
const maxParticles = 700;
const baseHue = Math.random() * 360;

let mouseX = 0;
let mouseY = 0;

canvas.addEventListener('mousemove', (e) => {
    mouseX = e.clientX - canvas.offsetLeft;
    mouseY = e.clientY - canvas.offsetTop;
});

class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 3 + 1;
        this.speedX = (Math.random() * 4 - 2) * 0.5;
        this.speedY = (Math.random() * 4 - 2) * 0.5;
        this.hue = baseHue + Math.random() * 20 - 10;
        this.color = `hsla(${this.hue}, 100%, 50%, 0.7)`;
        this.density = Math.random() * 15 + 1;
        this.velocityY = 0;
    }

    update() {
        this.velocityY += gravity;
        this.y += this.velocityY;
        this.x += this.speedX;

        // Swirling effect
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 50) {
            this.speedX += dy / 500;
            this.speedY -= dx / 500;
        }

        if (this.x < 0 || this.x > canvas.width) {
            this.speedX = -this.speedX;
        }
        if (this.y > canvas.height) {
            this.y = 0;
            this.x = mouseX + (Math.random() * 40 - 20);
            this.velocityY = 0;
            this.speedX = (Math.random() * 4 - 2) * 0.5;
        }
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
    }
}

function createFluid() {
    if (particles.length < maxParticles) {
        for (let i = 0; i < 2; i++) {
            particles.push(new Particle(mouseX + (Math.random() * 10 - 5), mouseY + (Math.random() * 10 - 5)));
        }
    }
}

function handleFluid() {
    createFluid();
    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });
}

function render() {
    // Subtle background
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, 'rgba(0,0,0,0.1)');
    gradient.addColorStop(1, 'rgba(0,0,0,0.2)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    handleFluid();
    requestAnimationFrame(render);
}

render();
