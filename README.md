# Sprite README

This is a proof of concept for a Vue3 sprite component I was working on. **Note: This is not maintained and was only made as a proof of concept.**

## Demo
![Sprite demo](demo.gif)

## Usage

```typescript
<template>
  <div class="app-container">
    <SpriteComponent
      src="walk-to-right.png"
      :sprite="{
        columns: 7,
        rows: 3,
        frames: 18,
        frameWidth: 275,
        frameHeight: 275,
        offset: { left: 40, top: 40 },
        autostart: true,
        repeat: true,
        startFrame: 0,
        timing: 1,
      }"
      :show-viewbox="true"
      @sprite-loaded="onAssassinLoaded"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import SpriteComponent, {
  SpriteLoadedEvent,
  SpriteRefs,
} from '@/features/sprites/SpriteComponent.vue'

export default defineComponent({
  name: 'Home',
  components: { SpriteComponent },
  setup() {
    /** 
     * Stores the returned refs when the sprite is loaded. 
     * Will hold image, the viewbox containing the image,
     * and the Sprite instance.
     */
    const assassin = ref<SpriteRefs | null>(null)

    /** 
     * Receives the emitted event when the sprite is loaded. 
     * We can just assign the refs directly to our assassin variable.
     */
    const onAssassinLoaded = (event: SpriteLoadedEvent) =>
      (assassin.value = event.refs)

    return {
      onAssassinLoaded,
    }
  },
})
</script>

<style scoped>
.app-container {
  width: 100vw;
  height: 100vh;
  background-color: #0f0;
  padding: 0;
  margin: 0;
  overflow: hidden;
  position: relative;
  top: 0;
  left: 0;
}
</style>
```

## Sprite Component Props

### src

- Type: string
- Required: true
- Description: The path to the spritesheet image.

### @sprite-loaded

- Type: (event: SpriteLoadedEvent) => SpriteRefs
- Required: true
- Description: A callback that will be called when the sprite is loaded.

### show-viewbox

- Type: boolean
- Default: false
- Description: Whether or not to show the viewbox around the sprite.

### sprite

- Type: SpriteProps
- Description
  - columns: Number of frames in a single row in the spritesheet.
  - rows: Number of rows of frames in the spritesheet.
  - frames: Total number of frames in the spritesheet.
  - frameWidth: Width of a single frame.
  - frameHeight: Height of a single frame.
  - offset: Number of pixels to the left and top of the image within the frame dimensions. There is usually a certain amount of whitespace around the image. This allows the trimming of it!
  - (_optional_) autostart:  Whether or not to start the animation automatically.
  - (_optional_) repeat: Whether or not to repeat the animation.
  - (_optional_) startFrame: The frame to start the animation at.
  - (_optional_) timing: The speed of the animation.
  - (_optional_) timings: The speed of each frame in the animation.
  - (_optional_) onStart: A callback that will be called when the animation starts.
  - (_optional_) onStop: A callback that will be called when the animation stops.
  - (_optional_) onUpdate: A callback that will be called when the animation updates.
  - (_optional_) onComplete: A callback that will be called when the animation is complete.
  - (_optional_) onRepeat: A callback that will be called when the animation repeats.

## Sprite Defaults

```typescript
const DEFAULTS = {
  autostart: true,
  repeat: true,
  startFrame: 0,
  timing: 1,
  timings: null,
}
```
