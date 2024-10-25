<script setup lang="ts">
defineOptions({
  inheritAttrs: false,
})

const { title, description } = defineProps<{ description: string; title: string }>()
const truncateString = (input: string, maxLength: number): string => input.length <= maxLength ? input : `${input.slice(0, input.slice(0, maxLength).lastIndexOf(' '))}...`;
</script>

<template>
  <div class="flex size-full flex-col justify-start bg-slate-900 p-16 text-center">
    <div class="flex justify-between text-left">
      <div>
        <p class="text-3xl font-bold leading-tight text-white">
          <span class="pr-1 text-blue-300">IT Insights</span>Blog
        </p>
        <h1 class="mb-6 w-[900px] text-6xl text-white">
          {{ title }}
        </h1>
      </div>
      <img src="/img/itinsights-logo-small.png" class="size-40">
    </div>
    <div class="relative">
      <p class="max-w-[75%] text-left text-4xl leading-tight text-zinc-200">
        {{ truncateString(description, 130) }}
      </p>
    </div>
  </div>
</template>
