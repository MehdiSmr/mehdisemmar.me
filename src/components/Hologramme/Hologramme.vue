<script lang="ts" setup>
import { TresCanvas, useRenderLoop } from '@tresjs/core'
import { HolographicMaterial } from '@tresjs/cientos'
import { ref } from 'vue'
const { onLoop } = useRenderLoop()

const rotationY = ref(0)

onLoop(() => {
    rotationY.value += 0.01
})

</script>

<template>
    <div id="hologramme">
        <TresCanvas>
            <TresPerspectiveCamera :position="[0, 1, 5]"/>
            <TresMesh :position="[0, 0, 0]" :rotation="[0, rotationY, 0]">
                <TresCylinderGeometry :args="[0.05, 0.10, 0.1, 6, 64, false, 0, Math.PI * 2]" />
                <TresMeshStandardMaterial 
                    color="#b0b8c1"  
                    :metalness="1"
                    :roughness="0.08"
                    :emissive="'#b0c4de'"
                    :emissiveIntensity="0.15"
                    :transparent="true"
                    :opacity="0.92"
                />
            </TresMesh>
            <TresMesh :position="[0, 0.85, 0]" :rotation="[Math.PI, rotationY, 0]">
                <TresConeGeometry :args="[2, 1.5, 4]" />
                <HolographicMaterial
                    :hologramColor="'#00ff88'"
                    :fresnelAmount="0.6"
                    :hologramOpacity="0.8"
                />
            </TresMesh>
            <TresAmbientLight :intensity="0.5" />
            <TresPointLight :position="[10, 10, 10]" :intensity="1" />
        </TresCanvas>
    </div>
</template>

<style scoped>
#hologramme {
    position: fixed;
    top: 45%;
    width: 50%;
    height: 50%;
    filter: drop-shadow(0 0 20px rgba(74, 144, 226, 0.3));
    mask-image: linear-gradient(to top, transparent, black 50%);
    -webkit-mask-image: linear-gradient(to top, transparent, black 50%);
}

@media screen and (max-width: 1024px) {
    #hologramme {
        width: 100%;
        height: 40%;
        top: 60%;
        right: 0;
    }
}

@media screen and (max-width: 768px) {
    #hologramme {
        width: 100%;
        height: 30%;
        top: 70%;
    }
}
</style>

