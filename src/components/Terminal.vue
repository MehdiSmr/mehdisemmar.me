<script lang="ts" setup>
import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import { WebLinksAddon } from '@xterm/addon-web-links'
import { onMounted } from 'vue'
import 'xterm/css/xterm.css'

onMounted(() => {
  const terminal = new Terminal({
    cursorBlink: true,
    disableStdin: true,
    scrollback: 0,
    theme: {
      background: 'transparent',
      foreground: '#0f0',
      cursor: '#0f0',
      black: '#000000',
      red: '#ff0000',
      green: '#00ff00',
      yellow: '#ffff00',
      blue: '#0000ff',
      magenta: '#ff00ff',
      cyan: '#00ffff',
      white: '#ffffff',
      brightBlack: '#666666',
      brightRed: '#ff6666',
      brightGreen: '#66ff66',
      brightYellow: '#ffff66',
      brightBlue: '#6666ff',
      brightMagenta: '#ff66ff',
      brightCyan: '#66ffff',
      brightWhite: '#ffffff'
    },
    fontFamily: 'Consolas, "Courier New", monospace',
    fontSize: 14,
    lineHeight: 1.2,
  })
  
  const fitAddon = new FitAddon()
  const webLinksAddon = new WebLinksAddon()
  terminal.loadAddon(fitAddon)
  terminal.loadAddon(webLinksAddon)
  
  const terminalElement = document.getElementById('terminal')
  if (terminalElement) {
    terminal.open(terminalElement)
    fitAddon.fit()
    
    // Block all mouse events
    terminalElement.addEventListener('mousedown', e => e.preventDefault())
    terminalElement.addEventListener('mouseup', e => e.preventDefault())
    terminalElement.addEventListener('click', e => e.preventDefault())
    terminalElement.addEventListener('dblclick', e => e.preventDefault())
    terminalElement.addEventListener('contextmenu', e => e.preventDefault())
    terminalElement.addEventListener('mousemove', e => e.preventDefault())
    terminalElement.addEventListener('mouseenter', e => e.preventDefault())
    terminalElement.addEventListener('mouseleave', e => e.preventDefault())
    terminalElement.addEventListener('wheel', e => e.preventDefault())
    
    // Add some initial text with a cyberpunk feel
    terminal.writeln('\x1b[32m[SYSTEM INITIALIZED]\x1b[0m')
    terminal.writeln('\x1b[36m[SECURITY PROTOCOLS ACTIVE]\x1b[0m')
    terminal.writeln('\x1b[33m[ACCESS GRANTED]\x1b[0m')
    terminal.writeln('')
    terminal.writeln('\x1b[32m$ \x1b[0m')
  }
})
</script>

<template>
  <div id="terminal" class="terminal-enter"></div>
</template>

<style scoped>
#terminal {
  position: fixed;
  left: 5%;
  top: 0;
  width: 40%;
  height: 60%;
  margin: 10vh 0;
  padding: 20px;
  box-sizing: border-box;
  background: linear-gradient(
    90deg,
    rgba(0, 0, 0, 0.8) 0%,
    rgba(0, 0, 0, 0.4) 100%
  );
  backdrop-filter: blur(5px);
  border-right: 1px solid rgba(0, 255, 0, 0.2);
  box-shadow: 0 0 20px rgba(0, 255, 0, 0.1);
  cursor: none !important;
}

@media screen and (max-width: 1024px) {
  #terminal {
    width: 90%;
    height: 50%;
    left: 5%;
    margin: 5vh 0;
  }
}

@media screen and (max-width: 768px) {
  #terminal {
    width: 95%;
    height: 40%;
    left: 2.5%;
    margin: 2vh 0;
    padding: 15px;
  }
}

#terminal :deep(.xterm-viewport),
#terminal :deep(.xterm-screen),
#terminal :deep(.xterm-rows),
#terminal :deep(.xterm-row),
#terminal :deep(.xterm) {
  cursor: none !important;
}

#terminal :deep(.xterm-viewport) {
  background: transparent !important;
  overflow: hidden !important;
  scrollbar-width: none !important;
  -ms-overflow-style: none !important;
}

#terminal :deep(.xterm-viewport::-webkit-scrollbar) {
  display: none !important;
}

#terminal :deep(.xterm-screen) {
  background: transparent !important;
}

#terminal :deep(.xterm-cursor) {
  animation: blink 1s step-end infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
</style> 
