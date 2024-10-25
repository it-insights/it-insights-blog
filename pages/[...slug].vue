<script setup lang="ts">
import type { QueryBuilderParams, QueryBuilderWhere, SortFields } from '@nuxt/content/dist/runtime/types'
import { withoutTrailingSlash } from 'ufo'

interface QueryBuildCustomParams extends Omit<QueryBuilderParams, 'sort'> {
  where: QueryBuilderWhere
  sort: SortFields
}
const route = useRoute()
const appConfig = useAppConfig()
const { data: page } = await useAsyncData(route.path, () => queryContent(route.path).findOne())
if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}
const { data: surround } = await useAsyncData(`${route.path}-surround`, () => {
  return queryContent()
    .where({ _extension: 'md', navigation: { $ne: false } })
    .only(['title', 'description', '_path'])
    .findSurround(withoutTrailingSlash(route.path))
}, { default: () => [] })
const author = computed(() => appConfig.authors.find(author => author.name === page.value?.author))
const query: QueryBuildCustomParams = { path: '/', where: { author: page.value?.title }, limit: 6, sort: { date: -1 } }

// SEO
defineOgImage({
  component: 'ItInsights',
  title: page.value.title,
  description: page.value.description,
})
useContentHead(page)
</script>

<template>
  <UPage class="mx-auto max-w-5xl p-4 relative">
    <UPageHeader
      :title="page.title"
      class="py-4 sm:px-8"
    />

    <UPageBody
      prose
      class="mt-0 pb-12 sm:rounded sm:px-8"
    >
      <div v-if="page.body && page._dir === 'authors'">
        <BlogAuthor
          :author="author"
          :page="page"
        />
        <ProseH2 id="recent-articles">
          Recent articles
        </ProseH2>
        <ContentList
          v-slot="{ list }"
          :query="query"
        >
          <div class="flex flex-col gap-8 lg:grid lg:grid-cols-2">
            <UBlogPost
              v-for="(post, index) in list"
              :key="index"
              :to="post._path"
              :title="post.title"
              :description="post.description"
              :date="post.date ? new Date(post.date).toLocaleDateString('en', { year: 'numeric', month: 'short', day: 'numeric' }) : new Date()"
              :authors="[{ name: post.author || '', avatar: { alt: post.author || '', src: ['Jacob Meissner', 'Jan-Henrik Damaschke', 'Christoph Burmeister'].includes(post.author) ? `/img/${post.author.replace(' ', '-').toLowerCase().concat('', '-avatar.jpg')}` : undefined }, to: `/authors/${post.author.replace(' ', '-').toLowerCase()}` }]"
              :badge="{ label: Array.isArray(post.category) ? post.category.join(', ') : post.category.replace(',', ', ') }"
              orientation="vertical"
              :ui="{
                description: 'line-clamp-2',
                title: 'mt-0',
                wrapper: 'mb-8',
              }"
            />
          </div>
        </ContentList>
      </div>
      <div v-else-if="page.body">
        <div>
          <NuxtLink
            v-if="author.name !== 'itinsights'"
            :to="`/authors/${author.name.replace(' ', '-').toLowerCase()}`"
            class="mt-6 flex items-center justify-start gap-2 border-0 hover:no-underline"
          >
            <UAvatar
              :src="`/img/${author.picture ? author.picture.replace('.jpg', '-avatar.jpg') : 'logoiti.png'}`"
              :alt="author.name"
            />
            <span>{{ author.name }}</span>
          </NuxtLink>
        </div>
        <div class="mt-2 flex items-center justify-start gap-2">
          <UIcon
            name="i-heroicons-folder"
            class="size-5"
          />
          <span v-if="page.category">
            {{ Array.isArray(page.category) ? page.category.join(', ') : page.category.replace(',', ', ') }}
          </span>
          <UIcon
            name="i-heroicons-calendar-days"
            class="ml-2 size-5"
          />
          <span>
            {{ new Intl.DateTimeFormat(['en-US', 'de-DE'], {
              year: 'numeric',
              month: '2-digit',
              day:
                '2-digit',
            }).format(new Date(page.date)) }}
          </span>
        </div>

        <ContentRenderer :value="page" />
      </div>
      <UContentSurround
        v-if="author.name !== 'itinsights'"
        :surround="surround"
        class="mt-4"
      />
    </UPageBody>

    <template #right>
      <UContentToc
        :links="[...page.body.toc.links, (page._dir === 'authors') && { id: 'recent-articles', text: 'Recent articles' }]"
        class="sm:px-14"
        :ui="{ wrapper: 'bg-transparent' }"
      />
    </template>
  </UPage>
</template>
