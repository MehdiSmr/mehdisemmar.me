<script lang="ts" setup>
import { TresCanvas } from '@tresjs/core'
import Terminal from './components/Terminal.vue'
import Hologramme from './components/Hologramme.vue'
</script>

<template>
  <div id="container">
    <video autoplay loop muted playsinline class="background-video">
      <source src="./assets/bg.mp4" type="video/mp4"/>
    </video>
    <div class="terminal-container">
      <Terminal id="terminal"/>
      <Hologramme />
    </div>
    <div class="hologramme-container">
      <Hologramme />
    </div>
  </div>
</template>

<style scoped>
.background-video {
  position: fixed;
  right: 0;
  bottom: 0;
  min-width: 100%; 
  min-height: 100%;
  width: auto;
  height: auto;
  z-index: -1;
  object-fit: cover;
  filter: blur(2px) brightness(0.8);
  opacity: 0.9;
}

@media screen and (max-width: 1024px) {
  .background-video {
    min-width: 100%;
    min-height: 100%;
    width: 100%;
    height: 100%;
    object-position: center;
  }
}

@media screen and (max-width: 768px) {
  .background-video {
    filter: blur(1px) brightness(0.7);
    object-position: center;
  }
}

@media screen and (max-width: 480px) {
  .background-video {
    min-width: 100%;
    min-height: 100%;
    width: 100%;
    height: 100%;
    object-position: center;
  }
}

#container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  cursor: none;
  overflow: hidden;
}

.terminal-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 50%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

@keyframes float {
  0% { transform: translateY(0px) scale(1); }
  50% { transform: translateY(-12px) scale(1.01); }
  100% { transform: translateY(0px) scale(1); }
}

#terminal {
  background: linear-gradient(135deg, rgba(0,40,40,0.75) 60%, rgba(0,255,180,0.08) 100%);
  border: 2px solid rgba(0,255,180,0.18);
  border-radius: 12px;
  box-shadow:
    0 0 32px 4px rgba(0,255,180,0.18),
    0 0 8px 2px rgba(0,255,180,0.25) inset;
  backdrop-filter: blur(6px) brightness(1.08);
  -webkit-backdrop-filter: blur(6px) brightness(1.08);
  animation: float 5s ease-in-out infinite;
  z-index: 2;
}

.hologramme-container {
  position: fixed;
  bottom: 0;
  right: 0;
  width: 50%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

@media screen and (max-width: 768px) {
  .terminal-container,
  .hologramme-container {
    width: 100%;
    height: 50%;
  }

  .terminal-container {
    top: 0;
    left: 0;
  }

  .hologramme-container {
    top: 50%;
    right: 0;
    bottom: auto;
  }

  video {
    filter: blur(1px) brightness(0.7);
  }
}
</style>
