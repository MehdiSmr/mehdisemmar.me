<script lang="ts" setup>
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.z = 300

const renderer = new THREE.WebGLRenderer()
renderer.setClearColor(0x000000, 0) 
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(window.devicePixelRatio)

const canvas = renderer.domElement
canvas.style.zIndex = '10'
document.body.appendChild(renderer.domElement)

const ambientLight = new THREE.AmbientLight(0xffffff, 1)
scene.add(ambientLight)

const light = new THREE.DirectionalLight(0xffffff, 1)
light.position.set(1, 1, 1)
scene.add(light)

const loader = new GLTFLoader()
loader.load('src/assets/robot_m.a.n.u.l./scene.gltf', (gltf: any) => {
  const model = gltf.scene  
  scene.add(model)

  const box = new THREE.Box3().setFromObject(model)
  const center = box.getCenter(new THREE.Vector3())
  model.position.copy(center)
  model.scale.set(100, 100, 100)
})

function animate() {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
}
animate()
</script>

<template>
</template>

<style scoped>
</style>
