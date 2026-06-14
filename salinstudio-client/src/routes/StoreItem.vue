<script setup lang="ts">
import Header from "../components/Header.vue";
import Footer from "../components/Footer.vue";
import Loader from "../components/Loader.vue";
import OpacityTransition from "../components/OpacityTransition.vue";
import PanelHeading from "../components/PanelHeading.vue";
import { useLanguageStore } from "../store/language";
import { useImageStore } from "../store/images";
import { useSeo } from "../hooks/useSeo";
import { useQuery } from "@tanstack/vue-query";
import axios, { AxiosError } from "axios";
import { useRoute, useRouter } from "vue-router";
import { onMounted, ref, watch } from "vue";
import type { StoreItem } from "../types/storeItem";

const route = useRoute();
const router = useRouter();
const language = useLanguageStore();
const images = useImageStore();

const pageReady = ref(false);
const buying = ref(false);
const buyError = ref(false);
const soldOutError = ref(false);
const selectedImageIndex = ref(0);
const purchaseAllowed = ref(true);

const { data: publicSettings } = useQuery({
  queryKey: ["publicSettings"],
  queryFn: async () => {
    const res = await axios.get(`${import.meta.env.VITE_SERVER_ENDPOINT}/settings/public`);
    return res.data as { storeOpen: boolean; allowedCountries: string[]; userCountry: string | null };
  },
  staleTime: 60_000,
});

watch(publicSettings, (settings) => {
  if (!settings) return;
  const { allowedCountries, userCountry } = settings;
  if (userCountry && !allowedCountries.includes(userCountry)) {
    purchaseAllowed.value = false;
  }
}, { immediate: true });

const { data } = useQuery({
  queryKey: [`storeItem.${route.params.id}`],
  queryFn: async () => {
    const res = await axios.get(
      `${import.meta.env.VITE_SERVER_ENDPOINT}/purchasable/nano/${route.params.id}`,
    );
    return res.data.purchasable as StoreItem;
  },
  retry: (failureCount, err: AxiosError) => {
    if (err.status === 404) {
      router.replace({
        name: "NotFound",
        params: { pathMatch: route.path.substring(1).split("/") },
        query: route.query,
        hash: route.hash,
      });
      return false;
    }
    return failureCount <= 3;
  },
});

useSeo({
  title: () =>
    data.value
      ? `${language.isEn() ? data.value.titleEn : data.value.titleFi} - Miia Salin`
      : undefined,
  description: () =>
    data.value
      ? language.isEn()
        ? data.value.infoEn
        : data.value.infoFi
      : undefined,
  imageUrl: () =>
    data.value
      ? data.value.images[0]?.desktopUrl || data.value.art.image.desktopUrl
      : undefined,
});

const onPageLoad = async (item?: StoreItem) => {
  if (!item) return;

  const imageUrl = item.images[0]?.desktopUrl || item.art.image.desktopUrl;
  await images.preloadAndSet(imageUrl);

  pageReady.value = true;
};

onMounted(async () => await onPageLoad(data.value));
watch(data, async (item) => await onPageLoad(item));

const handleBuy = async () => {
  if (buying.value || !data.value) return;
  buying.value = true;
  buyError.value = false;
  soldOutError.value = false;
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_SERVER_ENDPOINT}/stripe/checkout-session`,
      { nanoId: data.value.nanoId, locale: route.params.locale || "" },
    );
    window.location.href = res.data.url;
  } catch (err) {
    if (err instanceof AxiosError && err.response?.status === 422) {
      soldOutError.value = true;
    } else {
      buyError.value = true;
    }
    buying.value = false;
  }
};

const formatPrice = (price: number) =>
  Intl.NumberFormat("fi-FI", { style: "currency", currency: "eur" }).format(price);

const formatDimensions = (item: StoreItem) => `${item.height} × ${item.width} cm`;
</script>

<template>
  <div class="page">
    <Header
      position="sticky"
      :heading="data ? (language.isEn() ? data.titleEn : data.titleFi) : ''"
      current-route="Store"
    />
    <main>
      <OpacityTransition mode="default">
        <div v-if="pageReady && data" class="item-outer">
          <div class="item-panel">
            <div class="item-images">
              <div class="item-main-image-container">
                <img
                  :src="data.images[selectedImageIndex]?.desktopUrl || data.art.image.desktopUrl"
                  :alt="language.isEn() ? data.titleEn : data.titleFi"
                  class="item-main-image"
                />
              </div>
              <div v-if="data.images.length > 1" class="item-thumbnails">
                <button
                  v-for="(img, idx) in data.images"
                  :key="idx"
                  class="item-thumb-btn"
                  :class="{ 'is-active': selectedImageIndex === idx }"
                  @click="selectedImageIndex = idx"
                >
                  <img
                    :src="img.thumbUrl"
                    :alt="`${language.isEn() ? data.titleEn : data.titleFi} ${idx + 1}`"
                    class="item-thumb-img"
                  />
                </button>
              </div>
            </div>

            <div class="item-info">
              <PanelHeading
                :text="language.isEn() ? data.titleEn : data.titleFi"
                textAlign="left"
              />

              <div class="item-badges">
                <span v-if="data.isOriginal" class="badge">
                  {{ language.isEn() ? "Original" : "Alkuperäinen" }}
                </span>
                <span v-if="data.isFramed" class="badge">
                  {{ language.isEn() ? "Framed" : "Kehystetty" }}
                </span>
                <span v-if="data.isOnSale" class="badge badge-sale">
                  {{ language.isEn() ? "On Sale" : "Alennuksessa" }}
                </span>
              </div>

              <div class="item-price-row">
                <span class="item-price">{{ formatPrice(data.currentPrice) }}</span>
                <span v-if="data.isOnSale && data.maxPrice > data.currentPrice" class="item-price-original">
                  {{ formatPrice(data.maxPrice) }}
                </span>
              </div>

              <div class="item-meta">
                <div class="item-meta-row">
                  <span class="item-meta-label">{{ language.isEn() ? "Technique" : "Tekniikka" }}</span>
                  <span class="item-meta-value">{{ language.isEn() ? data.techniqueEn : data.techniqueFi }}</span>
                </div>
                <div class="item-meta-row">
                  <span class="item-meta-label">{{ language.isEn() ? "Dimensions" : "Mitat" }}</span>
                  <span class="item-meta-value">{{ formatDimensions(data) }}</span>
                </div>
                <div class="item-meta-row">
                  <span class="item-meta-label">{{ language.isEn() ? "Year" : "Vuosi" }}</span>
                  <span class="item-meta-value">{{ data.year }}</span>
                </div>
                <div class="item-meta-row">
                  <span class="item-meta-label">{{ language.isEn() ? "Available" : "Saatavilla" }}</span>
                  <span class="item-meta-value">{{ data.quantity }}</span>
                </div>
              </div>

              <div v-if="data.infoEn || data.infoFi" class="item-description">
                <p class="item-description-text">{{ language.isEn() ? data.infoEn : data.infoFi }}</p>
              </div>

              <div class="item-cta">
                <button
                  class="buy-btn"
                  :disabled="buying || data.quantity < 1 || !purchaseAllowed"
                  @click="handleBuy"
                >
                  <span v-if="buying">{{ language.isEn() ? "Redirecting..." : "Ohjataan..." }}</span>
                  <span v-else-if="data.quantity < 1">{{ language.isEn() ? "Sold Out" : "Loppunut" }}</span>
                  <span v-else-if="!purchaseAllowed">{{ language.isEn() ? "Not available in your region" : "Ei saatavilla alueellasi" }}</span>
                  <span v-else>{{ language.isEn() ? "Buy Now" : "Osta nyt" }}</span>
                </button>
                <span v-if="soldOutError" class="buy-error">
                  {{ language.isEn() ? "This item is no longer available." : "Tämä tuote ei ole enää saatavilla." }}
                </span>
                <span v-else-if="buyError" class="buy-error">
                  {{ language.isEn() ? "Something went wrong. Please try again." : "Jokin meni pieleen. Yritä uudelleen." }}
                </span>
              </div>

              <button class="back-btn" @click="$router.push({ name: 'Store', params: { locale: $route.params.locale } })">
                ← {{ language.isEn() ? "Back to store" : "Takaisin kauppaan" }}
              </button>
            </div>
          </div>
        </div>
      </OpacityTransition>
      <Loader v-if="!pageReady" />
    </main>
    <Footer position="static" />
  </div>
</template>

<style scoped>
.page {
  position: relative;
  min-height: 100vh;
  min-height: 100dvh;
}

.item-outer {
  display: flex;
  justify-content: center;
  padding: 2rem 1rem 4rem;
  min-height: calc(100vh - 10rem);
  min-height: calc(100dvh - 10rem);
  align-items: center;
}

.item-panel {
  display: flex;
  flex-direction: column;
  gap: 3rem;
  width: 100%;
  max-width: 1200px;
}

.item-images {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.item-main-image-container {
  width: 100%;
  display: flex;
  justify-content: center;
}

.item-main-image {
  max-width: 100%;
  max-height: 60vh;
  object-fit: contain;
  border-radius: 8px;
  filter: sepia(20%);
}

.item-thumbnails {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.item-thumb-btn {
  border: 2px solid transparent;
  padding: 0;
  background: none;
  cursor: pointer;
  border-radius: 4px;
  overflow: hidden;
  transition: border-color 0.2s;
}

.item-thumb-btn.is-active {
  border-color: #b4936f;
}

.item-thumb-img {
  width: 4rem;
  height: 4rem;
  object-fit: cover;
  filter: sepia(20%);
  display: block;
}

.item-info {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.item-badges {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.badge {
  border: 1px solid #b4936f;
  color: #b4936f;
  padding: 0.2rem 0.6rem;
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  border-radius: 4px;
  font-family: sans-serif;
}

.badge-sale {
  background-color: #b4936f;
  color: #261f19;
}

.item-price-row {
  display: flex;
  align-items: baseline;
  gap: 1rem;
}

.item-price {
  font-size: 1.6rem;
  color: #d0bfad;
  font-weight: 700;
  letter-spacing: 2px;
}

.item-price-original {
  font-size: 1rem;
  color: #6b5a4a;
  text-decoration: line-through;
  font-family: sans-serif;
}

.item-meta {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  border-top: 1px solid rgba(208, 191, 173, 0.15);
  padding-top: 1rem;
}

.item-meta-row {
  display: flex;
  gap: 1rem;
  font-family: sans-serif;
  font-size: 0.85rem;
  letter-spacing: 1px;
}

.item-meta-label {
  color: #b4936f;
  text-transform: uppercase;
  min-width: 8rem;
  font-size: 0.75rem;
  letter-spacing: 2px;
}

.item-meta-value {
  color: #d0bfad;
}

.item-description {
  border-top: 1px solid rgba(208, 191, 173, 0.15);
  padding-top: 1rem;
  max-height: 14rem;
  overflow-y: auto;
  padding-right: 0.5rem;
}

.item-description-text {
  color: #d0bfad;
  line-height: 1.7;
  letter-spacing: 2px;
  font-family: sans-serif;
  font-size: 0.8rem;
  white-space: pre-wrap;
}

@media (min-width: 600px) {
  .item-description-text {
    font-size: 0.9rem;
  }
}

.item-cta {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.buy-btn {
  background-color: transparent;
  border: 1px solid #b4936f;
  color: #d0bfad;
  padding: 1rem 2rem;
  border-radius: 8px;
  max-width: 320px;
  width: 100%;
  text-transform: uppercase;
  letter-spacing: 3px;
  cursor: pointer;
  transition: background-color 0.3s, opacity 0.3s;
  font-weight: 700;
  font-size: 0.8rem;
}

.buy-btn:hover:not(:disabled) {
  background-color: #b4936f;
}

.buy-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.buy-error {
  font-family: sans-serif;
  font-size: 0.8rem;
  color: #b4936f;
  letter-spacing: 1px;
}

.back-btn {
  background: none;
  border: none;
  color: #6b5a4a;
  font-family: sans-serif;
  font-size: 0.8rem;
  letter-spacing: 2px;
  cursor: pointer;
  text-transform: uppercase;
  padding: 0;
  transition: color 0.2s;
  text-align: left;
}

.back-btn:hover {
  color: #d0bfad;
}

@media (min-width: 900px) {
  .item-description-text {
    font-size: 1rem;
  }

  .item-outer {
    height: calc(100vh - 10rem);
    height: calc(100dvh - 10rem);
    align-items: stretch;
    overflow: hidden;
  }

  .item-panel {
    flex-direction: row;
    align-items: stretch;
    gap: 4rem;
    height: 100%;
  }

  .item-images {
    flex: 1;
    overflow: hidden;
  }

  .item-main-image-container {
    flex: 1;
    min-height: 0;
  }

  .item-main-image {
    max-height: 100%;
  }

  .item-thumbnails {
    margin-top: auto;
    flex-shrink: 0;
  }

  .item-info {
    flex: 1;
    padding-top: 1rem;
    overflow: hidden;
  }

  .item-description {
    flex: 1;
    min-height: 0;
    max-height: unset;
  }

  .item-cta {
    flex-shrink: 0;
  }
}
</style>
