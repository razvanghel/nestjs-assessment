<template>
  <div class="min-h-screen bg-gray-50 py-10 px-4">
    <div class="mx-auto max-w-3xl">
      <div class="mb-4">
        <SearchBar v-model="search" />
      </div>

      <div class="mb-6 flex items-center justify-between">
        <h1 class="text-2xl font-bold text-gray-900">Cocktails</h1>

        <router-link
          to="/new"
          class="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white transition hover:bg-blue-700"
        >
          + New Cocktail
        </router-link>
      </div>

      <div v-if="isPending" class="rounded-xl bg-white p-6 text-center shadow">
        <p class="text-gray-500">
          {{ search.trim() ? 'Searching...' : 'Loading cocktails...' }}
        </p>
      </div>

      <div v-else-if="isError" class="rounded-xl bg-white p-6 text-center text-red-500 shadow">
        {{ error?.message || 'Something went wrong' }}
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="item in data"
          :key="item.id"
          class="rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition hover:shadow-md"
        >
          <div class="flex items-center justify-between gap-4">
            <router-link :to="`/details/${item.id}`" class="min-w-0 flex-1">
              <h2 class="text-lg font-semibold text-gray-900">
                {{ item.title }}
              </h2>
              <p class="text-sm text-gray-500">
                {{ item.description || 'No description' }}
              </p>
            </router-link>

            <div class="flex items-center gap-4">
              <div class="text-lg font-semibold text-green-600">€{{ item.price }}</div>

              <button
                type="button"
                @click="openDeleteDialog(item)"
                class="rounded-lg p-2 text-red-600 transition hover:bg-red-50 hover:text-red-700"
                aria-label="Delete cocktail"
              >
                Delete
              </button>
            </div>
          </div>
        </div>

        <div
  v-if="data.length === 0"
  class="rounded-xl bg-white p-6 text-center text-gray-500 shadow"
>
  <span v-if="search.trim()">
    No results for "{{ search }}"
  </span>
  <span v-else>
    No cocktails found.
  </span>
</div>
      </div>
    </div>

    <ConfirmDialog
      :open="isDeleteDialogOpen"
      :loading="isDeletePending"
      title="Delete cocktail"
      :message="
        cocktailToDelete
          ? `Are you sure you want to delete '${cocktailToDelete.title}'? This action cannot be undone.`
          : 'Are you sure?'
      "
      @cancel="closeDeleteDialog"
      @confirm="confirmDelete"
    />
  </div>
</template>

<script>
import { computed, ref } from 'vue';
import { useCocktails, useDeleteCocktail, useSearchCocktails } from '@/queries/cocktails';
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue';
import SearchBar from '@/components/ui/SearchBar.vue';

export default {
  name: 'CocktailList',
  components: {
    ConfirmDialog,
    SearchBar,
  },
  setup() {
    const search = ref('');
    const {
  data: searchData,
  isPending: searchPending,
  isError: searchError,
  error: searchErr,
} = useSearchCocktails(search);

const {
  data: listData,
  isPending: listPending,
  isError: listError,
  error: listErr,
} = useCocktails();

const isSearching = computed(() => !!search.value.trim());

const data = computed(() =>
  isSearching.value ? (searchData?.value ?? []) : (listData?.value ?? [])
);

const isPending = computed(() =>
  isSearching.value ? (searchPending?.value ?? false) : (listPending?.value ?? false)
);

const isError = computed(() =>
  isSearching.value ? (searchError?.value ?? false) : (listError?.value ?? false)
);

const error = computed(() =>
  isSearching.value ? (searchErr?.value ?? null) : (listErr?.value ?? null)
);

    const deleteMutation = useDeleteCocktail();

    const isDeleteDialogOpen = ref(false);
    const cocktailToDelete = ref(null);

    const openDeleteDialog = (cocktail) => {
      cocktailToDelete.value = cocktail;
      isDeleteDialogOpen.value = true;
    };

    const closeDeleteDialog = () => {
      isDeleteDialogOpen.value = false;
      cocktailToDelete.value = null;
    };

    const { isPending: isDeletePending } = deleteMutation;

    const confirmDelete = () => {
      if (!cocktailToDelete.value) return;

      deleteMutation.mutate(cocktailToDelete.value.id, {
        onSuccess: () => {
          closeDeleteDialog();
        },
      });
    };

    return {
      data,
      isPending,
      isError,
      error,
      deleteMutation,
      isDeleteDialogOpen,
      cocktailToDelete,
      openDeleteDialog,
      closeDeleteDialog,
      confirmDelete,
      isDeletePending,
      search,
    };
  },
};
</script>
