<script lang="ts" setup>
import { computed } from 'vue'
import { lang } from '../composables/useLang'
import { postsIn } from '../composables/usePosts'
import { content } from '../data/content'

const d = computed(() => content[lang.value])
const posts = computed(() => postsIn(lang.value))
</script>

<template>
  <div class="blog">
    <div class="masthead">
      <h1 class="title">{{ d.blog.title }}</h1>
      <p class="blurb">{{ d.blog.blurb }}</p>
    </div>

    <p v-if="posts.length === 0" class="empty">{{ d.empty }}</p>

    <!-- A post is its title and its date. Nothing else belongs in this list. -->
    <ol v-else class="list">
      <li v-for="post in posts" :key="post.slug">
        <RouterLink class="row" :to="`/blog/${post.slug}`">
          <span class="head">{{ post.title }}</span>
          <span class="dates">{{ post.dates }}</span>
        </RouterLink>
      </li>
    </ol>
  </div>
</template>

<style scoped>
.blog {
  display: flex;
  flex-direction: column;
  gap: 48px;
  animation: omRise 0.5s var(--ease) both;
}

.masthead {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.title {
  margin: 0;
  font: 400 30px/1.15 var(--serif);
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.blurb {
  margin: 0;
  max-width: 440px;
  font: 400 13.5px/1.8 var(--serif);
}

.empty {
  margin: 0;
  font: 400 13.5px/1.7 var(--serif);
  color: var(--gray);
  font-style: italic;
}

.list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 24px;
  padding: 14px 2px;
}

.head {
  font: 400 18px/1.35 var(--serif);
  transition: color 0.3s ease;
}

/* The row does not move; only the title greys out under the cursor. */
.row:hover .head {
  color: var(--gray);
}

.dates {
  font: 400 10.5px/1 var(--serif);
  font-feature-settings: 'tnum';
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--gray);
  white-space: nowrap;
}

@media (max-width: 720px) {
  .blog {
    gap: 36px;
  }

  .title {
    font-size: 24px;
  }
}
</style>
