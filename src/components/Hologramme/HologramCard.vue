<script lang="ts" setup>
import { activeHologramCard, hideHologramCard } from './cardState'
</script>

<template>
  <Transition name="holo-card">
    <article v-if="activeHologramCard" class="hologram-card">
      <header class="card-header">
        <span class="badge">{{ (activeHologramCard.category || 'hologram').toUpperCase() }}</span>
        <button class="close-btn" type="button" @click="hideHologramCard">x</button>
      </header>

      <h3 class="card-title">{{ activeHologramCard.name }}</h3>
      <p class="card-period">{{ activeHologramCard.period }}</p>
      <p class="card-type">{{ activeHologramCard.type }}</p>

      <p v-if="activeHologramCard.description" class="card-description">
        {{ activeHologramCard.description }}
      </p>

      <p v-if="activeHologramCard.skills?.length" class="card-skills">
        {{ activeHologramCard.skills.join(' • ') }}
      </p>
    </article>
  </Transition>
</template>

<style scoped>
.hologram-card {
  position: absolute;
  right: 5%;
  bottom: 8%;
  width: min(460px, 88%);
  max-height: 70%;
  overflow-y: auto;
  padding: 16px;
  border-radius: 14px;
  border: 1px solid rgba(64, 224, 208, 0.45);
  background: linear-gradient(145deg, rgba(1, 22, 29, 0.95), rgba(1, 35, 46, 0.88));
  box-shadow: 0 0 24px rgba(64, 224, 208, 0.22);
  color: #e0f7ff;
  z-index: 5;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.badge {
  font-size: 11px;
  letter-spacing: 1px;
  color: #00ff88;
}

.close-btn {
  background: transparent;
  border: 1px solid rgba(64, 224, 208, 0.6);
  color: #40e0d0;
  border-radius: 999px;
  width: 24px;
  height: 24px;
  cursor: pointer;
}

.card-title {
  margin: 0;
  color: #40e0d0;
}

.card-period,
.card-type {
  margin: 4px 0;
  font-size: 12px;
  color: #b0c4de;
}

.card-description {
  margin: 10px 0;
  font-size: 13px;
  line-height: 1.45;
}

.card-skills {
  margin: 8px 0 0;
  font-size: 12px;
  color: #00ff88;
}

.holo-card-enter-active {
  transition: opacity 220ms ease, transform 220ms ease;
}

.holo-card-leave-active {
  transition: none;
}

.holo-card-enter-from,
.holo-card-leave-to {
  opacity: 0;
  transform: translateY(10px) scale(0.98);
}
</style>
