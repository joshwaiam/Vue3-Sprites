import { gsap } from 'gsap'

export interface SpriteArgs {
  image: HTMLImageElement | null
  viewbox: HTMLDivElement | null
  columns: number
  rows: number
  frames: number
  frameWidth: number
  frameHeight: number
  offset: {
    left: number
    top: number
  }
  autostart?: boolean
  repeat?: boolean
  startFrame?: number
  timing?: number | false
  timings?: Array<number> | null
  onStart?: () => void
  onStop?: () => void
  onUpdate?: (progress: number) => void
  onComplete?: () => void
  onRepeat?: () => void
}

const DEFAULTS = {
  autostart: true,
  repeat: true,
  startFrame: 0,
  timing: 1,
  timings: null,
}

export class Sprite implements SpriteArgs {
  /** Image element pointing to the spritesheet. */
  image: SpriteArgs['image']
  /**
   * Container wrapping the spritesheet.
   * This allows us to limit visibility of the image
   * to a single frame.
   */
  viewbox: SpriteArgs['viewbox']
  /** Number of frames in a single row in the spritesheet. */
  columns: SpriteArgs['columns']
  /** Number of rows of frames in the spritesheet. */
  rows: SpriteArgs['rows']
  /** Total number of frames in the spritesheet. */
  frames: SpriteArgs['frames']
  /** Width of a single frame. */
  frameWidth: SpriteArgs['frameWidth']
  /** Height of a single frame. */
  frameHeight: SpriteArgs['frameHeight']
  /**
   * Number of pixels to the left and top of the image within the frame dimensions.
   * There is usually a certain amount of whitespace around the image.
   * This allows the trimming of it!
   */
  offset: SpriteArgs['offset']
  /** Whether the sprite should autostart. */
  autostart: SpriteArgs['autostart']
  /** Whether the sprite should repeat. */
  repeat: SpriteArgs['repeat']
  /** Which frame to start on. */
  startFrame: SpriteArgs['startFrame']
  /** Timing (in seconds) for each frame in the sprite. */
  timing: SpriteArgs['timing']
  /** Frame-specific timing (in seconds) for each frame in the sprite. */
  timings: SpriteArgs['timings']
  /** Function that runs on animation start. */
  onStart: SpriteArgs['onStart']
  /** Function that runs on animation stop. */
  onStop: SpriteArgs['onStop']
  /** Function that runs on animation update. */
  onUpdate: SpriteArgs['onUpdate']
  /** Function that runs on animation complete. */
  onComplete: SpriteArgs['onComplete']
  /** Function that runs on animation repeat. */
  onRepeat: SpriteArgs['onRepeat']

  /** GSAP animation timeline for the sprite. */
  private timeline: gsap.core.Timeline

  constructor({
    image,
    viewbox,
    columns,
    rows,
    frames,
    frameWidth,
    frameHeight,
    offset,
    autostart,
    repeat,
    startFrame,
    timing,
    timings,
    onStart,
    onStop,
    onUpdate,
    onComplete,
    onRepeat,
  }: SpriteArgs) {
    // Initialize properties
    this.image = image
    this.viewbox = viewbox
    this.columns = columns
    this.rows = rows
    this.frames = frames
    this.frameWidth = frameWidth
    this.offset = offset
    this.frameHeight = frameHeight
    this.autostart = autostart ?? DEFAULTS.autostart
    this.repeat = repeat ?? DEFAULTS.repeat
    this.startFrame = startFrame ?? DEFAULTS.startFrame
    this.timing = timing || DEFAULTS.timing
    this.timings = timings || DEFAULTS.timings
    this.onStart = onStart
    this.onStop = onStop
    this.onUpdate = onUpdate
    this.onComplete = onComplete
    this.onRepeat = onRepeat

    // Initialize GSAP timeline.
    this.timeline = gsap.timeline({
      paused: this.autostart,
      repeat: this.repeat ? -1 : 0,
      repeatDelay: 0,
      force3D: true,
    })

    if (!this.image || !this.viewbox) return

    // Adds .set() event for each tile in the spritesheet.
    // We use .set() to change tiles without animation.
    for (
      let tileIndex = this.startFrame;
      tileIndex < this.frames;
      tileIndex++
    ) {
      const duration =
        this.timings && this.timings[tileIndex]
          ? this.timings[tileIndex]
          : this.timing

      this.timeline.set(
        this.image,
        {
          x: (tileIndex % this.columns) * -this.frameWidth,
          y: Math.floor(tileIndex / this.columns) * -this.frameHeight,
        },
        (tileIndex / (this.frames - 1)) * duration
      )
    }

    // Remove the excess space in the container element
    // to prevent the image from overflowing.
    this.viewbox.style.width = `${this.frameWidth - this.offset.left * 2}px`
    this.viewbox.style.height = `${this.frameHeight - this.offset.top * 2}px`
    this.viewbox.style.overflow = 'hidden'

    // Set a negative margin to account for the around the image
    // in the frame dimensions via the offset.
    this.image.style.marginLeft = -this.offset.left + 'px'
    this.image.style.marginTop = -this.offset.top + 'px'

    // Add callbacks to our timeline where applicable
    if (this.onStart) this.timeline.eventCallback('onStart', this.onStart)
    if (this.onStop) this.timeline.eventCallback('onComplete', this.onStop)
    if (this.onUpdate) this.timeline.eventCallback('onUpdate', this.onUpdate)
    if (this.onComplete)
      this.timeline.eventCallback('onComplete', this.onComplete)
    if (this.onRepeat) this.timeline.eventCallback('onRepeat', this.onRepeat)
    if (this.autostart) this.play()
  }

  /** Restarts the animation from the startFrame. */
  play = () => this.timeline.restart()

  /** Pauses the animation. */
  stop = () => this.timeline.pause()
}
