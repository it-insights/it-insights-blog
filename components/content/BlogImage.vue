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

const popoverId = useId()
const contentId = useId()
const imagePopover = ref<HTMLDialogElement | null>(null)
const imagecontent = ref<HTMLDialogElement | null>(null)

onMounted(() => {
  imagePopover.value = document.getElementById(popoverId) as HTMLDialogElement
  imagecontent.value = document.getElementById(contentId) as HTMLDialogElement
  onClickOutside(imagecontent, _event => closeModal())
})

function closeModal() {
  imagePopover.value?.hidePopover()
}
</script>

<template>
  <div class="flex justify-center">
    <button :popovertarget="popoverId">
      <NuxtImg
        :alt="alt"
        :src="src"
        fit="fill"
        sizes="100vw sm:50vw md:400px"
        class="mb-2 max-h-[500px] rounded-lg shadow-lg transition-[filter] dark:brightness-75 dark:hover:brightness-100"
      />
      <p v-if="alt || title" class="mt-0 text-center opacity-70">
        {{ title || alt }}
      </p>
    </button>
    <div :id="popoverId" popover="auto" class="transition-discrete popover-open:grid popover-open:opacity-100 starting:popover-open:opacity-0 size-full place-items-center justify-center bg-transparent p-0 opacity-0 backdrop-blur-lg transition-opacity ease-out">
      <div :id="contentId" class="max-w-[80%]">
        <div class="mx-auto flex h-10 items-center justify-between py-2 pl-3">
          <span class="text-xl font-bold">{{ title || alt }}</span>
          <button
            popovertarget="unocss-popover"
            class="size-6"
            @click="closeModal"
          >
            <UIcon name="i-carbon-close-outline" size="1.5rem" />
            <span class="sr-only">Close</span>
          </button>
        </div>
        <img
          :alt="alt"
          :src="src"
          class="mt-2 max-h-screen rounded-lg shadow-lg"
        >
      </div>
    </div>
  </div>
</template>
