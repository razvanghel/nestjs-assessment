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
          <span style="font-weight: bold">{{ item.title }}</span> price: {{ item.price }}€
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

<style scoped>
/* Add your styles here */
</style>
