<script setup lang="ts">
import { ref, onMounted } from "vue";
import { Button, InputText, ToggleSwitch, Divider, useToast } from "primevue";
import { getRequest, showRequestError } from "../utils/requests";
import { getTokens } from "../utils/tokens";
import axios from "axios";

const toast = useToast();
const loading = ref(true);
const savingStoreOpen = ref(false);
const savingCountries = ref(false);

const storeOpen = ref(false);
const allowedCountries = ref<string[]>([]);
const countryInput = ref("");
const countryError = ref("");

const endpoint = () => import.meta.env.VITE_ENDPOINT ?? "";
const authHeader = () => {
  const tokens = getTokens();
  return tokens ? { Authorization: "Bearer " + tokens.accessToken } : {};
};

onMounted(async () => {
  try {
    const data = await getRequest<Record<string, unknown>>("/settings", {
      accessToken: true,
    });
    storeOpen.value = data.store_open as boolean;
    allowedCountries.value = (data.allowed_countries as string[]) ?? [];
  } catch (err) {
    toast.add(showRequestError(err));
  } finally {
    loading.value = false;
  }
});

const handleStoreToggle = async () => {
  const next = !storeOpen.value;
  savingStoreOpen.value = true;
  try {
    await axios.put(
      endpoint() + "/settings/store-open",
      { value: next },
      { headers: authHeader() },
    );
    storeOpen.value = next;
    toast.add({
      group: "main",
      severity: "success",
      summary: next ? "Store is now open" : "Store is now closed",
      life: 3000,
    });
  } catch (err: any) {
    const message =
      err?.response?.data?.message ?? "Could not update store status";
    toast.add({ group: "main", severity: "error", summary: message, life: 5000 });
  } finally {
    savingStoreOpen.value = false;
  }
};

const isValidCountryCode = (code: string): boolean => {
  if (code.length !== 2) return false;
  try {
    const names = new Intl.DisplayNames(["en"], { type: "region" });
    const resolved = names.of(code.toUpperCase());
    return !!resolved && resolved !== code.toUpperCase();
  } catch {
    return false;
  }
};

const addCountry = () => {
  const code = countryInput.value.trim().toUpperCase();
  countryError.value = "";
  if (!code) return;
  if (!isValidCountryCode(code)) {
    countryError.value = `"${code}" is not a valid ISO 3166-1 alpha-2 country code`;
    return;
  }
  if (allowedCountries.value.includes(code)) {
    countryError.value = `${code} is already in the list`;
    return;
  }
  allowedCountries.value = [...allowedCountries.value, code];
  countryInput.value = "";
};

const removeCountry = (code: string) => {
  allowedCountries.value = allowedCountries.value.filter((c) => c !== code);
};

const countryLabel = (code: string): string => {
  try {
    const names = new Intl.DisplayNames(["en"], { type: "region" });
    return names.of(code) ?? code;
  } catch {
    return code;
  }
};

const saveCountries = async () => {
  savingCountries.value = true;
  try {
    await axios.put(
      endpoint() + "/settings/allowed_countries",
      { value: allowedCountries.value },
      { headers: authHeader() },
    );
    toast.add({
      group: "main",
      severity: "success",
      summary: "Shipping countries saved",
      life: 3000,
    });
  } catch (err) {
    toast.add(showRequestError(err));
  } finally {
    savingCountries.value = false;
  }
};
</script>

<template>
  <div class="flex flex-col gap-8 w-full max-w-xl">
    <h1 class="font-bold text-2xl">Settings</h1>

    <div v-if="loading" class="text-gray-400">Loading...</div>

    <template v-else>
      <section class="flex flex-col gap-4">
        <h2 class="font-semibold text-lg">Store</h2>
        <div class="flex items-center gap-3">
          <ToggleSwitch
            :model-value="storeOpen"
            :disabled="savingStoreOpen"
            @change="handleStoreToggle"
          />
          <span class="text-sm">
            {{ storeOpen ? "Open" : "Closed" }}
          </span>
        </div>
        <p class="text-xs text-surface-400">
          The store cannot be opened if there are no public items.
        </p>
      </section>

      <Divider />

      <section class="flex flex-col gap-4">
        <h2 class="font-semibold text-lg">Shipping countries</h2>
        <p class="text-xs text-surface-400">
          Only customers from these countries can purchase from the store.
          Enter a valid ISO 3166-1 alpha-2 code (e.g. FI, SE, DE).
        </p>

        <div class="flex flex-wrap gap-2">
          <div
            v-for="code in allowedCountries"
            :key="code"
            class="flex items-center gap-1 px-2 py-1 rounded text-sm border border-surface-700 bg-surface-800"
          >
            <span>{{ countryLabel(code) }} ({{ code }})</span>
            <button
              class="ml-1 text-surface-400 hover:text-surface-100 transition-colors"
              @click="removeCountry(code)"
            >
              <i class="pi pi-times" style="font-size: 0.65rem" />
            </button>
          </div>
          <span
            v-if="allowedCountries.length === 0"
            class="text-sm text-surface-500 italic"
          >
            No countries added — purchases will be blocked everywhere
          </span>
        </div>

        <div class="flex flex-col gap-1">
          <div class="flex gap-2">
            <InputText
              v-model="countryInput"
              placeholder="e.g. SE"
              maxlength="2"
              class="w-28 uppercase"
              @keydown.enter.prevent="addCountry"
            />
            <Button label="Add" severity="secondary" @click="addCountry" />
          </div>
          <small v-if="countryError" class="text-red-400">{{ countryError }}</small>
        </div>

        <Button
          label="Save countries"
          :loading="savingCountries"
          class="self-start"
          @click="saveCountries"
        />
      </section>
    </template>
  </div>
</template>
