<template>
  <div>
    <h1>Cocktails List</h1>
    <div v-if="isPending">Loading...</div>
    <div v-else-if="isError">
      {{ error?.message || 'Something went wrong' }}
    </div>
    <div v-else>
      <label for="search">Search by description:</label>
      <input type="text" id="search" />
      <ul>
        <li v-for="item in data" :key="item.id">
          <router-link :to="`/details/${item.id}`" class="cocktail-link">
            <span style="font-weight: bold">{{ item.title }}</span>
            price: {{ item.price }}€
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { useCocktails } from '@/queries/cocktails';

export default {
  name: 'NewCocktail',
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
