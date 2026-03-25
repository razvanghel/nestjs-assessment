<template>
    <div
      v-if="open"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
    >
      <div class="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h2 class="text-lg font-semibold text-gray-900">
          {{ title }}
        </h2>
  
        <p class="mt-2 text-sm text-gray-600">
          {{ message }}
        </p>
  
        <div class="mt-6 flex justify-end gap-3">
          <button
            type="button"
            @click="$emit('cancel')"
            class="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-300 transition"
          >
            Cancel
          </button>
  
          <button
            type="button"
            :disabled="loading"
            @click="$emit('confirm')"
            class="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition disabled:bg-red-300 disabled:cursor-not-allowed"
          >
            {{ loading ? 'Deleting...' : 'Delete' }}
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'ConfirmDialog',
    props: {
      open: Boolean,
      title: {
        type: String,
        default: 'Are you sure?',
      },
      message: {
        type: String,
        default: 'This action cannot be undone.',
      },
      loading: Boolean,
    },
    emits: ['confirm', 'cancel'],
  };
  </script>