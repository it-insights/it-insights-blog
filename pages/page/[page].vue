<script setup lang="ts">
const route = useRoute()
const page = ref(Number.parseInt(route.params.page as string) || 1)
const limit = ref(6)
const skip = computed(() => (page.value - 1) * limit.value + 1)
const count = await queryContent().count()
const { sidebarLinks } = useSocialLinks()
const { data: posts } = await useAsyncData('posts', () => queryContent()
  .where({ _extension: 'md', author: { $ne: 'itinsights' } })
  .sort({ date: -1 })
  .skip(skip.value)
  .limit(limit.value)
  .find(), {
  watch: [page],
})
</script>

<template>
  <UPage class="mx-auto max-w-5xl px-4 py-8">
    <template #left>
      <UAside :links="sidebarLinks" />
    </template>
    <UBlogList orientation="horizontal" :ui="{ wrapper: 'lg:grid-cols-2' }">
      <UBlogPost
        v-for="(post, index) in posts"
        :key="index"
        :to="post._path"
        :title="post.title"
        :description="post.description"
        :date="post.date ? new Date(post.date).toLocaleDateString('en', { year: 'numeric', month: 'short', day: 'numeric' }) : new Date()"
        :authors="[{ name: post.author || '', avatar: { alt: post.author || '', src: ['Jacob Meissner', 'Jan-Henrik Damaschke', 'Christoph Burmeister'].includes(post.author) ? `/img/${post.author.replace(' ', '-').toLowerCase().concat('', '-avatar.jpg')}` : undefined }, to: `/authors/${post.author.replace(' ', '-').toLowerCase()}` }]"
        :badge="post.badge"
        orientation="vertical"
        :ui="{
          description: 'line-clamp-2',
        }"
      >
        <template #image>
          <NuxtImg preset="blogList" :src="post.image ? post.image : '/img/post_placeholder.jpg'" image :alt="post.title" class="size-full object-cover object-top transition-transform duration-200 group-hover:scale-105" />
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
      class="relative mt-8"
    />
  </UPage>
</template>
