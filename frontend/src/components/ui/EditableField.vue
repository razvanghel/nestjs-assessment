<template>
  <div>
    <label class="block text-sm font-medium text-gray-700 mb-1">
      {{ label }}
    </label>

    <input
      v-if="isEditing && type !== 'textarea'"
      :type="type"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      class="w-full rounded-lg px-3 py-2 text-sm border focus:outline-none focus:ring-2 transition"
      :class="error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'"
    />

    <textarea
      v-if="isEditing && type === 'textarea'"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      rows="3"
      class="w-full rounded-lg px-3 py-2 text-sm border focus:outline-none focus:ring-2 transition"
      :class="error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'"
    />

    <p v-if="!isEditing" class="text-gray-800">
      {{ displayValue || placeholder }}
    </p>

    <p v-if="error" class="text-xs text-red-500 mt-1">
      {{ error }}
    </p>
  </div>
</template>

<script>
export default {
  name: 'EditableField',
  props: {
    label: String,
    modelValue: [String, Number],
    type: { type: String, default: 'text' },
    error: String,
    isEditing: Boolean,
    placeholder: String,
    displayValue: [String, Number],
  },
  emits: ['update:modelValue'],
};
</script>
