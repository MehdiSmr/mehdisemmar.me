<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const glitchText = ref('')
const fullText = 'MEHDI SEMMAR'
const showOptions = ref(false)

onMounted(() => {
  // Glitch typing effect for title
  let i = 0
  const typingInterval = setInterval(() => {
    if (i < fullText.length) {
      glitchText.value += fullText[i]
      i++
    } else {
      clearInterval(typingInterval)
      // Show options directly after title completes
      setTimeout(() => {
        showOptions.value = true
      }, 500)
    }
  }, 100)
})

const navigateTo = (path: string) => {
  router.push(path)
}
</script>

<template>
  <div class="landing-page">
    <!-- Animated background -->
    <div class="cyber-grid"></div>
    <div class="particles"></div>
    
    <!-- Main content -->
    <div class="landing-content">
      <div class="title-section">
        <h1 class="main-title">
          <span class="glitch" :data-text="glitchText">{{ glitchText }}</span>
          <span class="cursor">_</span>
        </h1>
        <p class="subtitle">
          SOFTWARE_ENGINEER | ML_AI_ENGINEER
        </p>
      </div>
      
      <transition name="fade-up">
        <div v-if="showOptions" class="options-container">
          <div class="option-card" @click="navigateTo('/lazy-portfolio')">
            <div class="card-inner">
              <div class="card-icon">
                <span class="icon-text">GUI</span>
              </div>
              <h2>VISUAL_EXPERIENCE</h2>
              <p class="card-description">
                Traditional scrollable portfolio with smooth navigation
              </p>
              <div class="card-footer">
                <span class="status">● MOUSE_ENABLED</span>
                <span class="arrow" id="arrow2">→</span>
              </div>
            </div>
            <div class="card-glow"></div>
          </div>
          
          <div class="option-card terminal-card" @click="navigateTo('/terminal-portfolio')">
            <div class="card-inner">
              <div class="card-icon">
                <span class="icon-text">&gt;_</span>
              </div>
              <h2>TERMINAL_EXPERIENCE</h2>
              <p class="card-description">
                Command-line interface with keyboard navigation
              </p>
              <div class="card-footer">
                <span class="status">● KEYBOARD_ONLY</span>
                <span class="arrow">→</span>
              </div>
            </div>
            <div class="card-glow"></div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<style scoped>
/* Enable cursor for landing page */
.landing-page {
  cursor: auto !important;
}

.landing-page * {
  cursor: auto !important;
  pointer-events: auto !important;
}

/* Clickable card cursor */
.option-card,
.option-card *,
.option-card .card-inner,
.option-card .card-inner *,
.option-card .card-icon,
.option-card h2,
.option-card .card-description,
.option-card .card-footer,
.option-card .card-footer *,
.option-card .status,
.option-card .arrow {
  cursor: pointer !important;
}

.landing-page {
  min-height: 100vh;
  background: 
    radial-gradient(ellipse at top, rgba(64, 224, 208, 0.15) 0%, transparent 50%),
    radial-gradient(ellipse at bottom left, rgba(0, 255, 136, 0.1) 0%, transparent 50%),
    radial-gradient(ellipse at bottom right, rgba(64, 224, 208, 0.08) 0%, transparent 50%),
    linear-gradient(135deg, #0a0f14 0%, #0f1419 25%, #141a20 50%, #0a0f14 100%);
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Cyber grid background */
.cyber-grid {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: 
    linear-gradient(rgba(64, 224, 208, 0.12) 1px, transparent 1px),
    linear-gradient(90deg, rgba(64, 224, 208, 0.12) 1px, transparent 1px),
    radial-gradient(circle at 25% 25%, rgba(0, 255, 136, 0.08) 0%, transparent 50%),
    radial-gradient(circle at 75% 75%, rgba(64, 224, 208, 0.06) 0%, transparent 50%);
  background-size: 50px 50px, 50px 50px, 400px 400px, 400px 400px;
  animation: grid-move 10s linear infinite;
  opacity: 0.8;
}

@keyframes grid-move {
  0% { transform: translate(0, 0); }
  100% { transform: translate(50px, 50px); }
}

/* Particles effect */
.particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.particles::before,
.particles::after {
  content: '';
  position: absolute;
  width: 2px;
  height: 2px;
  background: #40e0d0;
  box-shadow: 
    0 0 10px #40e0d0,
    100px 100px 0 #40e0d0,
    200px 200px 0 #40e0d0,
    300px 50px 0 #40e0d0,
    400px 300px 0 #40e0d0,
    500px 150px 0 #40e0d0,
    600px 250px 0 #40e0d0,
    700px 100px 0 #40e0d0,
    800px 350px 0 #40e0d0,
    900px 200px 0 #40e0d0;
  animation: float-particles 20s linear infinite;
}

@keyframes float-particles {
  0% { transform: translateY(0) translateX(0); }
  100% { transform: translateY(-100vh) translateX(-100px); }
}

/* Main content */
.landing-content {
  position: relative;
  z-index: 10;
  text-align: center;
  width: 100%;
  max-width: 1200px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 4rem);
}

.title-section {
  margin-bottom: 4rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  text-align: center;
}

.main-title {
  font-size: 5rem;
  font-weight: bold;
  margin: 0 auto;
  letter-spacing: 0.2em;
  color: #e0f7ff;
  position: relative;
  display: inline-block;
  text-align: center;
  width: 100%;
}

.glitch {
  position: relative;
  display: inline-block;
}

.glitch::before,
.glitch::after {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
}

.glitch::before {
  animation: glitch-1 0.5s infinite;
  color: #00ff88;
  z-index: -1;
}

.glitch::after {
  animation: glitch-2 0.5s infinite;
  color: #40e0d0;
  z-index: -2;
}

@keyframes glitch-1 {
  0%, 100% { opacity: 0; }
  33% { opacity: 1; transform: translateX(-2px); }
}

@keyframes glitch-2 {
  0%, 100% { opacity: 0; }
  66% { opacity: 1; transform: translateX(2px); }
}

.cursor {
  animation: blink 1s step-end infinite;
  color: #00ff88;
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

.subtitle {
  font-family: 'Courier New', monospace;
  font-size: 1.2rem;
  color: #40e0d0;
  letter-spacing: 0.3em;
  margin: 1rem auto 0 auto;
  opacity: 0.8;
  text-align: center;
  width: 100%;
}

.typing {
  overflow: hidden;
  white-space: nowrap;
  display: inline-block;
}

/* Options container */
.options-container {
  display: flex;
  gap: 6rem;
  align-items: center;
  justify-content: center;
  margin: 0 auto 3rem auto;
  flex-wrap: wrap;
  width: 100%;
  max-width: 1200px;
  padding: 0 3rem;
}

.option-card {
  position: relative;
  width: 300px;
  height: 350px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(0, 20, 25, 0.95), rgba(0, 35, 45, 0.85));
  border: 1px solid rgba(64, 224, 208, 0.3);
  border-radius: 12px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.card-glow {
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: linear-gradient(45deg, #40e0d0, #00ff88, #40e0d0);
  border-radius: 14px;
  opacity: 0;
  z-index: -1;
  transition: opacity 0.3s ease;
  filter: blur(10px);
}

.option-card:hover .card-glow {
  opacity: 0.3;
}

.option-card:hover .card-inner {
  transform: translateY(-5px);
  border-color: #40e0d0;
  box-shadow: 0 10px 30px rgba(64, 224, 208, 0.3);
}

.card-icon {
  font-size: 3rem;
  color: #00ff88;
  margin-bottom: 1.5rem;
  font-family: 'Courier New', monospace;
  font-weight: bold;
  text-shadow: 0 0 20px rgba(0, 255, 136, 0.5);
}

.terminal-card .card-icon {
  color: #40e0d0;
  text-shadow: 0 0 20px rgba(64, 224, 208, 0.5);
}

.option-card h2 {
  font-family: 'Courier New', monospace;
  font-size: 1.5rem;
  color: #e0f7ff;
  margin-bottom: 1rem;
  letter-spacing: 0.1em;
}

.card-description {
  color: #87ceeb;
  font-size: 0.9rem;
  line-height: 1.6;
  margin-bottom: 2rem;
  font-family: 'Arial', sans-serif;
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  font-family: 'Courier New', monospace;
  font-size: 0.8rem;
}

.status {
  color: #00ff88;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.terminal-card .status {
  color: #40e0d0;
}

.arrow {
  font-size: 1.5rem;
  color: #40e0d0;
  transition: transform 0.3s ease;
}

#arrow2 {
    color: #00ff88;
}

.option-card:hover .arrow {
  transform: translateX(5px);
}

/* Transitions */
.fade-up-enter-active {
  transition: all 0.8s ease;
}

.fade-up-enter-from {
  opacity: 0;
  transform: translateY(30px);
}

/* Responsive Design */
/* Extra small devices (phones, 320px to 480px) */
@media screen and (max-width: 480px) {
  .landing-page {
    padding: 0;
  }
  
  .landing-content {
    padding: 1rem;
    min-height: 100vh;
    justify-content: center;
    align-items: center;
  }
  
  .title-section {
    margin-bottom: 2.5rem;
    width: 100%;
    text-align: center;
  }
  
  .main-title {
    font-size: 2.2rem;
    letter-spacing: 0.1em;
    width: 100%;
  }
  
  .subtitle {
    font-size: 0.9rem;
    letter-spacing: 0.2em;
    margin: 0.8rem auto 0 auto;
    width: 100%;
  }
  
  .options-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2.5rem;
    width: 100%;
    max-width: none;
    padding: 0;
    margin: 0;
  }
  
  .option-card {
    width: calc(100% - 2rem);
    max-width: 320px;
    height: auto;
    min-height: 340px;
    margin: 0;
    display: flex;
    justify-content: center;
  }
  
  .card-inner {
    padding: 1.5rem;
    width: 100%;
    margin: 0;
    box-sizing: border-box;
  }
  
  .card-icon {
    font-size: 2.5rem;
    margin-bottom: 1rem;
  }
  
  .option-card h2 {
    font-size: 1.2rem;
    margin-bottom: 0.8rem;
  }
  
  .card-description {
    font-size: 0.8rem;
    margin-bottom: 1.5rem;
    line-height: 1.5;
  }
  
  .card-footer {
    font-size: 0.7rem;
  }
}

/* Small devices (larger phones, 481px to 768px) */
@media screen and (min-width: 481px) and (max-width: 768px) {
  .landing-content {
    padding: 1.5rem;
  }
  
  .title-section {
    margin-bottom: 3rem;
  }
  
  .main-title {
    font-size: 3.5rem;
    letter-spacing: 0.15em;
  }
  
  .subtitle {
    font-size: 1rem;
    letter-spacing: 0.25em;
  }
  
  .options-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2.5rem;
    width: 100%;
    max-width: none;
    padding: 0;
    margin: 0;
  }
  
  .option-card {
    width: calc(100% - 2rem);
    max-width: 360px;
    height: auto;
    min-height: 340px;
    margin: 0;
    display: flex;
    justify-content: center;
  }
  
  .card-inner {
    padding: 1.8rem;
    width: 100%;
    box-sizing: border-box;
  }
}

/* Medium devices (tablets, 769px to 1024px) */
@media screen and (min-width: 769px) and (max-width: 1024px) {
  .landing-content {
    padding: 2rem;
    max-width: 1000px;
  }
  
  .main-title {
    font-size: 4rem;
  }
  
  .subtitle {
    font-size: 1.1rem;
  }
  
  .options-container {
    gap: 5rem;
    max-width: 850px;
    padding: 0 3rem;
    flex-direction: row;
    justify-content: center;
  }
  
  .option-card {
    width: 300px;
    height: 340px;
  }
}

/* Large devices (desktops, 1025px to 1440px) */
@media screen and (min-width: 1025px) and (max-width: 1440px) {
  .landing-content {
    max-width: 1200px;
  }
  
  .main-title {
    font-size: 5rem;
  }
  
  .options-container {
    gap: 6rem;
    max-width: 1000px;
    padding: 0 3rem;
    flex-direction: row;
    justify-content: center;
  }
  
  .option-card {
    width: 320px;
    height: 350px;
  }
}

/* Extra large devices (large desktops, 1441px to 1920px) */
@media screen and (min-width: 1441px) and (max-width: 1920px) {
  .landing-content {
    max-width: 1400px;
    padding: 3rem;
  }
  
  .title-section {
    margin-bottom: 5rem;
  }
  
  .main-title {
    font-size: 6rem;
    letter-spacing: 0.25em;
  }
  
  .subtitle {
    font-size: 1.4rem;
    letter-spacing: 0.35em;
    margin-top: 1.5rem;
  }
  
  .options-container {
    gap: 8rem;
    max-width: 1000px;
  }
  
  .option-card {
    width: 350px;
    height: 400px;
  }
  
  .card-inner {
    padding: 2.5rem;
  }
  
  .card-icon {
    font-size: 3.5rem;
    margin-bottom: 2rem;
  }
  
  .option-card h2 {
    font-size: 1.7rem;
    margin-bottom: 1.5rem;
  }
  
  .card-description {
    font-size: 1rem;
    margin-bottom: 2.5rem;
  }
}

/* Ultra large devices (4K and beyond, 1921px+) */
@media screen and (min-width: 1921px) {
  .landing-content {
    max-width: 1800px;
    padding: 4rem;
  }
  
  .title-section {
    margin-bottom: 6rem;
  }
  
  .main-title {
    font-size: 8rem;
    letter-spacing: 0.3em;
  }
  
  .subtitle {
    font-size: 1.8rem;
    letter-spacing: 0.4em;
    margin-top: 2rem;
  }
  
  .options-container {
    gap: 10rem;
    max-width: 1200px;
  }
  
  .option-card {
    width: 400px;
    height: 450px;
  }
  
  .card-inner {
    padding: 3rem;
  }
  
  .card-icon {
    font-size: 4rem;
    margin-bottom: 2.5rem;
  }
  
  .option-card h2 {
    font-size: 2rem;
    margin-bottom: 2rem;
  }
  
  .card-description {
    font-size: 1.1rem;
    line-height: 1.7;
    margin-bottom: 3rem;
  }
  
  .card-footer {
    font-size: 0.9rem;
  }
  
  .arrow {
    font-size: 1.8rem;
  }
}
</style>
