// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Tech Background Animation
class TechBackground {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.lines = [];
        this.circuitLines = [];
        this.nodes = [];
        
        this.resize();
        this.init();
        this.animate();
        
        window.addEventListener('resize', () => this.resize());
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    init() {
        // Create floating particles
        const particleCount = Math.floor((this.canvas.width * this.canvas.height) / 15000);
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 2 + 1,
                speedX: (Math.random() - 0.5) * 0.3,
                speedY: (Math.random() - 0.5) * 0.3,
                opacity: Math.random() * 0.5 + 0.2
            });
        }
        
        // Create circuit-like lines
        const lineCount = 8;
        for (let i = 0; i < lineCount; i++) {
            const startX = this.canvas.width * 0.6 + Math.random() * this.canvas.width * 0.4;
            const startY = Math.random() * this.canvas.height;
            
            this.circuitLines.push({
                points: this.generateCircuitPath(startX, startY),
                progress: Math.random(),
                speed: 0.002 + Math.random() * 0.003,
                opacity: 0.3 + Math.random() * 0.4
            });
        }
        
        // Create nodes
        const nodeCount = 15;
        for (let i = 0; i < nodeCount; i++) {
            this.nodes.push({
                x: this.canvas.width * 0.5 + Math.random() * this.canvas.width * 0.5,
                y: Math.random() * this.canvas.height,
                radius: 3 + Math.random() * 4,
                pulsePhase: Math.random() * Math.PI * 2,
                pulseSpeed: 0.02 + Math.random() * 0.03
            });
        }
    }
    
    generateCircuitPath(startX, startY) {
        const points = [{x: startX, y: startY}];
        let currentX = startX;
        let currentY = startY;
        const segments = 5 + Math.floor(Math.random() * 8);
        
        for (let i = 0; i < segments; i++) {
            const direction = Math.random() > 0.5 ? 'horizontal' : 'vertical';
            const length = 50 + Math.random() * 150;
            
            if (direction === 'horizontal') {
                currentX += (Math.random() > 0.5 ? 1 : -1) * length;
            } else {
                currentY += (Math.random() > 0.5 ? 1 : -1) * length;
            }
            
            // Keep within bounds
            currentX = Math.max(0, Math.min(this.canvas.width, currentX));
            currentY = Math.max(0, Math.min(this.canvas.height, currentY));
            
            points.push({x: currentX, y: currentY});
        }
        
        return points;
    }
    
    drawCircuitLines() {
        this.circuitLines.forEach(line => {
            const gradient = this.ctx.createLinearGradient(
                line.points[0].x, 
                line.points[0].y, 
                line.points[line.points.length - 1].x, 
                line.points[line.points.length - 1].y
            );
            gradient.addColorStop(0, `rgba(0, 217, 255, 0)`);
            gradient.addColorStop(0.5, `rgba(0, 217, 255, ${line.opacity})`);
            gradient.addColorStop(1, `rgba(0, 217, 255, 0)`);
            
            this.ctx.strokeStyle = gradient;
            this.ctx.lineWidth = 2;
            this.ctx.lineCap = 'round';
            this.ctx.beginPath();
            
            for (let i = 0; i < line.points.length - 1; i++) {
                const p1 = line.points[i];
                const p2 = line.points[i + 1];
                
                this.ctx.moveTo(p1.x, p1.y);
                this.ctx.lineTo(p2.x, p2.y);
            }
            
            this.ctx.stroke();
            
            // Draw animated pulse
            const totalPoints = line.points.length;
            const currentPoint = Math.floor(line.progress * totalPoints);
            
            if (currentPoint < totalPoints - 1) {
                const p1 = line.points[currentPoint];
                const p2 = line.points[currentPoint + 1];
                const t = (line.progress * totalPoints) - currentPoint;
                
                const pulseX = p1.x + (p2.x - p1.x) * t;
                const pulseY = p1.y + (p2.y - p1.y) * t;
                
                const pulseGradient = this.ctx.createRadialGradient(pulseX, pulseY, 0, pulseX, pulseY, 15);
                pulseGradient.addColorStop(0, 'rgba(0, 217, 255, 0.8)');
                pulseGradient.addColorStop(1, 'rgba(0, 217, 255, 0)');
                
                this.ctx.fillStyle = pulseGradient;
                this.ctx.beginPath();
                this.ctx.arc(pulseX, pulseY, 15, 0, Math.PI * 2);
                this.ctx.fill();
            }
            
            line.progress += line.speed;
            if (line.progress > 1) line.progress = 0;
        });
    }
    
    drawNodes() {
        this.nodes.forEach(node => {
            const pulse = Math.sin(node.pulsePhase) * 0.3 + 0.7;
            
            const gradient = this.ctx.createRadialGradient(
                node.x, node.y, 0,
                node.x, node.y, node.radius * pulse
            );
            gradient.addColorStop(0, 'rgba(0, 217, 255, 0.9)');
            gradient.addColorStop(0.5, 'rgba(0, 217, 255, 0.4)');
            gradient.addColorStop(1, 'rgba(0, 217, 255, 0)');
            
            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, node.radius * pulse, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Inner core
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, node.radius * 0.3, 0, Math.PI * 2);
            this.ctx.fill();
            
            node.pulsePhase += node.pulseSpeed;
        });
    }
    
    drawParticles() {
        this.particles.forEach(particle => {
            this.ctx.fillStyle = `rgba(0, 217, 255, ${particle.opacity})`;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Update position
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            // Wrap around screen
            if (particle.x < 0) particle.x = this.canvas.width;
            if (particle.x > this.canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = this.canvas.height;
            if (particle.y > this.canvas.height) particle.y = 0;
        });
    }
    
    connectParticles() {
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 150) {
                    const opacity = (1 - distance / 150) * 0.15;
                    this.ctx.strokeStyle = `rgba(0, 217, 255, ${opacity})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
        }
    }
    
    animate() {
        // Create fade effect
        this.ctx.fillStyle = 'rgba(10, 14, 26, 0.1)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.drawCircuitLines();
        this.drawNodes();
        this.drawParticles();
        this.connectParticles();
        
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize tech background
document.addEventListener('DOMContentLoaded', () => {
    new TechBackground('techCanvas');
});

// Navbar scroll effect
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.background = 'rgba(10, 14, 26, 0.95)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 217, 255, 0.1)';
    } else {
        navbar.style.background = 'rgba(10, 14, 26, 0.9)';
        navbar.style.boxShadow = 'none';
    }
    
    lastScroll = currentScroll;
});
