<template>
  <div class="min-h-screen bg-gray-50 py-10 px-4">
    <div class="mx-auto max-w-3xl">

      <router-link to="/" class="mb-6 inline-flex text-blue-600">
        ← Back
      </router-link>

      <div v-if="cocktail" class="bg-white p-8 rounded-2xl shadow space-y-6">

        <EditableField
          label="Title"
          v-model="form.title"
          :error="errors.title"
          :isEditing="isEditing"
          :displayValue="cocktail.title"
        />

        <EditableField
          label="Price"
          v-model="form.price"
          type="number"
          :error="errors.price"
          :isEditing="isEditing"
          :displayValue="`€${cocktail.price}`"
        />

        <EditableField
          label="Description"
          v-model="form.description"
          type="textarea"
          :error="errors.description"
          :isEditing="isEditing"
          :displayValue="cocktail.description"
        />

        <EditActions
          :isEditing="isEditing"
          :isLoading="updateMutation.isPending.value"
          :isDisabled="!isValid"
          @edit="startEdit"
          @save="submitUpdate"
          @cancel="cancelEdit"
        />

      </div>
    </div>
  </div>
</template>

<script>
import { useRoute } from 'vue-router';
import { useCocktail, useUpdateCocktail } from '@/queries/cocktails';
import { updateCocktailSchema } from '@/lib/zod/cocktail';

import EditableField from '@/components/ui/EditableField.vue';
import EditActions from '@/components/ui/EditActions.vue';
import { useEditableForm } from '@/composables/useEditableForm';

export default {
  components: { EditableField, EditActions },

  setup() {
    const route = useRoute();
    const { data } = useCocktail(route.params.id);
    const updateMutation = useUpdateCocktail(route.params.id);

    const {
      form,
      errors,
      isEditing,
      setForm,
      validate,
      isValid,
    } = useEditableForm(
      { title: '', price: null, description: '' },
      updateCocktailSchema,
    );

    const startEdit = () => {
      if (!data.value) return;
      setForm(data.value);
      isEditing.value = true;
    };

    const cancelEdit = () => {
      setForm(data.value);
      isEditing.value = false;
    };

    const submitUpdate = () => {
      if (!validate()) return;

      updateMutation.mutate(
        {
          title: form.title,
          price: Number(form.price),
          description: form.description,
        },
        {
          onSuccess: () => {
            isEditing.value = false;
          },
        },
      );
    };

    return {
      cocktail: data,
      form,
      errors,
      isEditing,
      isValid,
      startEdit,
      cancelEdit,
      submitUpdate,
      updateMutation,
    };
  },
};
</script>