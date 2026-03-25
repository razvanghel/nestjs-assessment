<template>
  <div class="flex justify-end gap-3">
    <!-- Edit -->
    <button
      v-if="!isEditing"
      @click="$emit('edit')"
      class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
    >
      ✏️ Edit
    </button>

    <!-- Save / Cancel -->
    <template v-else>
      <button
        @click="$emit('cancel')"
        class="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition"
      >
        Cancel
      </button>

      <button
        @click="$emit('save')"
        :disabled="isLoading"
        class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:bg-green-300 disabled:cursor-not-allowed"
      >
        {{ isLoading ? 'Saving...' : 'Save' }}
      </button>
    </template>
  </div>
</template>

<script>
export default {
  name: 'EditActions',
  props: {
    isEditing: Boolean,
    isLoading: Boolean,
  },
  emits: ['edit', 'save', 'cancel'],
};
</script>
