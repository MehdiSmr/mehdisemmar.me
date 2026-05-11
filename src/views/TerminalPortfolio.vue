<script lang="ts" setup>
import { onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import Terminal from '../components/Terminal/Terminal.vue'
import Hologramme from '../components/Hologramme/Hologramme.vue'
import { isTerminalExperienceAllowed } from '../utils/device'
import '../style.css'

const router = useRouter()
const enforceTerminalAvailability = () => {
  if (!isTerminalExperienceAllowed()) {
    router.replace('/')
  }
}

onMounted(() => {
  enforceTerminalAvailability()
  window.addEventListener('resize', enforceTerminalAvailability)
})

onUnmounted(() => {
  window.removeEventListener('resize', enforceTerminalAvailability)
})
</script>

<template>
  <div id="container">
    <div class="matrix-bg"></div>
    <div class="terminal-container">
      <Terminal/>
    </div>
    <div class="hologramme-container">
      <Hologramme />
    </div>
  </div>
</template>

<style scoped>
.matrix-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #0a0f14;
  z-index: -2;
  overflow: hidden;
}

.matrix-bg::before {
  content: '';
  position: absolute;
  top: -120px;
  left: 0;
  right: 0;
  bottom: -120px;
  background-image:
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent 8px,
      rgba(64, 224, 208, 0.02) 8px,
      rgba(64, 224, 208, 0.02) 9px
    ),
    repeating-linear-gradient(
      90deg,
      transparent,
      transparent 8px,
      rgba(64, 224, 208, 0.02) 8px,
      rgba(64, 224, 208, 0.02) 9px
    );
  animation: matrix-rain 30s linear infinite;
}

@keyframes matrix-rain {
  0% { transform: translateY(0); }
  100% { transform: translateY(100px); }
}

@media screen and (max-width: 768px) {
  .terminal-container,
  .hologramme-container {
    width: 100%;
    height: 50%;
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

.hologramme-container {
  position: fixed;
  right: 0;
  width: 50%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.hologramme-container :deep(*) {
  animation: fadeInUp 0.8s ease-out 0.3s forwards;
  opacity: 0;
}

</style>
