<template>
  <div class="min-h-screen bg-gray-50 py-10 px-4">
    <div class="mx-auto max-w-3xl">

      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Cocktails</h1>

        <router-link
          to="/new"
          class="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition"
        >
          + New Cocktail
        </router-link>
      </div>

      <!-- Loading -->
      <div v-if="isPending" class="bg-white p-6 rounded-xl shadow text-center">
        <p class="text-gray-500">Loading cocktails...</p>
      </div>

      <!-- Error -->
      <div
        v-else-if="isError"
        class="bg-white p-6 rounded-xl shadow text-center text-red-500"
      >
        {{ error?.message || 'Something went wrong' }}
      </div>

      <!-- List -->
      <div v-else class="space-y-4">
        <router-link
          v-for="item in data"
          :key="item.id"
          :to="`/details/${item.id}`"
          class="block bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition"
        >
          <div class="flex items-center justify-between">
            <!-- Title -->
            <div>
              <h2 class="text-lg font-semibold text-gray-900">
                {{ item.title }}
              </h2>
              <p class="text-sm text-gray-500">
                {{ item.description || 'No description' }}
              </p>
            </div>

            <!-- Price -->
            <div class="text-green-600 font-semibold text-lg">
              €{{ item.price }}
            </div>
          </div>
        </router-link>

        <!-- Empty -->
        <div
          v-if="data.length === 0"
          class="bg-white p-6 rounded-xl shadow text-center text-gray-500"
        >
          No cocktails found.
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import { useCocktails } from '@/queries/cocktails';

export default {
  name: 'CocktailList',
  setup() {
    const { data, isPending, isError, error } = useCocktails();

    return {
      data,
      isPending,
      isError,
      error,
    };
  },
};
</script>