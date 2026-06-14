<script setup lang="ts">
import Header from "../components/Header.vue";
import Footer from "../components/Footer.vue";
import Loader from "../components/Loader.vue";
import OpacityTransition from "../components/OpacityTransition.vue";
import PanelHeading from "../components/PanelHeading.vue";
import PanelParagraph from "../components/PanelParagraph.vue";
import { useLanguageStore } from "../store/language";
import { useMetadata } from "../hooks/useMetadata";
import { useQuery } from "@tanstack/vue-query";
import axios, { AxiosError } from "axios";
import { useRoute, useRouter } from "vue-router";
import { onMounted, ref, watch } from "vue";
import type { StoreItem } from "../types/storeItem";

const route = useRoute();
const router = useRouter();
const language = useLanguageStore();
const { setMetadata } = useMetadata();

const pageReady = ref(false);

const { data } = useQuery({
  queryKey: [`storeItem.success.${route.params.id}`],
  queryFn: async () => {
    const res = await axios.get(
      `${import.meta.env.VITE_SERVER_ENDPOINT}/purchasable/nano/${route.params.id}`,
    );
    return res.data.purchasable as StoreItem;
  },
  retry: (failureCount, err: AxiosError) => {
    if (err.status === 404) {
      router.replace({ name: "Store" });
      return false;
    }
    return failureCount <= 3;
  },
});

const onPageLoad = (item?: StoreItem) => {
  if (!item) return;
  setMetadata({
    title: language.isEn() ? "Thank you - Miia Salin" : "Kiitos - Miia Salin",
  });
  pageReady.value = true;
  window.prerenderReady = true;
};

onMounted(() => onPageLoad(data.value));
watch(data, (item) => onPageLoad(item));
</script>

<template>
  <div class="page">
    <Header
      position="sticky"
      :heading="language.isEn() ? 'Thank you' : 'Kiitos'"
      current-route="Store"
    />
    <main>
      <OpacityTransition mode="default">
        <section v-if="pageReady" class="success-panel">
          <div class="success-inner">
            <PanelHeading
              :text="language.isEn() ? 'Order Confirmed' : 'Tilaus Vahvistettu'"
              textAlign="center"
            />

            <div v-if="data" class="success-item">
              <img
                :src="data.images[0]?.thumbUrl || data.art.image.thumbUrl"
                :alt="language.isEn() ? data.titleEn : data.titleFi"
                class="success-item-img"
              />
              <div class="success-item-info">
                <p class="success-item-title">
                  {{ language.isEn() ? data.titleEn : data.titleFi }}
                </p>
                <p class="success-item-price">
                  {{ Intl.NumberFormat("fi-FI", { style: "currency", currency: "eur" }).format(data.currentPrice) }}
                </p>
              </div>
            </div>

            <div class="success-text">
              <PanelParagraph v-if="language.isEn()" textAlign="center">
                Your payment was successful. A confirmation has been sent to your email.
              </PanelParagraph>
              <PanelParagraph v-if="language.isEn()" textAlign="center">
                Miia will be in touch soon regarding your order and shipping details.
              </PanelParagraph>
              <PanelParagraph v-if="language.isFi()" textAlign="center">
                Maksusi on vastaanotettu. Vahvistus on lähetetty sähköpostiisi.
              </PanelParagraph>
              <PanelParagraph v-if="language.isFi()" textAlign="center">
                Miia ottaa sinuun pian yhteyttä tilauksen ja toimituksen yksityiskohdista.
              </PanelParagraph>
            </div>

            <button
              class="store-btn"
              @click="$router.push({ name: 'Store', params: { locale: $route.params.locale } })"
            >
              {{ language.isEn() ? "Back to store" : "Takaisin kauppaan" }}
            </button>
          </div>
        </section>
      </OpacityTransition>
      <Loader v-if="!pageReady" />
    </main>
    <Footer position="static" />
  </div>
</template>

<style scoped>
.page {
  min-height: 100vh;
  min-height: 100dvh;
}

.success-panel {
  width: 100%;
  min-height: calc(100vh - 10rem);
  min-height: calc(100dvh - 10rem);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4rem 1rem;
}

.success-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2.5rem;
  max-width: 640px;
  width: 100%;
}

.success-item {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  border: 1px solid rgba(208, 191, 173, 0.15);
  border-radius: 8px;
  padding: 1rem;
  width: 100%;
}

.success-item-img {
  width: 5rem;
  height: 5rem;
  object-fit: cover;
  border-radius: 4px;
  filter: sepia(20%);
  flex-shrink: 0;
}

.success-item-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.success-item-title {
  color: #d0bfad;
  font-family: sans-serif;
  font-size: 0.85rem;
  letter-spacing: 2px;
  text-transform: uppercase;
}

.success-item-price {
  color: #b4936f;
  font-family: sans-serif;
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 1px;
}

.success-text {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 100%;
}

.store-btn {
  background-color: transparent;
  border: 1px solid #b4936f;
  color: #d0bfad;
  padding: 0.9rem 2rem;
  border-radius: 8px;
  text-transform: uppercase;
  letter-spacing: 3px;
  cursor: pointer;
  transition: background-color 0.3s;
  font-weight: 700;
  font-size: 0.8rem;
}

.store-btn:hover {
  background-color: #b4936f;
}
</style>
