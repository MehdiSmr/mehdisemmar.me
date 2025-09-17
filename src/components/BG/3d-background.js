/**
 * 3D Holographic Background
 * A subtle, interactive 3D background with wireframe geometric objects
 * Perfect for terminal/tech-themed portfolio websites
 */

class HolographicBackground {
    constructor() {
        // Check for reduced motion preference
        this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (this.prefersReducedMotion) return;

        // Animation and interaction properties
        this.isHovering = false;
        this.baseRotationSpeed = 0.002;
        this.hoverRotationSpeed = 0.008;
        this.currentRotationSpeed = this.baseRotationSpeed;
        this.targetRotationSpeed = this.baseRotationSpeed;
        
        // Color properties
        this.baseColor = new THREE.Color(0x40e0d0); // Terminal cyan
        this.hoverColor = new THREE.Color(0x00ff88); // Terminal green
        this.currentColor = this.baseColor.clone();
        this.targetColor = this.baseColor.clone();

        // Initialize the scene
        this.init();
        this.createObjects();
        this.setupEventListeners();
        this.animate();
    }

    init() {
        // Get canvas element
        this.canvas = document.getElementById('three-canvas');
        if (!this.canvas) {
            console.error('Canvas element #three-canvas not found');
            return;
        }

        // Scene setup
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.Fog(0x0a0f14, 10, 50);

        // Camera setup
        this.camera = new THREE.PerspectiveCamera(
            75, 
            window.innerWidth / window.innerHeight, 
            0.1, 
            1000
        );
        this.camera.position.z = 15;

        // Renderer setup
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            alpha: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x0a0f14, 0.1);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Lighting setup
        const ambientLight = new THREE.AmbientLight(0x40e0d0, 0.3);
        this.scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0x00ff88, 1, 100);
        pointLight.position.set(10, 10, 10);
        this.scene.add(pointLight);
    }

    createObjects() {
        // Create main group for all objects
        this.objectGroup = new THREE.Group();
        this.scene.add(this.objectGroup);

        // Create wireframe dodecahedron (main object)
        this.createMainObject();
        
        // Create orbiting particles
        this.createOrbitingParticles();
        
        // Create background grid
        this.createBackgroundGrid();
    }

    createMainObject() {
        // Dodecahedron geometry for a complex, interesting shape
        const geometry = new THREE.DodecahedronGeometry(3, 1);
        
        // Wireframe material with holographic properties
        this.mainMaterial = new THREE.LineBasicMaterial({
            color: this.baseColor,
            transparent: true,
            opacity: 0.8,
            linewidth: 2
        });

        // Convert geometry to wireframe
        const wireframe = new THREE.WireframeGeometry(geometry);
        this.mainObject = new THREE.LineSegments(wireframe, this.mainMaterial);
        
        this.objectGroup.add(this.mainObject);

        // Add inner core (smaller, brighter)
        const coreGeometry = new THREE.IcosahedronGeometry(1.5, 0);
        this.coreMaterial = new THREE.LineBasicMaterial({
            color: this.hoverColor,
            transparent: true,
            opacity: 0.4,
            linewidth: 1
        });
        
        const coreWireframe = new THREE.WireframeGeometry(coreGeometry);
        this.coreObject = new THREE.LineSegments(coreWireframe, this.coreMaterial);
        this.objectGroup.add(this.coreObject);
    }

    createOrbitingParticles() {
        this.particles = [];
        const particleCount = 20;
        
        for (let i = 0; i < particleCount; i++) {
            const geometry = new THREE.SphereGeometry(0.02, 4, 4);
            const material = new THREE.MeshBasicMaterial({
                color: this.baseColor,
                transparent: true,
                opacity: 0.6
            });
            
            const particle = new THREE.Mesh(geometry, material);
            
            // Random orbital positions
            const radius = 5 + Math.random() * 3;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI;
            
            particle.position.set(
                radius * Math.sin(phi) * Math.cos(theta),
                radius * Math.sin(phi) * Math.sin(theta),
                radius * Math.cos(phi)
            );
            
            // Store orbital properties
            particle.userData = {
                radius: radius,
                theta: theta,
                phi: phi,
                speed: 0.001 + Math.random() * 0.002
            };
            
            this.particles.push(particle);
            this.objectGroup.add(particle);
        }
    }

    createBackgroundGrid() {
        // Create a subtle background grid
        const gridGeometry = new THREE.PlaneGeometry(50, 50, 20, 20);
        const gridMaterial = new THREE.LineBasicMaterial({
            color: 0x40e0d0,
            transparent: true,
            opacity: 0.05,
            linewidth: 1
        });
        
        const grid = new THREE.WireframeGeometry(gridGeometry);
        const gridMesh = new THREE.LineSegments(grid, gridMaterial);
        gridMesh.position.z = -20;
        this.scene.add(gridMesh);
    }

    setupEventListeners() {
        // Mouse hover events
        this.canvas.addEventListener('mouseenter', () => this.onMouseEnter());
        this.canvas.addEventListener('mouseleave', () => this.onMouseLeave());
        
        // Window resize
        window.addEventListener('resize', () => this.onWindowResize());
        
        // Reduced motion preference change
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        mediaQuery.addListener((e) => {
            this.prefersReducedMotion = e.matches;
            if (this.prefersReducedMotion) {
                this.stop();
            } else {
                this.animate();
            }
        });
    }

    onMouseEnter() {
        this.isHovering = true;
        this.targetRotationSpeed = this.hoverRotationSpeed;
        this.targetColor = this.hoverColor;
    }

    onMouseLeave() {
        this.isHovering = false;
        this.targetRotationSpeed = this.baseRotationSpeed;
        this.targetColor = this.baseColor;
    }

    onWindowResize() {
        // Update camera aspect ratio
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        
        // Update renderer size
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    updateAnimation() {
        if (!this.objectGroup) return;

        // Smooth rotation speed transition
        this.currentRotationSpeed += (this.targetRotationSpeed - this.currentRotationSpeed) * 0.1;
        
        // Smooth color transition
        this.currentColor.lerp(this.targetColor, 0.05);
        
        // Update material colors
        if (this.mainMaterial) {
            this.mainMaterial.color.copy(this.currentColor);
        }
        
        // Rotate main object
        this.objectGroup.rotation.y += this.currentRotationSpeed;
        this.objectGroup.rotation.x += this.currentRotationSpeed * 0.5;
        
        // Rotate core object independently
        if (this.coreObject) {
            this.coreObject.rotation.x += this.currentRotationSpeed * 1.5;
            this.coreObject.rotation.y -= this.currentRotationSpeed * 2;
        }
        
        // Update orbiting particles
        this.particles.forEach((particle, index) => {
            const userData = particle.userData;
            userData.theta += userData.speed;
            
            const radius = userData.radius;
            const theta = userData.theta;
            const phi = userData.phi + Math.sin(userData.theta * 2) * 0.1;
            
            particle.position.set(
                radius * Math.sin(phi) * Math.cos(theta),
                radius * Math.sin(phi) * Math.sin(theta),
                radius * Math.cos(phi)
            );
            
            // Update particle opacity based on hover state
            const targetOpacity = this.isHovering ? 0.8 : 0.6;
            particle.material.opacity += (targetOpacity - particle.material.opacity) * 0.1;
        });
        
        // Subtle pulsing effect
        const time = Date.now() * 0.001;
        const pulse = Math.sin(time * 2) * 0.1 + 0.9;
        this.objectGroup.scale.setScalar(pulse);
    }

    animate() {
        if (this.prefersReducedMotion) return;
        
        requestAnimationFrame(() => this.animate());
        
        this.updateAnimation();
        this.renderer.render(this.scene, this.camera);
    }

    stop() {
        // Method to stop animation if needed
        this.prefersReducedMotion = true;
    }

    // Public method to change colors dynamically
    setColors(baseColor, hoverColor) {
        this.baseColor = new THREE.Color(baseColor);
        this.hoverColor = new THREE.Color(hoverColor);
        this.targetColor = this.isHovering ? this.hoverColor : this.baseColor;
    }

    // Public method to adjust opacity
    setOpacity(opacity) {
        if (this.mainMaterial) this.mainMaterial.opacity = opacity;
        if (this.coreMaterial) this.coreMaterial.opacity = opacity * 0.5;
    }
}

// Initialize the holographic background when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.holographicBg = new HolographicBackground();
});

// Export for module usage if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HolographicBackground;
}