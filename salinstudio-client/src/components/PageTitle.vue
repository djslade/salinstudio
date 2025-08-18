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
    playAnimation.value = true;
  }
};

onMounted(async () => {
  await document.fonts.ready;
  setAnimationState();
  document.addEventListener("resize", setAnimationState);
});

onUnmounted(() => {
  document.removeEventListener("resize", setAnimationState);
});
</script>

<template>
  <div class="container" ref="container-ref">
    <div
      :class="`marquee ${playAnimation && 'animate'}`"
      :style="{ '--end-x': `-${headingWidth * 2}px` }"
    >
      <h1
        class="marquee-text"
        :style="{ paddingRight: playAnimation ? `${containerWidth}px` : 0 }"
        ref="heading-ref"
      >
        {{ heading }}
      </h1>
      <h1 v-if="playAnimation" class="marquee-text clone">{{ heading }}</h1>
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

@keyframes scroll-left {
  0% {
    transform: translateX(0);
  }

  100% {
    transform: translateX(var(--end-x));
  }
}
</style>
