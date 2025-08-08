<script lang="ts" setup>
import * as THREE from 'three'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js'
import { onMounted, onUnmounted, ref } from 'vue'

let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let mixer: THREE.AnimationMixer
let animationId: number
const canvasContainer = ref<HTMLDivElement>()

onMounted(() => {
  initThreeJS()
})

onUnmounted(() => {
  cleanup()
})

function initThreeJS() {
  scene = new THREE.Scene()
  
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
  camera.position.z = 350
  
  renderer = new THREE.WebGLRenderer()
  renderer.setClearColor(0x000000, 0) 
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(window.devicePixelRatio)
  
  const canvas = renderer.domElement
  canvas.style.zIndex = '10'
  canvas.style.position = 'relative'
  canvas.style.width = '100%'
  canvas.style.height = '100%'
  
  if (canvasContainer.value) {
    canvasContainer.value.appendChild(canvas)
  }

  const ambientLight = new THREE.AmbientLight(0xffffff, 1)
  scene.add(ambientLight)
  
  const light = new THREE.DirectionalLight(0xffffff, 1)
  light.position.set(1, 1, 1)
  scene.add(light)
  
  const loader : FBXLoader = new FBXLoader()
  const anim = new FBXLoader()
  const clock = new THREE.Clock();
  
  loader.setPath('src/assets/bot/');
  loadScene('src/assets/bot/', 'Silly Dancing.fbx');
  
  animate();
  
  function loadScene(scenePath: string, sceneTitle: string) {
      loader.load('bot.fbx', (fbx : any) => {
          fbx.scale.setScalar(1);
          fbx.traverse((child: any) => {
              child.castShadow = true
              child.receiveShadow = true
          })
          anim.setPath(scenePath)
          anim.load(sceneTitle, (anim) => {
              mixer = new THREE.AnimationMixer(fbx)
              const idle = mixer.clipAction(anim.animations[0])
              console.log(anim.animations[0]);
              idle.play()
          })
          scene.add(fbx)
      })
  }
  
  function animate() {
    animationId = requestAnimationFrame(animate);
    const delta = clock.getDelta();
    if (mixer) mixer.update(delta);
    if (renderer && scene && camera) {
      renderer.render(scene, camera);
    }
  }
}

function cleanup() {
  // Cancel animation frame
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  
  // Dispose of Three.js resources
  if (renderer) {
    renderer.dispose()
    renderer.forceContextLoss()
    const canvas = renderer.domElement
    if (canvas.parentElement) {
      canvas.parentElement.removeChild(canvas)
    }
  }
  
  // Clear scene
  if (scene) {
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.geometry?.dispose()
        if (child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach(material => material.dispose())
          } else {
            child.material.dispose()
          }
        }
      }
    })
    scene.clear()
  }
  
  // Clear references
  scene = null as any
  camera = null as any
  renderer = null as any
  mixer = null as any
}
</script>

<template>
  <div ref="canvasContainer" class="assistant-canvas"></div>
</template>

<style scoped>
.assistant-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
}
</style>
