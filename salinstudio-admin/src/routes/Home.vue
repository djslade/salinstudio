<script setup lang="ts">
import { computed } from "vue";
import { useQuery } from "@tanstack/vue-query";
import { Card } from "primevue";
import { getRequest, refreshIfUnauthorized } from "../utils/requests";
import { resolvePageName, buildArtSlugMap } from "../utils/routes";
import type { Art, Purchasable, GetAllVisitorsRes } from "../types/data";
import SectionLabel from "../components/SectionLabel.vue";

const { data: purchasables, isFetching: loadingStore } = useQuery({
  queryKey: ["allPurchasables"],
  queryFn: async () => {
    const res = await refreshIfUnauthorized<{ purchasables: Purchasable[] }>(
      () => getRequest("/purchasable", { accessToken: true }),
    );
    if (!res) throw new Error();
    return res.purchasables;
  },
});

const { data: art, isFetching: loadingArt } = useQuery({
  queryKey: ["allArt"],
  queryFn: async () => {
    const res = await getRequest<{ art: Art[] }>("/art");
    return res.art;
  },
});

const { data: visitors, isFetching: loadingVisitors } = useQuery({
  queryKey: ["visitors"],
  queryFn: async () => {
    const res = await refreshIfUnauthorized<GetAllVisitorsRes>(
      async () => await getRequest("/visitor", { accessToken: true }),
    );
    if (!res) throw new Error();
    return res.visitors;
  },
});

const realVisitors = computed(() =>
  visitors.value?.filter((v) => !v.isTester) ?? [],
);

const totalCount = computed(() => purchasables.value?.length ?? 0);

const publishedCount = computed(
  () => purchasables.value?.filter((p) => p.isPublic).length ?? 0,
);

const unlistedCount = computed(
  () => purchasables.value?.filter((p) => !p.isPublic).length ?? 0,
);

const attentionItems = computed(() => {
  const items: Array<Purchasable & { alert: string }> = [];
  const seen = new Set<string>();
  for (const p of purchasables.value ?? []) {
    if (!p.isOriginal && p.quantity === 0) {
      items.push({ ...p, alert: "Out of stock" });
      seen.add(p.id);
    }
  }
  for (const p of purchasables.value ?? []) {
    if (!p.isOriginal && p.quantity > 0 && p.quantity <= 3 && !seen.has(p.id)) {
      items.push({ ...p, alert: `${p.quantity} left` });
      seen.add(p.id);
    }
  }
  for (const p of purchasables.value ?? []) {
    if (!p.isPublic && !seen.has(p.id)) {
      items.push({ ...p, alert: "Unlisted" });
      seen.add(p.id);
    }
  }
  return items;
});

const popularPages = computed(() => {
  const counts = new Map<string, number>();
  for (const action of realVisitors.value.flatMap((v) => v.actions)) {
    const name = resolvePageName(action.path, artBySlug.value);
    counts.set(name, (counts.get(name) ?? 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([name, count]) => ({ name, count }));
});

const totalActions = computed(() =>
  realVisitors.value.reduce((sum, v) => sum + v.actions.length, 0),
);

const artBySlug = computed(() => buildArtSlugMap(art.value ?? []));
</script>

<template>
  <div class="flex flex-col gap-8 w-full">
    <div class="px-3">
      <h1 class="text-2xl font-bold">Dashboard</h1>
    </div>

    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <template #content>
          <div class="flex flex-col gap-3">
            <div class="flex items-center justify-between">
              <span
                class="text-xs font-semibold uppercase tracking-widest text-surface-400"
                >Store</span
              >
              <i class="pi pi-shopping-bag text-primary" />
            </div>
            <div
              v-if="loadingStore"
              class="h-8 w-16 rounded bg-surface-200 dark:bg-surface-700 animate-pulse"
            />
            <div v-else class="text-3xl font-bold">{{ totalCount }}</div>
            <div class="text-sm text-surface-500">
              <template v-if="loadingStore">—</template>
              <template v-else
                >{{ publishedCount }} public · {{ unlistedCount }} unlisted</template
              >
            </div>
          </div>
        </template>
      </Card>

      <Card>
        <template #content>
          <div class="flex flex-col gap-3">
            <div class="flex items-center justify-between">
              <span
                class="text-xs font-semibold uppercase tracking-widest text-surface-400"
                >Stock alerts</span
              >
              <i class="pi pi-exclamation-triangle text-primary" />
            </div>
            <div
              v-if="loadingStore"
              class="h-8 w-16 rounded bg-surface-200 dark:bg-surface-700 animate-pulse"
            />
            <div v-else class="text-3xl font-bold">
              {{ attentionItems.filter((i) => i.alert !== "Draft").length }}
            </div>
            <div class="text-sm text-surface-500">
              <template v-if="loadingStore">—</template>
              <template v-else>
                {{
                  attentionItems.filter((i) => i.alert === "Out of stock")
                    .length
                }}
                out of stock
              </template>
            </div>
          </div>
        </template>
      </Card>

      <Card>
        <template #content>
          <div class="flex flex-col gap-3">
            <div class="flex items-center justify-between">
              <span
                class="text-xs font-semibold uppercase tracking-widest text-surface-400"
                >Art</span
              >
              <i class="pi pi-image text-primary" />
            </div>
            <div
              v-if="loadingArt"
              class="h-8 w-16 rounded bg-surface-200 dark:bg-surface-700 animate-pulse"
            />
            <div v-else class="text-3xl font-bold">{{ art?.length ?? 0 }}</div>
            <div class="text-sm text-surface-500">pieces in catalog</div>
          </div>
        </template>
      </Card>

      <Card>
        <template #content>
          <div class="flex flex-col gap-3">
            <div class="flex items-center justify-between">
              <span
                class="text-xs font-semibold uppercase tracking-widest text-surface-400"
                >Visitors</span
              >
              <i class="pi pi-users text-primary" />
            </div>
            <div
              v-if="loadingVisitors"
              class="h-8 w-16 rounded bg-surface-200 dark:bg-surface-700 animate-pulse"
            />
            <div v-else class="text-3xl font-bold">
              {{ realVisitors.length }}
            </div>
            <div class="text-sm text-surface-500">
              <template v-if="loadingVisitors">—</template>
              <template v-else>{{ totalActions }} actions recorded</template>
            </div>
          </div>
        </template>
      </Card>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <template #content>
          <div class="flex flex-col gap-4">
            <SectionLabel label="Items needing attention" />
            <div v-if="loadingStore" class="flex flex-col gap-3">
              <div
                v-for="i in 4"
                :key="i"
                class="h-12 rounded bg-surface-200 dark:bg-surface-700 animate-pulse"
              />
            </div>
            <div
              v-else-if="attentionItems.length === 0"
              class="flex flex-col items-center justify-center py-10 gap-2 text-surface-400"
            >
              <i class="pi pi-check-circle text-2xl" />
              <span class="text-sm">All items are in good shape</span>
            </div>
            <div
              v-else
              class="flex flex-col divide-y divide-surface-100 dark:divide-surface-800"
            >
              <div
                v-for="item in attentionItems"
                :key="`${item.id}-${item.alert}`"
                class="flex items-center justify-between gap-3 py-3"
              >
                <div class="flex items-center gap-3 min-w-0">
                  <img
                    v-if="item.art?.image?.thumbUrl"
                    :src="item.art.image.thumbUrl"
                    class="w-10 h-10 rounded object-cover shrink-0"
                  />
                  <div
                    v-else
                    class="w-10 h-10 rounded bg-surface-100 dark:bg-surface-800 shrink-0"
                  />
                  <span class="text-sm truncate">{{
                    item.titleEn || item.art?.titleEn || "—"
                  }}</span>
                </div>
                <span
                  class="shrink-0 rounded px-2 py-1 text-xs"
                  :class="{
                    'bg-surface-200 text-surface-500 dark:bg-surface-700 dark:text-surface-400':
                      item.alert === 'Unlisted',
                    'text-primary-600 dark:text-primary-400':
                      item.alert === 'Out of stock',
                    'bg-primary-100 text-primary-700 dark:bg-primary-900/25 dark:text-primary-300':
                      item.alert !== 'Unlisted' && item.alert !== 'Out of stock',
                  }"
                  >{{ item.alert }}</span
                >
              </div>
            </div>
          </div>
        </template>
      </Card>

      <Card>
        <template #content>
          <div class="flex flex-col gap-4">
            <SectionLabel label="Popular pages" />
            <div v-if="loadingVisitors" class="flex flex-col gap-3">
              <div
                v-for="i in 5"
                :key="i"
                class="h-8 rounded bg-surface-200 dark:bg-surface-700 animate-pulse"
              />
            </div>
            <div
              v-else-if="popularPages.length === 0"
              class="flex flex-col items-center justify-center py-10 gap-2 text-surface-400"
            >
              <i class="pi pi-chart-bar text-2xl" />
              <span class="text-sm">No visitor data yet</span>
            </div>
            <div
              v-else
              class="flex flex-col divide-y divide-surface-100 dark:divide-surface-800"
            >
              <div
                v-for="page in popularPages"
                :key="page.name"
                class="flex items-center justify-between gap-3 py-3"
              >
                <span class="truncate text-sm text-surface-600 dark:text-surface-300"
                  >{{ page.name }}</span
                >
                <span class="shrink-0 text-sm font-semibold text-surface-400">{{
                  page.count
                }}</span>
              </div>
            </div>
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>
