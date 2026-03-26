<script setup>
import { ref, watch } from 'vue';
/* eslint-disable no-undef */
const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: 'Search...',
  },
  delay: {
    type: Number,
    default: 350,
  },
});

const emit = defineEmits(['update:modelValue', 'search']);

const localValue = ref(props.modelValue);
let timeout = null;

watch(
  () => props.modelValue,
  (val) => {
    localValue.value = val;
  }
);

watch(localValue, (val) => {
  emit('update:modelValue', val);

  if (timeout) clearTimeout(timeout);

  timeout = setTimeout(() => {
    emit('search', val);
  }, props.delay);
});
</script>

<template>
  <div class="w-full">
    <input
      v-model="localValue"
      type="text"
      :placeholder="placeholder"
      class="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-black transition"
    />
  </div>
</template>