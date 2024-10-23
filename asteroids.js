class Spaceship {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.position = {
            x: canvas.width / 2,
            y: canvas.height / 2
        };
        this.velocity = { x: 0, y: 0 };
        this.rotation = 0;
        this.size = 20;
        this.thrust = 0.1;
        this.turnSpeed = 0.1;
        this.targetRotation = Math.random() * Math.PI * 2;
        this.lastShot = 0;
        this.shootDelay = 1000;
    }

    draw() {
        this.ctx.save();
        this.ctx.translate(this.position.x, this.position.y);
        this.ctx.rotate(this.rotation);
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        this.ctx.beginPath();
        this.ctx.moveTo(this.size, 0);
        this.ctx.lineTo(-this.size, -this.size/2);
        this.ctx.lineTo(-this.size/2, 0);
        this.ctx.lineTo(-this.size, this.size/2);
        this.ctx.lineTo(this.size, 0);
        this.ctx.stroke();
        this.ctx.restore();
    }

    update() {
        if (Math.random() < 0.02) {
            this.targetRotation = Math.random() * Math.PI * 2;
        }

        const rotationDiff = this.targetRotation - this.rotation;
        this.rotation += Math.sign(rotationDiff) * this.turnSpeed;

        this.velocity.x += Math.cos(this.rotation) * this.thrust;
        this.velocity.y += Math.sin(this.rotation) * this.thrust;

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        if (this.position.x < 0) this.position.x = this.canvas.width;
        if (this.position.x > this.canvas.width) this.position.x = 0;
        if (this.position.y < 0) this.position.y = this.canvas.height;
        if (this.position.y > this.canvas.height) this.position.y = 0;

        this.velocity.x *= 0.99;
        this.velocity.y *= 0.99;
    }

    shoot() {
        const now = Date.now();
        if (now - this.lastShot > this.shootDelay) {
            this.lastShot = now;
            return new Bullet(this.canvas, this.position.x, this.position.y, this.rotation);
        }
        return null;
    }
}

class Bullet {
    constructor(canvas, x, y, angle) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.position = { x, y };
        this.velocity = {
            x: Math.cos(angle) * 7,
            y: Math.sin(angle) * 7
        };
        this.lifetime = 2000;
        this.born = Date.now();
    }

    update() {
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        return Date.now() - this.born < this.lifetime;
    }

    draw() {
        this.ctx.beginPath();
        this.ctx.arc(this.position.x, this.position.y, 2, 0, Math.PI * 2);
        this.ctx.fillStyle = 'white';
        this.ctx.fill();
    }
}


class Asteroid {
    constructor(canvas, x, y, radius) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.position = {
            x: x || Math.random() * canvas.width,
            y: y || Math.random() * canvas.height
        };
        const speedFactor = canvas.width / 1000;
        this.velocity = {
            x: (Math.random() - 0.5) * 2 * speedFactor,
            y: (Math.random() - 0.5) * 2 * speedFactor
        };
        this.radius = radius || canvas.width * 0.02;
        this.points = this.generatePoints();
        this.mass = this.radius * this.radius;
    }

    generatePoints() {
        const points = [];
        const vertices = Math.floor(Math.random() * 5) + 7;
        for (let i = 0; i < vertices; i++) {
            const angle = (i / vertices) * Math.PI * 2;
            const distance = this.radius + (Math.random() * 10 - 5);
            points.push({
                x: Math.cos(angle) * distance,
                y: Math.sin(angle) * distance
            });
        }
        return points;
    }

    update() {
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        if (this.position.x < 0) this.position.x = this.canvas.width;
        if (this.position.x > this.canvas.width) this.position.x = 0;
        if (this.position.y < 0) this.position.y = this.canvas.height;
        if (this.position.y > this.canvas.height) this.position.y = 0;
    }

    draw() {
        this.ctx.beginPath();
        this.ctx.moveTo(
            this.position.x + this.points[0].x,
            this.position.y + this.points[0].y
        );
        
        for (let i = 1; i < this.points.length; i++) {
            this.ctx.lineTo(
                this.position.x + this.points[i].x,
                this.position.y + this.points[i].y
            );
        }
        
        this.ctx.closePath();
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        this.ctx.stroke();
    }

    checkCollision(other) {
        const dx = this.position.x - other.position.x;
        const dy = this.position.y - other.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < (this.radius + other.radius);
    }

    resolveCollision(other) {
        const dx = other.position.x - this.position.x;
        const dy = other.position.y - this.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        const nx = dx / distance;
        const ny = dy / distance;
        
        const relativeVelocityX = this.velocity.x - other.velocity.x;
        const relativeVelocityY = this.velocity.y - other.velocity.y;
        const relativeVelocity = relativeVelocityX * nx + relativeVelocityY * ny;
        
        const impulse = 2 * relativeVelocity / (this.mass + other.mass);
        
        this.velocity.x -= impulse * other.mass * nx;
        this.velocity.y -= impulse * other.mass * ny;
        other.velocity.x += impulse * this.mass * nx;
        other.velocity.y += impulse * this.mass * ny;
        
        return true;
    }

    split() {
        if (this.radius < 15) return null;
        
        const newRadius = this.radius * 0.6;
        const newAsteroids = [
            new Asteroid(this.canvas, this.position.x, this.position.y, newRadius),
            new Asteroid(this.canvas, this.position.x, this.position.y, newRadius)
        ];
        
        newAsteroids.forEach(ast => {
            ast.velocity = {
                x: this.velocity.x + (Math.random() - 0.5) * 2,
                y: this.velocity.y + (Math.random() - 0.5) * 2
            };
        });
        
        return newAsteroids;
    }
}
function initAsteroids() {
    const canvas = document.getElementById('asteroidsCanvas');
    const ctx = canvas.getContext('2d');
    
    // Enable crisp rendering
    ctx.imageSmoothingEnabled = false;
    
    function resizeCanvas() {
        const dpr = window.devicePixelRatio || 1;
        
        // Full viewport height without any margins
        const height = document.documentElement.clientHeight;
        // Calculate width based on aspect ratio while maintaining height
        const width = Math.min(document.documentElement.clientWidth, height * (16/9));
        
        // Set canvas size in pixels
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        
        // Set display size
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        
        // Scale context to match device pixel ratio
        ctx.scale(dpr, dpr);
        ctx.imageSmoothingEnabled = false;
    }
    
    // Add CSS to center the canvas
    canvas.style.display = 'block';
    canvas.style.margin = 'auto';
    canvas.style.position = 'absolute';
    canvas.style.top = '50%';
    canvas.style.left = '50%';
    canvas.style.transform = 'translate(-50%, -50%)';
    
    // Initial resize
    resizeCanvas();
    
    // Replace existing resize listener
    window.addEventListener('resize', resizeCanvas);
    
    let asteroids = Array(10).fill().map(() => new Asteroid(canvas));
    const spaceship = new Spaceship(canvas);
    let bullets = [];

    function checkCollisions() {
        for (let i = 0; i < asteroids.length; i++) {
            for (let j = i + 1; j < asteroids.length; j++) {
                if (asteroids[i].checkCollision(asteroids[j])) {
                    if (asteroids[i].resolveCollision(asteroids[j])) {
                        const splits = [];
                        const split1 = asteroids[i].split();
                        const split2 = asteroids[j].split();
                        
                        if (split1) splits.push(...split1);
                        if (split2) splits.push(...split2);
                        
                        if (splits.length > 0) {
                            asteroids = asteroids.filter((a, idx) => idx !== i && idx !== j);
                            asteroids.push(...splits);
                            return;
                        }
                    }
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Update and draw spaceship
        spaceship.update();
        spaceship.draw();
        
        // Random shooting
        if (Math.random() < 0.05) {
            const bullet = spaceship.shoot();
            if (bullet) bullets.push(bullet);
        }
        
        // Update and draw bullets
        bullets = bullets.filter(bullet => {
            bullet.draw();
            return bullet.update();
        });
        
        // Update and draw asteroids
        checkCollisions();
        asteroids.forEach(asteroid => {
            asteroid.update();
            asteroid.draw();
        });
        
        requestAnimationFrame(animate);
    }

    animate();
}
document.addEventListener('DOMContentLoaded', initAsteroids);