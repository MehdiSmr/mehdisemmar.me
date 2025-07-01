<script lang="ts" setup>
import '../../style.css'
import {text} from './Assistant'
 
</script>

<template>
  <div id="bubble">
    <div class="bubble-header">
      <div class="status-indicator"></div>
      <span class="assistant-label">ASSISTANT</span>
      <div class="signal-bars">
        <div class="bar"></div>
        <div class="bar"></div>
        <div class="bar"></div>
      </div>
    </div>
    
    <div class="bubble-content">
      <span id="text" v-html="text || 'Assistant ready...'"></span>
      <div class="typing-indicator" v-if="!text">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
    
    <div class="bubble-footer">
      <div class="data-stream"></div>
    </div>
  </div>
</template>

<style scoped>
#bubble {
  position: absolute;
  left: 20%;
  top: 0;
  width: 70%;
  height: 80%;
  margin: 10vh 0;
  padding: 0;
  display: none;
  box-sizing: border-box;
  
  /* Enhanced futuristic background */
  background: linear-gradient(
    135deg,
    rgba(0, 20, 25, 0.95) 0%,
    rgba(0, 35, 45, 0.85) 50%,
    rgba(0, 20, 25, 0.95) 100%
  );
  
  /* Multiple layered effects */
  backdrop-filter: blur(10px);
  border: 1px solid rgba(64, 224, 208, 0.3);
  border-radius: 12px;
  
  /* Holographic glow effect */
  box-shadow: 
    0 0 20px rgba(64, 224, 208, 0.2),
    inset 0 1px 0 rgba(64, 224, 208, 0.1),
    inset 0 -1px 0 rgba(0, 255, 255, 0.1);
  
  cursor: none !important;
  animation: 
    fadeInUp 0.8s ease-out forwards,
    float 5s ease-in-out infinite 0.8s,
    holographicPulse 3s ease-in-out infinite;
  
  overflow: hidden;
  z-index: 1000;
  
  /* Subtle scan lines effect */
  position: relative;
}

#bubble::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: repeating-linear-gradient(
    90deg,
    transparent,
    transparent 2px,
    rgba(64, 224, 208, 0.03) 2px,
    rgba(64, 224, 208, 0.03) 4px
  );
  pointer-events: none;
  z-index: 1;
}

#bubble::after {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: linear-gradient(45deg, 
    rgba(64, 224, 208, 0.1),
    rgba(0, 255, 255, 0.1),
    rgba(64, 224, 208, 0.1)
  );
  border-radius: 14px;
  z-index: -1;
  animation: borderGlow 2s ease-in-out infinite alternate;
}

.bubble-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  border-bottom: 1px solid rgba(64, 224, 208, 0.2);
  background: rgba(0, 0, 0, 0.3);
  position: relative;
  z-index: 2;
}

.status-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #00ff88;
  box-shadow: 0 0 10px #00ff88;
  animation: statusPulse 2s ease-in-out infinite;
}

.assistant-label {
  font-family: 'Courier New', monospace;
  font-size: 11px;
  font-weight: bold;
  color: #40e0d0;
  letter-spacing: 2px;
  text-shadow: 0 0 5px rgba(64, 224, 208, 0.5);
}

.signal-bars {
  display: flex;
  gap: 2px;
  align-items: flex-end;
}

.signal-bars .bar {
  width: 3px;
  background: #40e0d0;
  border-radius: 1px;
  animation: signalPulse 1.5s ease-in-out infinite;
}

.signal-bars .bar:nth-child(1) {
  height: 8px;
  animation-delay: 0s;
}

.signal-bars .bar:nth-child(2) {
  height: 12px;
  animation-delay: 0.3s;
}

.signal-bars .bar:nth-child(3) {
  height: 16px;
  animation-delay: 0.6s;
}

.bubble-content {
  padding: 20px;
  height: calc(100% - 100px);
  overflow-y: auto;
  position: relative;
  z-index: 2;
}

.bubble-content::-webkit-scrollbar {
  width: 6px;
}

.bubble-content::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}

.bubble-content::-webkit-scrollbar-thumb {
  background: rgba(64, 224, 208, 0.4);
  border-radius: 3px;
}

.bubble-content::-webkit-scrollbar-thumb:hover {
  background: rgba(64, 224, 208, 0.6);
}

#text {
  font-family: 'Segoe UI', 'Arial', sans-serif;
  font-size: 14px;
  line-height: 1.6;
  color: #e0f7ff;
  text-shadow: 0 0 3px rgba(224, 247, 255, 0.3);
  display: block;
  animation: textGlow 0.5s ease-in;
}

.typing-indicator {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-top: 10px;
}

.typing-indicator span {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #40e0d0;
  animation: typingDot 1.4s ease-in-out infinite;
}

.typing-indicator span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: 0.4s;
}

.bubble-footer {
  height: 40px;
  border-top: 1px solid rgba(64, 224, 208, 0.2);
  background: rgba(0, 0, 0, 0.3);
  position: relative;
  z-index: 2;
}

.data-stream {
  height: 2px;
  background: linear-gradient(90deg, 
    transparent 0%,
    #40e0d0 50%,
    transparent 100%
  );
  margin: 19px 20px;
  border-radius: 1px;
  animation: dataFlow 2s linear infinite;
}

/* Animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-5px);
  }
}

@keyframes holographicPulse {
  0%, 100% {
    box-shadow: 
      0 0 20px rgba(64, 224, 208, 0.2),
      inset 0 1px 0 rgba(64, 224, 208, 0.1),
      inset 0 -1px 0 rgba(0, 255, 255, 0.1);
  }
  50% {
    box-shadow: 
      0 0 30px rgba(64, 224, 208, 0.3),
      inset 0 1px 0 rgba(64, 224, 208, 0.2),
      inset 0 -1px 0 rgba(0, 255, 255, 0.2);
  }
}

@keyframes borderGlow {
  0% {
    opacity: 0.3;
  }
  100% {
    opacity: 0.6;
  }
}

@keyframes statusPulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.1);
  }
}

@keyframes signalPulse {
  0%, 100% {
    opacity: 0.6;
    transform: scaleY(1);
  }
  50% {
    opacity: 1;
    transform: scaleY(1.2);
  }
}

@keyframes textGlow {
  from {
    opacity: 0;
    text-shadow: 0 0 10px rgba(224, 247, 255, 0.8);
  }
  to {
    opacity: 1;
    text-shadow: 0 0 3px rgba(224, 247, 255, 0.3);
  }
}

@keyframes typingDot {
  0%, 60%, 100% {
    opacity: 0.3;
    transform: scale(1);
  }
  30% {
    opacity: 1;
    transform: scale(1.2);
  }
}

@keyframes dataFlow {
  0% {
    transform: translateX(-100%);
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    transform: translateX(100%);
    opacity: 0;
  }
}

/* Responsive Design */
@media screen and (max-width: 1600px) {
  #bubble {
    width: 90%;
    left: 5%;
    margin: 5vh 0;
  }
  
  #text {
    font-size: 12px;
  }
  
  .assistant-label {
    font-size: 10px;
  }
}

@media screen and (max-width: 768px) {
  #bubble {
    width: 95%;
    left: 2.5%;
    margin: 2vh 0;
  }
  
  .bubble-content {
    padding: 15px;
  }
  
  #text {
    font-size: 10px;
    line-height: 1.5;
  }
  
  .bubble-header {
    padding: 10px 15px;
  }
  
  .assistant-label {
    font-size: 9px;
    letter-spacing: 1px;
  }
}
</style>
