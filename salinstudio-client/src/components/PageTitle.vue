<script setup lang="ts">
import { onMounted, onUnmounted, ref, useTemplateRef } from "vue";

defineProps<{ heading: string }>();

const playAnimation = ref<boolean>(false);
const containerWidth = ref<number>(0);
const headingWidth = ref<number>(0);

const containerRef = useTemplateRef("container-ref");
const headingRef = useTemplateRef("heading-ref");

const setAnimationState = () => {
  if (!headingRef.value) return;
  if (!containerRef.value) return;
  const currentContainerWidth = containerRef.value.offsetWidth;
  containerWidth.value = currentContainerWidth;
  const currentHeadingWidth = headingRef.value.offsetWidth;
  headingWidth.value = currentHeadingWidth;
  if (currentHeadingWidth > currentContainerWidth) {
    playAnimation.value = false;
    requestAnimationFrame(() => {
      playAnimation.value = true;
    });
  } else {
    playAnimation.value = false;
  }
};

let observer: ResizeObserver;

onMounted(async () => {
  await document.fonts.ready;

  observer = new ResizeObserver(() => {
    setAnimationState();
  });

  if (containerRef.value) {
    observer.observe(containerRef.value);
  }
});

onUnmounted(() => {
  observer.disconnect();
});
</script>

<template>
  <div class="container" ref="container-ref">
    <div
      :class="`marquee ${playAnimation && 'animate'}`"
      :style="{
        '--end-x': `-${headingWidth * 2}px`,
        gap: playAnimation ? `${containerWidth}px` : 0,
      }"
    >
      <h1 class="marquee-text" ref="heading-ref">
        {{ heading }}
      </h1>
      <h1 v-if="playAnimation" class="marquee-text">{{ heading }}</h1>
    </div>
  </div>
</template>

<style scoped>
.container {
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  position: relative;
  flex: 1;
}

.marquee {
  display: inline-flex;
  white-space: nowrap;
  width: 100%;
  justify-content: center;
}

.marquee.animate {
  animation: scroll-left 10s linear infinite;
}

.marquee-text {
  white-space: nowrap;
  color: #b4936f;
  font-size: 0.8rem;
  letter-spacing: 8px;
  text-transform: uppercase;
  text-align: center;
}

@media (min-width: 600px) {
  .marquee-text {
    font-size: 1rem;
  }
}

@media (min-width: 900px) {
  .marquee-text {
    font-size: 1.2rem;
  }
}

@keyframes scroll-left {
  0% {
    transform: translateX(0);
  }

  100% {
    transform: translateX(var(--end-x));
  }
}
</style>
