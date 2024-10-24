<script setup lang="ts">
import type { PageLink } from '@nuxt/ui-pro/types'

interface Author {
  name: string
  picture: string
  socials: {
    twitter: string
    linkedIn: string
  }
  company: {
    name: string
    url: string
    position: string
  }
  description: string
  certification: string[]
}

const { author, page } = defineProps<{ page: Record<string, unknown>; author: Author }>()

const socialLinks = computed(() => [
  author.socials.twitter && { icon: 'i-simple-icons-x', label: author.socials.twitter, to: `https://x.com/${author.socials.twitter}`, target: '_blank' },
  author.socials.linkedIn && { icon: 'i-simple-icons-linkedin', label: author.socials.linkedIn, to: `https://www.linkedin.com/in/${author.socials.linkedIn}`, target: '_blank' },
])
</script>

<template>
  <div class="py-6">
    <div class="flex gap-8">
      <div class="relative size-28 overflow-hidden rounded-full">
        <NuxtImg
          class="my-0 object-contain"
          :src="`img/${author.picture}`"
          width="200"
          height="200"
        />
      </div>
      <div class="flex flex-col gap-2">
        <span class="font-bold">
          {{ author.company.position || '' }}
          <NuxtLink :to="author.company.url" class="ml-1">
            @{{ author.company.name || '' }}
          </NuxtLink>
        </span>
        <UPageLinks :links="socialLinks as PageLink[]" class="mb-2" :ui="{ inactive: 'border-0' }" />
      </div>
    </div>
    <ContentRenderer :value="page" />
  </div>
</template>
