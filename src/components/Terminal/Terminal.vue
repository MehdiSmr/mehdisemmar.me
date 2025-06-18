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
  var terminal : HTMLElement = document.getElementById("terminal") as HTMLElement;

  function newLine(){
    // creating a new line
    const newLine : HTMLElement = line.cloneNode(true) as HTMLElement;
    typer = newLine.querySelector("#typer") as HTMLSpanElement;
    typer!.innerHTML = ''
    document.getElementById("terminal")?.appendChild(newLine)
    line.querySelector("#cursor")!.innerHTML = ''
    line = newLine as HTMLElement;
    // creating a new cmd output
    output = output.cloneNode(true) as HTMLElement;
    output.innerHTML = ''
    document.getElementById("terminal")?.appendChild(output) 
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
          // scroll to the bottom of the terminal
          terminal.scrollTo(0, terminal.scrollHeight)
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
                output!.innerHTML = "Command not found"
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
    <textarea type="text" id="terminal-input"/>
    <div id="line">
      <span id="user">visitors@mehdisemmar.me {{ currentDirectory }} $ &nbsp;</span>
      <span id="typer"></span>
      <b id="cursor">█</b>
    </div>
    <span id="cmd-output"></span>
  </div>
</template>

<style scoped>
#terminal {
  position: absolute;
  left: 20%;
  top: 0;
  width: 70%;
  height: 80%;
  margin: 10vh 0;
  padding: 20px;
  box-sizing: border-box;
  background: linear-gradient(
    90deg,
    rgba(0, 0, 0, 0.8) 0%,
    rgba(0, 0, 0, 0.4) 100%
  );
  backdrop-filter: blur(5px);
  cursor: none !important;
  animation: 
    fadeInUp 0.8s ease-out forwards,
    float 5s ease-in-out infinite 0.8s;
  overflow-y: auto;
  scrollbar-width: none;
  z-index: 1000;
}

#terminal-input{
  left: -10000px;
  position: absolute;
}

#line{
  display: flex;
  font-size: 14px;
  z-index: 100;
}

#cmd-output{
  display: flex;
  font-size: 14px;
  z-index: 100;
}

#cursor{
  height: 1.5em;
  width: 8px;
  color: limegreen;
  display: inline-block;
  animation: blink 1s step-end infinite;
}

@keyframes blink {
  50% {
    opacity: 0;
  }
}

@media screen and (max-width: 1600px) {
  #terminal {
    width: 90%;
    left: 5%;
    margin: 5vh 0;
  }
  #line{
    font-size: 12px;
  }
  #cmd-output{
    font-size: 12px;
  }
}

@media screen and (max-width: 768px) {
  #terminal {
    width: 95%;
    left: 2.5%;
    margin: 2vh 0;
    padding: 15px;
  }
  #line{
    font-size: 10px;
  }
  #cmd-output{
    font-size: 10px;
  }
}

</style> 
