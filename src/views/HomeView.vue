<script lang="ts" setup>
import { computed } from 'vue'
import { lang } from '../composables/useLang'
import { content, links, portrait } from '../data/content'

const d = computed(() => content[lang.value])
</script>

<template>
  <div class="home">
    <div class="split">
      <figure class="frame">
        <img :src="portrait" :alt="d.portraitAlt" decoding="async" />
      </figure>

      <div class="col">
        <div class="prose">
          <p v-for="(para, i) in d.bio" :key="i">{{ para }}</p>
        </div>

        <nav class="foot" aria-label="Elsewhere">
          <a class="underlink" :href="links.github" target="_blank" rel="noopener">github</a>
          <a class="underlink" :href="links.linkedin" target="_blank" rel="noopener">linkedin</a>
          <a class="underlink" :href="links.email">email</a>
        </nav>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home {
  animation: omRise 0.5s var(--ease) both;
}

/* Portrait left, prose right. `stretch` gives the right column the portrait's
   full height, which is what the links below hang off. */
.split {
  display: grid;
  grid-template-columns: minmax(0, 5fr) minmax(0, 6fr);
  gap: 56px;
  align-items: stretch;
}

/* The photograph sits on the page directly — no mat, no border. */
.frame {
  margin: 0;
}

.frame img {
  display: block;
  width: 100%;
  aspect-ratio: 4 / 5;
  object-fit: cover;
}

.col {
  display: flex;
  flex-direction: column;
}

/* Two auto margins split the free space: the links land on the portrait's
   bottom edge, and the prose centres in what is left above them. */
.prose {
  display: flex;
  flex-direction: column;
  gap: 18px;
  margin-top: auto;
}

.prose p {
  margin: 0;
  max-width: 46ch;
  font: 400 15px/1.85 var(--serif);
  text-wrap: pretty;
}

.foot {
  display: flex;
  flex-wrap: wrap;
  gap: 26px;
  margin-top: auto;
  padding-top: 32px;
  font: 400 11px/1 var(--serif);
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

/* Underlined, unlike the header's nav — these read as things to click rather
   than as a statement of where you are. See `.underlink` in style.css. */

@media (max-width: 860px) {
  /* Portrait over prose, and no longer full width — a stacked photo that
     spans the column reads as a banner rather than a portrait. Nothing is
     aligned to the portrait's bottom edge any more, so the auto margins go. */
  .split {
    grid-template-columns: 1fr;
    gap: 32px;
  }

  .frame {
    max-width: 300px;
  }

  .col {
    gap: 32px;
  }

  .prose,
  .foot {
    margin-top: 0;
  }

  .foot {
    padding-top: 0;
  }
}
</style>
