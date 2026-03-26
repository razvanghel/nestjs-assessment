<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
    <form
      @submit.prevent="submitForm"
      class="w-full max-w-md bg-white shadow-md rounded-2xl p-6 space-y-5"
    >
    <div class="flex items-center justify-between">
      <router-link to="/" class="mb-6 inline-flex text-blue-600"> ← Back </router-link>

        <h2 class="text-xl font-semibold text-gray-800">Create Cocktail</h2>

        <div class="w-[72px]"></div>
      </div>
      <!-- Title -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1"> Title </label>
        <input
          v-model="form.title"
          type="text"
          class="w-full rounded-lg px-3 py-2 text-sm border focus:outline-none focus:ring-2 transition"
          :class="
            errors.title
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:ring-blue-500'
          "
        />
        <p v-if="errors.title" class="text-xs text-red-500 mt-1">
          {{ errors.title }}
        </p>
      </div>

      <!-- Price -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1"> Price </label>
        <input
          v-model.number="form.price"
          type="number"
          class="w-full rounded-lg px-3 py-2 text-sm border focus:outline-none focus:ring-2"
          :class="
            errors.price
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:ring-blue-500'
          "
        />
        <p v-if="errors.price" class="text-xs text-red-500 mt-1">
          {{ errors.price }}
        </p>
      </div>

      <!-- Description -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1"> Description </label>
        <textarea
          v-model="form.description"
          rows="3"
          class="w-full rounded-lg px-3 py-2 text-sm border focus:outline-none focus:ring-2"
          :class="
            errors.description
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:ring-blue-500'
          "
        ></textarea>
        <p v-if="errors.description" class="text-xs text-red-500 mt-1">
          {{ errors.description }}
        </p>
      </div>

      <!-- Button -->
      <button
        type="submit"
        :disabled="isSubmitDisabled"
        class="w-full py-2 rounded-lg text-sm font-medium text-white transition bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:hover:bg-blue-300 disabled:opacity-100 disabled:cursor-not-allowed"
      >
        {{ mutation.isPending.value ? 'Submitting...' : 'Submit' }}
      </button>

      <!-- Success -->
      <p v-if="mutation.isSuccess.value" class="text-sm text-green-600 text-center">
        Cocktail created successfully.
      </p>
    </form>
  </div>
</template>

<script>
import { reactive, watch, computed } from 'vue';
import { useCreateCocktail } from '@/queries/cocktails';
import { createCocktailSchema } from '@/lib/zod/cocktail';

export default {
  name: 'NewCocktail',
  setup() {
    const form = reactive({
      title: '',
      price: null,
      description: '',
    });
    const isSubmitDisabled = computed(() => {
      return (
        mutation.isPending.value ||
        !form.title?.trim() ||
        form.price === null ||
        form.price === '' ||
        !form.description?.trim()
      );
    });
    const errors = reactive({
      title: '',
      price: '',
      description: '',
    });

    watch(
      () => ({ ...form }),
      (newForm, oldForm) => {
        Object.keys(newForm).forEach((key) => {
          if (newForm[key] !== oldForm[key] && errors[key]) {
            errors[key] = '';
          }
        });
      },
    );

    const mutation = useCreateCocktail();

    const resetErrors = () => {
      errors.title = '';
      errors.price = '';
      errors.description = '';
    };

    const validateForm = () => {
      resetErrors();

      const result = createCocktailSchema.safeParse({
        ...form,
        price: form.price, // IMPORTANT: let Zod preprocess handle it
      });

      if (!result.success) {
        const formatted = result.error.format();

        errors.title = formatted.title?._errors?.[0] || '';
        errors.price = formatted.price?._errors?.[0] || '';
        errors.description = formatted.description?._errors?.[0] || '';

        return false;
      }

      return true;
    };
    const resetForm = () => {
      form.title = '';
      form.price = null;
      form.description = '';
      resetErrors();
    };

    const submitForm = () => {
      if (!validateForm()) return;

      mutation.mutate(
        {
          title: form.title,
          price: form.price,
          description: form.description,
        },
        {
          onSuccess: () => {
            resetForm();
            mutation.reset();
          },
        },
      );
    };

    return {
      form,
      errors,
      mutation,
      submitForm,
      isSubmitDisabled,
    };
  },
};
</script>
