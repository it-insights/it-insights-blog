<script setup lang="ts">
// Content
const route = useRoute()
const page = ref(Number.parseInt(route.params.page as string) || 1)
const limit = ref(7)
const skip = computed(() => (page.value - 1) * limit.value)
const count = await queryContent().count()
const { data: posts } = await useAsyncData('index-posts', () => queryContent()
  .where({ _extension: 'md', author: { $ne: 'itinsights' } })
  .sort({ date: -1 })
  .skip(skip.value)
  .limit(limit.value)
  .find(), {
  watch: [page],
})

// SEO
useSeoMeta({
  titleTemplate: '',
  title: 'IT Insights',
  ogTitle: 'IT Insights',
  description: 'Knowledge Delivered',
  ogDescription: 'Knowledge Delivered',
})
const links = [{
  label: 'Azure Meetup',
  icon: 'i-simple-icons-meetup',
  to: 'https://www.meetup.com/azure-meetup-hamburg',
  target: '_blank',
}, {
  label: 'IT Insights GitHub',
  icon: 'i-simple-icons-github',
  to: 'https://github.com/it-insights',
  target: '_blank',
}, {
  label: 'Azure Blog',
  icon: 'i-simple-icons-microsoftazure',
  to: 'https://azure.microsoft.com/en-us/blog/',
  target: '_blank',
}]
</script>

<template>
  <UPage class="mx-auto max-w-5xl px-4 py-8 relative">
    <template #left>
      <UAside :links="links" />
    </template>
    <UBlogList orientation="horizontal" :ui="{ wrapper: 'lg:grid-cols-4' }">
      <UBlogPost
        v-for="(post, index) in posts"
        :key="index"
        :to="post._path"
        :title="post.title"
        :description="post.description"
        :image="post.image ? { src: post.image, alt: post.title } : { src: '/img/post_placeholder.jpg', alt: post.title }"
        :date="post.date ? new Date(post.date).toLocaleDateString('en', { year: 'numeric', month: 'short', day: 'numeric' }) : new Date()"
        :authors="[{ name: post.author || '', alt: post.author || '', avatar: { src: ['Jacob Meissner', 'Jan-Henrik Damaschke', 'Christoph Burmeister'].includes(post.author) ? `/img/${post.author.replace(' ', '-').toLowerCase().concat('', '-avatar.jpg')}` : undefined }, to: `/authors/${post.author.replace(' ', '-').toLowerCase()}` }]"
        :badge="{ label: Array.isArray(post.category) ? post.category.join(', ') : post.category.replace(',', ', ') }"
        orientation="vertical"
        :class="index === 0 ? 'col-span-full' : 'col-span-2'"
        :ui="{
          description: 'line-clamp-2',
        }"
      />
    </UBlogList>
    <UPagination
      v-model="page"
      :to="(page: number) => ({
        path: page === 1 ? '/' : `/page/${page}`,
      })"
      :total="count"
      size="sm"
      show-last
      show-first
      class="mt-8"
    />
  </UPage>
</template>
