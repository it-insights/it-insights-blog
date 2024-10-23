<script setup lang="ts">
import type { NavItem } from '@nuxt/content'

const { data: navigation } = await useAsyncData('navigation', () => fetchContentNavigation())
// const { data: files } = useLazyFetch<ParsedContent[]>('/api/search.json', { default: () => [], server: false })
const { data: files } = await useAsyncData('search', () => {
  return queryContent()
    .where({ _extension: 'md', navigation: { $ne: false } })
    .only(['title', 'description', '_path', '_id', 'body'])
    .find()
}, { default: () => [] })

const headerLinks = [{
  label: 'Home',
  icon: 'i-heroicons-book-open',
  to: '/',
}, {
  label: 'Talks',
  icon: 'i-heroicons-rocket-launch',
  to: 'https://github.com/it-insights/Talks',
  target: '_blank',
}]

const footerLinks = [{
  label: 'Talks',
  to: 'https://github.com/it-insights/Talks',
}]

provide('navigation', navigation)
provide('files', files)

// SEO

useHead({
  title: 'IT Insights',
  meta: [
    { name: 'IT Insights blog', content: 'IT Insights blog' },
  ],
})

useSeoMeta({
  titleTemplate: `%s - IT Insights`,
  ogSiteName: 'IT Insights',
  ogImage: 'https://itinsights.org/social-card.png',
  twitterImage: 'https://itinsights.org/social-card.png',
  twitterCard: 'summary_large_image',
})
</script>

<template>
  <NuxtLoadingIndicator />
  <svg id="visual" class="fixed inset-0 size-full rotate-180 opacity-10 dark:opacity-5" viewBox="0 0 1200 800" width="1200" height="800" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1"><defs><filter id="blur1" x="-10%" y="-10%" width="120%" height="120%"><feFlood flood-opacity="0" result="BackgroundImageFix" /><feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" /><feGaussianBlur stdDeviation="214" result="effect1_foregroundBlur" /></filter></defs><g filter="url(#blur1)"><circle cx="1075" cy="644" fill="#52aadb" r="476" /><circle cx="203" cy="474" fill="#18181b" r="476" /><circle cx="584" cy="581" fill="#52aadb" r="476" /><circle cx="152" cy="32" fill="#52aadb" r="476" /><circle cx="491" cy="355" fill="#18181b" r="476" /><circle cx="216" cy="733" fill="#52aadb" r="476" /></g></svg>
  <UHeader :links="headerLinks">
    <template #logo>
      <NuxtImg
        src="/img/itinsights-logo-small.png"
        alt="IT Insights"
        width="50"
      />
      <span class="pl-2 align-top font-semibold">
        IT Insights
      </span>
    </template>

    <template #right>
      <UContentSearchButton
        label="Search..."
        size="sm"
        class="max-w-44"
      />

      <UColorModeButton />

      <UButton
        to="https://github.com/it-insights"
        target="_blank"
        icon="i-simple-icons-github"
        color="gray"
        variant="ghost"
      />
    </template>

    <template #panel>
      <UContentSearchButton
        size="md"
        class="mb-4 w-full"
      />
      <UNavigationTree :links="mapContentNavigation(navigation)" />
    </template>
  </UHeader>

  <UMain>
    <NuxtPage />
  </UMain>

  <UFooter :links="footerLinks">
    <template #left>
      Copyright © {{ new Date().getFullYear() }}
    </template>

    <template #right>
      <UButton
        icon="i-simple-icons-x"
        color="gray"
        variant="ghost"
        to="https://x.com/itinsights_"
        target="_blank"
      />
      <UButton
        icon="i-simple-icons-discord"
        color="gray"
        variant="ghost"
        to="https://discord.gg/QakdtpQW"
        target="_blank"
      />
      <UButton
        icon="i-simple-icons-github"
        color="gray"
        variant="ghost"
        to="https://github.com/itinsights"
        target="_blank"
      />
    </template>
  </UFooter>

  <ClientOnly>
    <LazyUContentSearch
      :files="files"
      :navigation="navigation as NavItem[]"
      :links="headerLinks"
    />
  </ClientOnly>
</template>
