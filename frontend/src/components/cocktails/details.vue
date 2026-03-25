<template>
  <div class="min-h-screen bg-gray-50 py-10 px-4">
    <div class="mx-auto max-w-3xl">
      <router-link
        to="/"
        class="mb-6 inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
      >
        ← Back to cocktails
      </router-link>

      <div v-if="isPending" class="rounded-2xl bg-white p-8 text-center shadow">
        Loading cocktail details...
      </div>

      <div v-else-if="isError" class="rounded-2xl bg-white p-8 text-center text-red-500 shadow">
        {{ error?.message || 'Something went wrong' }}
      </div>

      <div
        v-else-if="cocktail"
        class="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg"
      >
        <div class="p-8">
          <div class="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 class="text-3xl font-bold text-gray-900">
                {{ cocktail.title }}
              </h1>
              <p class="mt-2 text-sm text-gray-500">Cocktail ID: {{ cocktail.id }}</p>
            </div>

            <div class="rounded-xl bg-green-50 px-4 py-2 text-lg font-semibold text-green-700">
              €{{ cocktail.price }}
            </div>
          </div>

          <div class="mt-8 rounded-xl bg-gray-50 p-5">
            <h2 class="mb-2 text-lg font-semibold text-gray-900">Description</h2>
            <p class="text-gray-700">
              {{ cocktail.description || 'No description available.' }}
            </p>
          </div>
        </div>
      </div>

      <div v-else class="rounded-2xl bg-white p-8 text-center text-gray-500 shadow">
        Cocktail not found.
      </div>
    </div>
  </div>
</template>

<script>
import { useRoute } from 'vue-router';
import { useCocktail } from '@/queries/cocktails';

export default {
  name: 'CocktailDetails',
  setup() {
    const route = useRoute();
    const { data, isPending, isError, error } = useCocktail(route.params.id);
    return {
      cocktail: data,
      isPending,
      isError,
      error,
    };
  },
};
</script>
