<template>
  <div ref="viewbox" :class="{ viewbox: showSpriteViewbox }">
    <img ref="image" :src="spriteSource" alt="Sprite" />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, watchEffect, computed, Ref } from 'vue'
import { Sprite, SpriteArgs } from './Sprite'

type SpriteComponentProps = Omit<SpriteArgs, 'image' | 'viewbox'>

export interface SpriteRefs {
  image: HTMLImageElement
  viewbox: HTMLDivElement
  sprite: Sprite
}

export interface SpriteLoadedEvent {
  refs: SpriteRefs
}

export default defineComponent({
  emits: ['sprite-loaded'],
  props: {
    sprite: {
      type: Object as PropType<SpriteComponentProps>,
      required: true,
    },
    showViewbox: {
      type: Boolean,
      default: false,
    },
    src: {
      type: String,
      required: true,
    },
  },
  setup(props, { emit }) {
    const image = ref<HTMLImageElement | null>(null)
    const viewbox = ref<HTMLDivElement | null>(null)
    const sprite = ref<Sprite | null>(null)

    watchEffect(() => {
      if (!image.value || !viewbox.value) return

      sprite.value = new Sprite({
        ...props.sprite,
        image: image.value,
        viewbox: viewbox.value,
      })

      emit('sprite-loaded', {
        refs: {
          image: image.value,
          viewbox: viewbox.value,
          sprite: sprite.value,
        },
      } as SpriteLoadedEvent)
    })

    const showSpriteViewbox = computed(() => props.showViewbox)
    const spriteSource = computed(() => props.src)

    return {
      image,
      viewbox,
      showSpriteViewbox,
      spriteSource,
    }
  },
})
</script>

<style scoped>
.viewbox {
  background-color: #f00;
}
</style>
