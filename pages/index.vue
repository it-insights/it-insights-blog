<script setup lang="ts">
// Content
const route = useRoute()
const page = ref(Number.parseInt(route.params.page as string) || 1)
const limit = ref(7)
const skip = computed(() => (page.value - 1) * limit.value)
const count = await queryContent().count()
const { sidebarLinks } = useSocialLinks()
const { data: indexPosts } = await useAsyncData('index-posts', () => queryContent()
  .where({ _extension: 'md', author: { $ne: 'itinsights' } })
  .sort({ date: -1 })
  .skip(skip.value)
  .limit(limit.value)
  .find()
)

// SEO
useSeoMeta({
  titleTemplate: '',
  title: 'IT Insights',
  ogTitle: 'IT Insights',
  description: 'Knowledge Delivered',
  ogDescription: 'Knowledge Delivered',
})
</script>

<template>
  <UPage class="relative mx-auto max-w-5xl px-4 py-8">
    <template #left>
      <UAside :links="sidebarLinks" />
    </template>
    <UBlogList orientation="horizontal" :ui="{ wrapper: 'lg:grid-cols-4' }">
      <UBlogPost
        v-for="(post, index) in indexPosts"
        :key="index"
        :to="post._path"
        :title="post.title"
        :description="post.description"
        :date="post.date ? new Date(post.date).toLocaleDateString('en', { year: 'numeric', month: 'short', day: 'numeric' }) : new Date()"
        :authors="[{ name: post.author || '', avatar: { alt: post.author || '', src: ['Jacob Meissner', 'Jan-Henrik Damaschke', 'Christoph Burmeister'].includes(post.author) ? `/img/${post.author.replace(' ', '-').toLowerCase().concat('', '-avatar.jpg')}` : undefined }, to: `/authors/${post.author.replace(' ', '-').toLowerCase()}` }]"
        :badge="{ label: Array.isArray(post.category) ? post.category.join(', ') : post.category.replace(',', ', ') }"
        orientation="vertical"
        :class="index === 0 ? 'col-span-full' : 'col-span-2'"
        :ui="{
          description: 'line-clamp-2',
        }"
      >
        <template #image>
          <NuxtImg :preset="index === 0 ? '' : 'blogList'" :src="post.image ? post.image : '/img/post_placeholder.jpg'" image :alt="post.title" class="size-full object-cover object-top transition-transform duration-200 group-hover:scale-105" />
        </template>
      </UBlogPost>
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
