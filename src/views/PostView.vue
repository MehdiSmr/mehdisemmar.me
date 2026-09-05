<script lang="ts" setup>
import { computed } from 'vue'
import { lang } from '../composables/useLang'
import { postAt } from '../composables/usePosts'
import { content } from '../data/content'

const props = defineProps<{ slug: string }>()

const d = computed(() => content[lang.value])
const post = computed(() => postAt(props.slug, lang.value))
</script>

<template>
  <div class="post">
    <RouterLink class="back" to="/blog">{{ d.back }}</RouterLink>

    <p v-if="!post" class="empty">{{ d.empty }}</p>

    <template v-else>
      <header class="masthead">
        <div class="dates">{{ post.dates }}</div>
        <h1 class="title">{{ post.title }}</h1>
        <div v-if="post.role" class="role">{{ post.role }}</div>
      </header>

      <p v-if="!post.translated" class="note">{{ d.untranslated }}</p>

      <!-- Authored markdown, rendered with html disabled — no raw tags get through. -->
      <article class="body" v-html="post.html"></article>

      <footer v-if="post.skills.length" class="skills">
        <div class="skillhead">{{ d.skills }}</div>
        <ul class="chips">
          <li v-for="skill in post.skills" :key="skill">{{ skill }}</li>
        </ul>
      </footer>
    </template>
  </div>
</template>

<style scoped>
.post {
  display: flex;
  flex-direction: column;
  gap: 32px;
  animation: omRise 0.5s var(--ease) both;
}

.back {
  font: 400 10.5px/1 var(--serif);
  letter-spacing: 0.16em;
  text-transform: uppercase;
  align-self: flex-start;
  color: var(--gray);
  transition: color 0.3s ease;
}

.back:hover {
  color: var(--ink);
}

.masthead {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.dates,
.role {
  font: 400 10.5px/1.4 var(--serif);
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--gray);
}

.title {
  margin: 0;
  font: 400 30px/1.25 var(--serif);
  text-wrap: pretty;
}

.note,
.empty {
  margin: 0;
  color: var(--gray);
}

.note {
  font: 400 11px/1.6 var(--serif);
  letter-spacing: 0.06em;
}

.empty {
  font: 400 13.5px/1.7 var(--serif);
  font-style: italic;
}

.body {
  max-width: 620px;
}

/* Rendered markdown. Scoped styles do not reach v-html, hence :deep(). */
.body :deep(p) {
  margin: 0 0 20px;
  font: 400 15px/1.85 var(--serif);
  text-align: justify;
  hyphens: auto;
}

.body :deep(h2),
.body :deep(h3) {
  margin: 40px 0 14px;
  font-family: var(--serif);
  font-weight: 500;
}

.body :deep(h2) {
  font-size: 22px;
  line-height: 1.35;
}

.body :deep(h3) {
  font-size: 18px;
  line-height: 1.4;
}

/* A link in prose behaves like every other control: grey until hovered. */
.body :deep(a) {
  color: var(--gray);
  transition: color 0.3s ease;
}

.body :deep(a:hover) {
  color: var(--ink);
}

.body :deep(strong) {
  font-weight: 500;
}

.body :deep(ul),
.body :deep(ol) {
  margin: 0 0 20px;
  padding-left: 20px;
}

.body :deep(li) {
  font: 400 15px/1.85 var(--serif);
  margin-bottom: 4px;
}

.body :deep(blockquote) {
  margin: 28px 0;
  padding-left: 20px;
}

.body :deep(blockquote p) {
  font-size: 17px;
  font-style: italic;
  color: var(--gray);
  text-align: left;
}

/* The photograph sits on the page directly — no mat, no border, and its own
   colour. Only the caption is set apart from it. */
.body :deep(figure.plate) {
  margin: 30px 0;
}

.body :deep(img) {
  display: block;
  width: 100%;
}

.body :deep(figcaption) {
  padding-top: 9px;
  font: 400 10px/1.5 var(--serif);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--gray);
}

.body :deep(code) {
  font: 400 0.86em/1.6 var(--mono);
}

.body :deep(pre) {
  margin: 0 0 20px;
  padding: 16px 0;
  overflow-x: auto;
}

.body :deep(hr) {
  margin: 36px 0;
  border: 0;
  border-top: 1px solid var(--gray);
}

.skills {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.skillhead {
  font: 400 10px/1 var(--serif);
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--gray);
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 18px;
  list-style: none;
  margin: 0;
  padding: 0;
}

.chips li {
  font: 400 11px/1 var(--serif);
  letter-spacing: 0.06em;
  color: var(--gray);
}

@media (max-width: 720px) {
  .post {
    gap: 26px;
  }

  .title {
    font-size: 25px;
  }

  .body :deep(p),
  .body :deep(li) {
    text-align: left;
  }

  .body :deep(h2) {
    font-size: 20px;
  }
}
</style>
