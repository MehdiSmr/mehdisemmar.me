<template>
  <div class="terminal-container">
    <div class="terminal-window">
      <!-- Terminal Header -->
      <div class="terminal-header">
        <div class="terminal-buttons">
          <div class="terminal-button close"></div>
          <div class="terminal-button minimize"></div>
          <div class="terminal-button maximize"></div>
        </div>
        <div class="terminal-title">mehdi@portfolio: ~</div>
      </div>
      
      <!-- Terminal Body -->
      <div class="terminal-body">
        <div class="terminal-line command-line slide-in-left" style="animation-delay: 0.1s;">
          <span class="prompt-user">mehdi@portfolio</span><span class="prompt-separator">:</span><span class="prompt-path">~</span><span class="prompt-symbol">$</span>
          <span class="command">{{ t('terminal.command') }}</span>
        </div>
        
        <div class="terminal-output">
          <div class="output-line slide-in-left" style="animation-delay: 0.3s;"></div>
          <div class="output-line highlight slide-in-left" style="animation-delay: 0.5s;">{{ t('terminal.title') }}</div>
          <div class="output-line slide-in-left" style="animation-delay: 0.7s;">{{ t('terminal.education') }}</div>
          <div class="output-line slide-in-left" style="animation-delay: 0.9s;">{{ t('terminal.specialization') }}</div>
          <div class="output-line slide-in-left" style="animation-delay: 1.1s;">{{ t('terminal.focus') }}</div>
          <div class="output-line slide-in-left" style="animation-delay: 1.3s;"></div>
          <div class="output-line slide-in-left" style="animation-delay: 1.5s;">{{ t('terminal.leadership') }}</div>
          <div class="output-line slide-in-left" style="animation-delay: 1.7s;">{{ t('terminal.events') }}</div>
          <div class="output-line slide-in-left" style="animation-delay: 1.9s;">{{ t('terminal.innovation') }}</div>
          <div class="output-line slide-in-left" style="animation-delay: 2.1s;">{{ t('terminal.applications') }}</div>
          <div class="output-line slide-in-left" style="animation-delay: 2.3s;"></div>
          <div class="output-line slide-in-left" style="animation-delay: 2.5s;">{{ t('terminal.motto') }}</div>
        </div>
        
        <div class="terminal-line command-line slide-in-left" style="animation-delay: 2.7s;">
          <span class="prompt-user">mehdi@portfolio</span><span class="prompt-separator">:</span><span class="prompt-path">~</span><span class="prompt-symbol">$</span>
          <span class="cursor">_</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { onMounted, onUnmounted } from 'vue'

const { t } = useI18n()

let observer: IntersectionObserver | null = null

onMounted(() => {
  // Set up scroll-triggered animation for terminal elements
  const terminalElements = document.querySelectorAll('.slide-in-left')
  
  observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-visible')
      } else {
        entry.target.classList.remove('animate-visible')
      }
    })
  }, { threshold: 0.2, rootMargin: '100px' })
  
  terminalElements.forEach(element => {
    observer?.observe(element)
  })
})

onUnmounted(() => {
  observer?.disconnect()
})
</script>

<style scoped>
/* Terminal Container - Takes full section */
.terminal-container {
  width: 100%;
  min-height: 80vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  perspective: 1000px;
  background: radial-gradient(circle at center, rgba(64, 224, 208, 0.05), transparent);
  gap: 1rem;
}

/* Terminal Window with 3D Effects */
.terminal-window {
  width: 100%;
  max-width: 1200px;
  min-height: 600px;
  background: linear-gradient(135deg, rgba(20, 20, 20, 0.95), rgba(10, 10, 10, 0.98));
  border: 2px solid #40e0d0;
  border-radius: 12px;
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.5),
    0 0 40px rgba(64, 224, 208, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  transform-style: preserve-3d;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

/* 3D Hover Effects */
.terminal-window:hover {
  transform: translateY(-10px) rotateX(2deg) rotateY(-2deg);
  box-shadow: 
    0 30px 80px rgba(0, 0, 0, 0.6),
    0 0 60px rgba(64, 224, 208, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.15);
}


/* Terminal Header */
.terminal-header {
  background: linear-gradient(135deg, rgba(64, 224, 208, 0.1), rgba(0, 255, 136, 0.05));
  border-bottom: 1px solid rgba(64, 224, 208, 0.3);
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 0.3s ease;
}

.terminal-window:hover .terminal-header {
  background: linear-gradient(135deg, rgba(64, 224, 208, 0.15), rgba(0, 255, 136, 0.08));
}

/* Window Control Buttons */
.terminal-buttons {
  display: flex;
  gap: 0.5rem;
}

.terminal-button {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  transition: all 0.3s ease;
  cursor: pointer;
}

.terminal-button.close {
  background: #ff5f56;
  box-shadow: 0 0 10px rgba(255, 95, 86, 0.5);
}

.terminal-button.minimize {
  background: #ffbd2e;
  box-shadow: 0 0 10px rgba(255, 189, 46, 0.5);
}

.terminal-button.maximize {
  background: #27ca3f;
  box-shadow: 0 0 10px rgba(39, 202, 63, 0.5);
}

.terminal-button:hover {
  transform: scale(1.2);
  filter: brightness(1.2);
}

/* Terminal Title */
.terminal-title {
  font-family: 'Courier New', monospace;
  color: #e0f7ff;
  font-size: 0.9rem;
  font-weight: bold;
  text-shadow: 0 0 10px rgba(224, 247, 255, 0.3);
  transition: all 0.3s ease;
}

.terminal-window:hover .terminal-title {
  color: #00ff88;
  text-shadow: 0 0 15px rgba(0, 255, 136, 0.5);
}

/* Terminal Body */
.terminal-body {
  padding: 2rem;
  font-family: 'Courier New', monospace;
  font-size: 1.1rem;
  line-height: 1.8;
  height: calc(100% - 60px);
  overflow-y: auto;
  position: relative;
}

/* Terminal Lines */
.terminal-line {
  margin-bottom: 0.5rem;
  transition: all 0.3s ease;
}

.terminal-line:hover {
  transform: translateX(5px);
  text-shadow: 0 0 10px rgba(64, 224, 208, 0.3);
}

/* Command Line Styling */
.command-line {
  margin-bottom: 1rem;
}

.prompt-user {
  color: #00ff88;
  font-weight: bold;
  text-shadow: 0 0 10px rgba(0, 255, 136, 0.5);
}

.prompt-separator {
  color: #e0f7ff;
  margin: 0 2px;
}

.prompt-path {
  color: #40e0d0;
  font-weight: bold;
  text-shadow: 0 0 8px rgba(64, 224, 208, 0.4);
}

.prompt-symbol {
  color: #e0f7ff;
  margin: 0 8px;
}

.command {
  color: #87ceeb;
  margin-left: 8px;
}

/* Terminal Output */
.terminal-output {
  margin: 1.5rem 0;
}

.output-line {
  color: #b0c4de;
  padding: 0.2rem 0;
  padding-left: 2rem;
  transition: all 0.3s ease;
  position: relative;
}

.output-line:not(:empty):hover {
  color: #e0f7ff;
  transform: translateX(10px);
  text-shadow: 0 0 8px rgba(224, 247, 255, 0.4);
}

.output-line.highlight {
  color: #00ff88;
  font-weight: bold;
  text-shadow: 0 0 15px rgba(0, 255, 136, 0.5);
  font-size: 1.2rem;
}

.output-line.highlight:hover {
  color: #40e0d0;
  text-shadow: 0 0 20px rgba(64, 224, 208, 0.7);
  transform: translateX(15px) scale(1.02);
}

/* Cursor Animation */
.cursor {
  color: #00ff88;
  animation: blink 1.5s step-end infinite;
  text-shadow: 0 0 10px rgba(0, 255, 136, 0.5);
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

/* Slide-in animations */
.slide-in-left {
  opacity: 0;
  transform: translateX(-30px);
  transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.slide-in-left.animate-visible {
  opacity: 1;
  transform: translateX(0);
}


/* Hover areas for enhanced 3D effects */
.terminal-body .output-line:nth-child(odd):hover {
  transform: translateX(10px) translateZ(10px);
}

.terminal-body .output-line:nth-child(even):hover {
  transform: translateX(15px) translateZ(15px);
}

/* Responsive Design */
@media screen and (max-width: 768px) {
  .terminal-container {
    padding: 1rem;
    min-height: 70vh;
  }
  
  .terminal-window {
    min-height: 500px;
  }
  
  .terminal-body {
    padding: 1.5rem;
    font-size: 0.95rem;
    line-height: 1.6;
  }
  
  .output-line.highlight {
    font-size: 1.1rem;
  }
}

@media screen and (min-width: 769px) and (max-width: 1024px) {
  .terminal-body {
    font-size: 1rem;
    line-height: 1.7;
  }
}

@media screen and (min-width: 1441px) {
  .terminal-container {
    padding: 3rem;
  }
  
  .terminal-window {
    min-height: 700px;
  }
  
  .terminal-body {
    padding: 3rem;
    font-size: 1.2rem;
    line-height: 1.9;
  }
  
  .output-line.highlight {
    font-size: 1.4rem;
  }
}
</style>
