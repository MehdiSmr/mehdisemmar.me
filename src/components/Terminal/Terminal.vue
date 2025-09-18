<script lang="ts" setup>
import { onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { executeCommand, currentDirectory } from './CLI'

const router = useRouter()

// Keyboard shortcut handler
const handleKeyboardShortcut = (e: KeyboardEvent) => {
  if (e.ctrlKey && e.key === 'h') {
    e.preventDefault()
    router.push('/')
  }
}

onMounted(() => {
  // Add keyboard shortcut listener
  window.addEventListener('keydown', handleKeyboardShortcut)
  
  var cmdout : string = ""
  var terminalInput : HTMLInputElement = document.getElementById('terminal-input') as HTMLInputElement
  var output : HTMLSpanElement = document.getElementById('cmd-output') as HTMLSpanElement
  var typer : HTMLSpanElement = document.getElementById('typer') as HTMLSpanElement
  var line : HTMLElement = document.getElementById("line") as HTMLElement;
  var terminal : HTMLElement = document.getElementById("terminal-content") as HTMLElement;
  const terminalHeight = terminal.scrollHeight
  line.querySelector(".directory-info")!.innerHTML = '<Right>'+ currentDirectory.value + '&nbsp';
 
 function newLine(){
    // creating a new line
    const newLine : HTMLElement = line.cloneNode(true) as HTMLElement;
    newLine.querySelector(".directory-info")!.innerHTML= '<Right>'+ currentDirectory.value + '&nbsp';
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

onUnmounted(() => {
  // Remove keyboard shortcut listener
  window.removeEventListener('keydown', handleKeyboardShortcut)
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
        <div class="banner-line">║  Type 'help' for commands | Press CTRL+H for portfolio       ║</div>
        <div class="banner-line">╚═══════════════════════════════════════════════════════════════╝</div>
      </div>

      <div id="line" class="command-line">
        <span id="user" class="user-prompt">
          <span class="prompt-symbol">◉</span>
          <span class="user-info">visitors@mehdisemmar.me&nbsp;</span>
          <span class="directory-info"></span>
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
@import '../../assets/styles/Terminal.css';
</style>
