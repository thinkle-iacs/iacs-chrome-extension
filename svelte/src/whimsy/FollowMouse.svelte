<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import App from "../App.svelte";
  export let speed = 7;
  export let onClick;
  type Prefs = {
    speedJitter?: number;
    speedJitterProb?: number;
    targetJitter?: number;
    targetJitterProb?: number;
    updateDelay?: number;
    maxSpeed?: number;
    minSpeed?: number;
    rotate?: boolean;
    randomTargetResetThreshhold?: number;
    lockXPos: false;
    lockYPos: false;
    flipX: false;
    flipY: false;
  };

  export let prefs: Prefs = {
    updateDelay: 500,
  };

  export let x: number = -50;
  export let y: number = -50;
  let transform = "";

  class MouseFollower {
    public x: number;
    public y: number;
    private targetX: number;
    private targetY: number;
    private lastMoved: number;
    private speed: number;
    private animating: boolean;
    private timeout: number;
    public prefs: Prefs;
    public angle: number;
    public transform: string;

    constructor(speed: number, prefs?: any) {
      this.prefs = prefs || {};
      this.x = x; // Initial position
      this.y = y;
      this.targetX = this.x;
      this.targetY = this.y;
      this.lastMoved = new Date().getTime();
      this.speed = speed;
      this.animating = true;
      this.transform = "";
      this.initialize();
    }

    private initialize() {
      // Attach mousemove event listener to track mouse movement

      // Start the animation loop
      this.animate();
    }

    public handleMouseMove(event: MouseEvent) {
      if (this.timeout) {
        clearTimeout(this.timeout);
      }
      this.timeout = setTimeout(() => {
        this.targetX = event.clientX;
        this.targetY = event.clientY;
        this.lastMoved = new Date().getTime();
      }, this.prefs.updateDelay || 300);
    }

    private animate() {
      if (this.animating) {
        // Calculate the object's new position
        const deltaTime = new Date().getTime() - this.lastMoved;

        let deltaX = this.targetX - this.x;
        let deltaY = this.targetY - this.y;
        let distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        let vx = this.speed * (deltaX / distance);
        let vy = this.speed * (deltaY / distance);
        // Check if we're overshooting...
        if (Math.abs(vx) > Math.abs(deltaX)) {
          vx = deltaX / 2;
        }
        if (Math.abs(vy) > Math.abs(deltaY)) {
          vy = deltaY / 2;
        }

        if (vx && vy) {
          transform = "";
          if (this.prefs.rotate) {
            this.angle = Math.atan2(vy, vx);
            transform = `rotate(${((this.angle * 180) / Math.PI).toFixed(
              1
            )}deg)`;
          }
          if (this.prefs.flipX && vx < 0) {
            transform += "scaleX(-1)";
          }
          if (this.prefs.flipY && vy < 0) {
            transform += "scaleY(-1)";
          }
          if (!prefs.lockXPos) {
            this.x = this.x + vx;
          }
          if (!prefs.lockYPos) {
            this.y = this.y + vy;
          }
          x = this.x;
          y = this.y;
          // wrap around screen and stuff
          while (x < 0) {
            x = window.innerWidth - x;
          }
          while (y < 0) {
            y = window.innerHeight - y;
          }
          x = x % window.innerWidth;
          y = y % window.innerHeight;
        }
        this.introduceTargetJitter();
        this.introduceSpeedJitter();
        this.introduceRandomTargetReset();
        requestAnimationFrame(this.animate.bind(this));
      }
    }
    private introduceSpeedJitter() {
      let speedJitter = (this.prefs.speedJitter || 5) / 60;
      let speedJitterProb = this.prefs.speedJitterProb || 0.1;
      if (Math.random() < speedJitterProb) {
        this.speed += Math.random() * speedJitter - speedJitter / 2;
      }
      if (this.speed > this.prefs.maxSpeed || 30) {
        this.speed = (this.prefs.maxSpeed || 30) / 60;
      }
      if (this.speed < 0) {
        this.speed = (Math.random() * 1) / 60;
      }
    }

    private introduceTargetJitter() {
      let jitterAmount = this.prefs.targetJitter || 30;
      let jitterProb = this.prefs.targetJitterProb || 0.1;
      if (Math.random() < jitterProb) {
        this.targetX += Math.random() * jitterAmount - jitterAmount / 2;
      }
      if (Math.random() < jitterProb) {
        this.targetY += Math.random() * jitterAmount - jitterAmount / 2;
      }
    }
    private introduceRandomTargetReset() {
      let timeGap = new Date().getTime() - this.lastMoved;
      let threshhold = this.prefs.randomTargetResetThreshhold || 3500;
      if (timeGap > threshhold) {
        this.targetX = window.innerWidth * Math.random();
        this.targetY = window.innerHeight * Math.random();
        console.log("Randomly decide to go to", this.targetX, this.targetY);
        this.lastMoved = new Date().getTime();
      }
    }

    public destroy() {
      this.animating = false;
    }
  }

  // Create an instance of the MouseFollower class
  let mouseFollower = {
    x: -1000,
    y: -1000,
    destroy: () => {},
    handleMouseMove: () => {},
  };
  onDestroy(() => mouseFollower.destroy());
  onMount(() => {
    mouseFollower = new MouseFollower(speed / 60, prefs);
    mouseFollower.animate();
  });
  // To destroy the object and remove the event listener when needed, you can call:
  // mouseFollower.destroy();
</script>

<svelte:window on:mousemove={(e) => mouseFollower.handleMouseMove(e)} />

<div
  style:transform
  data-transform={transform}
  style:left={`${x.toFixed(0)}px`}
  style:top={`${y.toFixed(0)}px`}
  on:click={() => {
    if (onClick) {
      let result = onClick();
      if (result) {
        return;
      } // return true to not toggle animation...
    }
    mouseFollower.animating = !mouseFollower.animating;
    if (mouseFollower.animating) {
      mouseFollower.animate();
    }
  }}
>
  <slot />
</div>

<style>
  div {
    position: fixed;
    place-content: center;
    display: grid;
    width: 80px;
    height: 80px;
    border-radius: 50%;
    text-align: center;
  }
</style>
