<script lang="ts" setup>
import Terminal from '../components/Terminal/Terminal.vue'
import Hologramme from '../components/Hologramme/Hologramme.vue'
import Assistant from '../components/Assistant/Assistant.vue'
import Bubble from '../components/Assistant/Bubble.vue'
import { updateText, showBubble, hideBubble } from '../components/Assistant/Assistant.ts'
import '../style.css'

var mouseWarningDisplayed : boolean = false;

setTimeout(() => {
    addEventListener("mousemove", (event) => {
        if (!mouseWarningDisplayed) {
            showBubble();
            handleMouseMove(event);
       } else {
            removeEventListener("mousemove", handleMouseMove);
        } 
    });
}, 5000);

const handleMouseMove = (_event: MouseEvent) => {
    mouseWarningDisplayed = true;
    updateText("This application is designed to be used without a mouse. Please use keyboard controls.");
    setTimeout(() => {
        updateText("");
        hideBubble();
    }, 5000);
};

</script>

<template>
  <div id="container">
    <video autoplay loop muted playsinline class="background-video">
      <source src="../assets/bg.mp4" type="video/mp4"/>
    </video>
    
    <div class="terminal-container">
      <Terminal/>
    </div>
    <div class="hologramme-container">
      <Hologramme />
    </div>
    <div class="assistant-container">
      <Assistant />
    </div>
    <div class="bubble-container">
      <Bubble />
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
    z-index: -1;
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

.bubble-container {
  z-index: 2;
}

.assistant-container {
  z-index: 1;
}

@media screen and (max-width: 768px) {
  .terminal-container,
  .hologramme-container {
    width: 100%;
    height: 50%;
  }

  video {
    filter: blur(1px) brightness(0.7);
  }
}
</style>
