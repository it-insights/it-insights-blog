<script setup lang="ts">
interface Props {
  src: string
  fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside'
  alt?: string
  title?: string
}

withDefaults(defineProps<Props>(), {
  fit: 'cover',
  alt: '',
})
</script>

<template>
  <img :src="src">
  <p
    v-if="alt || title"
    class="mt-0 text-center"
  >
    {{ title || alt }}
  </p>
</template>
