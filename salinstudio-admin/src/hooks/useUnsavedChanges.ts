import { computed, onBeforeUnmount, onMounted, ref, type Ref } from "vue";
import { onBeforeRouteLeave } from "vue-router";

// Tracks whether `state` differs from the last saved snapshot and warns before
// leaving the page (route change or tab close) while there are unsaved edits.
export const useUnsavedChanges = <T>(state: Ref<T>) => {
  const saved = ref<string>(JSON.stringify(state.value));

  const isDirty = computed(() => JSON.stringify(state.value) !== saved.value);

  const markSaved = () => {
    saved.value = JSON.stringify(state.value);
  };

  const onBeforeUnload = (evt: BeforeUnloadEvent) => {
    if (isDirty.value) evt.preventDefault();
  };

  onMounted(() => window.addEventListener("beforeunload", onBeforeUnload));
  onBeforeUnmount(() =>
    window.removeEventListener("beforeunload", onBeforeUnload),
  );

  onBeforeRouteLeave(() => {
    if (!isDirty.value) return true;
    return window.confirm("You have unsaved changes. Leave anyway?");
  });

  return { isDirty, markSaved };
};
