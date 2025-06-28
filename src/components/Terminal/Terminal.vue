<script lang="ts" setup>
import '../../style.css'
import { onMounted } from 'vue'
import { executeCommand, currentDirectory } from './CLI'

onMounted(() => {
  var cmdout : string = ""
  var terminalInput : HTMLInputElement = document.getElementById('terminal-input') as HTMLInputElement
  var output : HTMLSpanElement = document.getElementById('cmd-output') as HTMLSpanElement
  var typer : HTMLSpanElement = document.getElementById('typer') as HTMLSpanElement
  var line : HTMLElement = document.getElementById("line") as HTMLElement;
  var terminal : HTMLElement = document.getElementById("terminal-content") as HTMLElement;
  const terminalHeight = terminal.scrollHeight

  function newLine(){
    // creating a new line
    const newLine : HTMLElement = line.cloneNode(true) as HTMLElement;
    typer = newLine.querySelector("#typer") as HTMLSpanElement;
    typer!.innerHTML = ''
    document.getElementById("terminal-content")?.appendChild(newLine)
    line.querySelector("#cursor")!.innerHTML = ''
    line = newLine as HTMLElement;
    // creating a new cmd output
    output = output.cloneNode(true) as HTMLElement;
    output.innerHTML = ''
    document.getElementById("terminal-content")?.appendChild(output) 
  }
  
  if (terminalInput) {
    terminalInput.focus()
    terminalInput.select()
    terminalInput.addEventListener('blur', function() {
      this.focus();
      this.select();
    });
    
    if (output) {
      terminalInput.addEventListener('keyup', (e) => {
        typer!.innerHTML = terminalInput!.value   
        if (e.key === 'Enter') {
          terminalInput!.value = ''
          newLine()
          while (terminal.scrollHeight > terminalHeight) {
            const secondChild = terminal.children[1]
            if (secondChild) {
              secondChild.remove()
            }
          }
          console.log(terminal.scrollHeight)
        }
      })
      
      terminalInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          if (terminalInput!.value !== "") {
            cmdout = executeCommand(terminalInput!.value)
            switch (cmdout) {
              case "clear":
                terminal!.innerHTML = ''
                terminal!.appendChild(terminalInput)
                break
              case "false":
                output!.innerHTML = "command not valid"
                break
              case "":
              case "true":
                break
              default:
                output!.innerHTML = cmdout
                break
            }
          }
        }
      })
    }
  }
})
</script>

<template>
  <div id="terminal">
    <!-- Terminal Header -->
    <div class="terminal-header">
      <div class="header-left">
        <span class="terminal-title">SYSTEM TERMINAL v2.1.7</span>
      </div>
      
      <div class="header-right">
        <div class="system-stats">
          <span class="stat-item">CPU: <span class="stat-value">23%</span></span>
          <span class="stat-item">MEM: <span class="stat-value">67%</span></span>
          <span class="stat-item">NET: <span class="stat-value network-indicator">●</span></span>
        </div>
      </div>
    </div>

    <!-- Terminal Content Area -->
    <div id="terminal-content">
      <textarea type="text" id="terminal-input"/>
      
      <!-- Welcome Message -->
      <div class="welcome-banner">
        <div class="banner-line">╔═══════════════════════════════════════════════════════════════╗</div>
        <div class="banner-line">║  STARSHIP NAVIGATION SYSTEM - AUTHENTICATED ACCESS GRANTED   ║</div>
        <div class="banner-line">║  User: visitors@mehdisemmar.me | Clearance Level: VISITOR     ║</div>
        <div class="banner-line">║  System Status: OPERATIONAL | All systems nominal            ║</div>
        <div class="banner-line">╚═══════════════════════════════════════════════════════════════╝</div>
      </div>

      <div id="line" class="command-line">
        <span id="user" class="user-prompt">
          <span class="prompt-symbol">◉</span>
          <span class="user-info">visitors@mehdisemmar.me&nbsp;</span>
          <span class="directory-info">{{ currentDirectory }}&nbsp;</span>
          <span class="prompt-arrow">▶&nbsp;</span>
        </span>
        <span id="typer" class="user-input"></span>
        <b id="cursor" class="terminal-cursor">█</b>
      </div>
      
      <span id="cmd-output" class="command-output"></span>
    </div>

    <!-- Terminal Footer -->
    <div class="terminal-footer">
      <div class="footer-left">
        <span class="status-text">READY</span>
        <div class="activity-indicator"></div>
      </div>
      
      <div class="footer-right">
        <span class="timestamp">{{ new Date().toLocaleTimeString() }}</span>
        <div class="connection-status">
          <div class="signal-dot"></div>
          <div class="signal-dot"></div>
          <div class="signal-dot"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
#terminal {
  left: 20%;
  top: 0;
  width: 70%;
  height: 80%;
  margin: 10vh 0;
  padding: 0;
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
  display: flex;
  flex-direction: column;
  
  /* Terminal scan lines effect */
  position: relative;
}

#terminal::before {
  content: '';
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(64, 224, 208, 0.02) 2px,
    rgba(64, 224, 208, 0.02) 4px
  );
  pointer-events: none;
  z-index: 1;
}

#terminal::after {
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

/* Terminal Header */
.terminal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  background: rgba(0, 0, 0, 0.3);
  border-bottom: 1px solid rgba(64, 224, 208, 0.2);
  position: relative;
  z-index: 2;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.terminal-controls {
  display: flex;
  gap: 6px;
}

.control-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  position: relative;
}

.terminal-title {
  font-family: 'Courier New', monospace;
  font-size: 11px;
  font-weight: bold;
  color: #40e0d0;
  letter-spacing: 1px;
  text-shadow: 0 0 5px rgba(64, 224, 208, 0.6);
}

.header-right {
  display: flex;
  align-items: center;
}

.system-stats {
  display: flex;
  gap: 12px;
  font-family: 'Courier New', monospace;
  font-size: 10px;
}

.stat-item {
  color: rgba(224, 247, 255, 0.7);
}

.stat-value {
  color: #40e0d0;
  font-weight: bold;
}

.network-indicator {
  color: #00ff88;
  animation: networkPulse 2s ease-in-out infinite;
}

/* Terminal Content */
#terminal-content {
  flex: 1;
  padding: 20px;
  overflow-y: hidden;
  position: relative;
  z-index: 2;
  font-family: 'Courier New', monospace;
}

#terminal-input {
  left: -10000px;
  position: absolute;
}

/* Welcome Banner */
.welcome-banner {
  margin-bottom: 20px;
  color: #40e0d0;
  font-size: 11px;
  line-height: 1.4;
  opacity: 0.8;
  text-shadow: 0 0 3px rgba(64, 224, 208, 0.3);
}

.banner-line {
  margin: 2px 0;
  text-align: left;
}

/* Command Line */
.command-line {
  display: block;
  font-size: 14px;
  z-index: 100;
  margin: 8px 0;
  text-align: left;
}

.user-prompt {
  display: inline;
  color: #e0f7ff;
}

.prompt-symbol {
  color: #00ff88;
  font-size: 12px;
  animation: symbolPulse 3s ease-in-out infinite;
}

.user-info {
  color: #40e0d0;
  font-weight: bold;
  text-shadow: 0 0 3px rgba(64, 224, 208, 0.4);
}

.directory-info {
  color: #87ceeb;
  font-style: italic;
}

.prompt-arrow {
  color: #00ff88;
  font-weight: bold;
  margin-left: 4px;
}

.user-input {
  color: #ffffff;
  text-shadow: 0 0 2px rgba(255, 255, 255, 0.3);
}

.terminal-cursor {
  height: 1.2em;
  width: 8px;
  color: #00ff88;
  display: inline-block;
  animation: cursorBlink 1s step-end infinite;
  text-shadow: 0 0 5px #00ff88;
}

/* Command Output */
.command-output {
  display: block;
  font-size: 14px;
  z-index: 100;
  color: #e0f7ff;
  margin: 4px 0 12px 0;
  line-height: 1.4;
  white-space: pre-wrap;
  text-shadow: 0 0 2px rgba(224, 247, 255, 0.2);
  text-align: left;
}

/* Terminal Footer */
.terminal-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  background: rgba(0, 0, 0, 0.3);
  border-top: 1px solid rgba(64, 224, 208, 0.2);
  position: relative;
  z-index: 2;
  font-family: 'Courier New', monospace;
  font-size: 10px;
}

.footer-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-text {
  color: #00ff88;
  font-weight: bold;
  text-shadow: 0 0 3px rgba(0, 255, 136, 0.4);
}

.activity-indicator {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #00ff88;
  animation: activityPulse 1.5s ease-in-out infinite;
}

.footer-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.timestamp {
  color: rgba(224, 247, 255, 0.7);
  font-size: 9px;
}

.connection-status {
  display: flex;
  gap: 2px;
}

.signal-dot {
  width: 4px;
  height: 8px;
  background: #40e0d0;
  border-radius: 1px;
  animation: signalStrength 2s ease-in-out infinite;
}

.signal-dot:nth-child(2) {
  animation-delay: 0.3s;
}

.signal-dot:nth-child(3) {
  animation-delay: 0.6s;
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
    transform: translateY(-3px);
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

@keyframes cursorBlink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

@keyframes symbolPulse {
  0%, 100% { 
    opacity: 1; 
    transform: scale(1);
  }
  50% { 
    opacity: 0.7; 
    transform: scale(1.1);
  }
}

@keyframes networkPulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

@keyframes activityPulse {
  0%, 100% { 
    opacity: 1; 
    transform: scale(1);
  }
  50% { 
    opacity: 0.5; 
    transform: scale(1.2);
  }
}

@keyframes signalStrength {
  0%, 100% { 
    opacity: 0.4; 
    transform: scaleY(0.6);
  }
  50% { 
    opacity: 1; 
    transform: scaleY(1);
  }
}

/* Responsive Design */
@media screen and (max-width: 1600px) {
  #terminal {
    width: 90%;
    left: 5%;
    margin: 5vh 0;
  }
  
  .command-line {
    font-size: 12px;
  }
  
  .command-output {
    font-size: 12px;
  }
  
  .terminal-title {
    font-size: 10px;
  }
}

@media screen and (max-width: 768px) {
  #terminal {
    width: 95%;
    left: 2.5%;
    margin: 2vh 0;
  }
  
  #terminal-content {
    padding: 12px;
  }
  
  .command-line {
    font-size: 10px;
  }
  
  .command-output {
    font-size: 10px;
  }
  
  .terminal-header, .terminal-footer {
    padding: 6px 12px;
  }
  
  .terminal-title {
    font-size: 9px;
  }
  
  .system-stats {
    gap: 8px;
    font-size: 8px;
  }
  
  .welcome-banner {
    font-size: 9px;
  }
  
  .header-left {
    gap: 8px;
  }
}

</style>
