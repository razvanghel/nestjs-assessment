<template>
  <div>
    <form @submit.prevent="submitForm">
      <div>
        <label for="title">Title:</label>
        <input
          id="title"
          v-model="form.title"
          type="text"
          required
        />
      </div>

      <div>
        <label for="price">Price:</label>
        <input
          id="price"
          v-model.number="form.price"
          type="number"
          required
        />
      </div>

      <div>
        <label for="description">Description:</label>
        <textarea
          id="description"
          v-model="form.description"
          required
        ></textarea>
      </div>

      <button type="submit" :disabled="mutation.isPending.value">
        {{ mutation.isPending.value ? 'Submitting...' : 'Submit' }}
      </button>

      <p v-if="mutation.isError.value">
        {{ mutation.error.value?.message || 'Something went wrong' }}
      </p>

      <p v-if="mutation.isSuccess.value">
        Cocktail created successfully.
      </p>
    </form>
  </div>
</template>

<script>
import { reactive } from 'vue';
import { useCreateCocktail } from '@/queries/cocktails';

export default {
  name: 'NewCocktail',
  setup() {
    const form = reactive({
      title: '',
      price: null,
      description: '',
    });

    const mutation = useCreateCocktail();

    const resetForm = () => {
      form.title = '';
      form.price = null;
      form.description = '';
    };

    const submitForm = async () => {
      try {
        await mutation.mutateAsync({
          title: form.title,
          price: form.price,
          description: form.description,
        });

        resetForm();
      } catch (error) {
        console.error('There was an error submitting the form:', error);
      }
    };

    return {
      form,
      mutation,
      submitForm,
    };
  },
};
</script>

<style scoped>
form {
  max-width: 400px;
  margin: 0 auto;
}
div {
  margin-bottom: 10px;
}
label {
  display: block;
  margin-bottom: 5px;
}
input,
textarea {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}
button {
  padding: 10px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
}
button:hover {
  background-color: #0056b3;
}
button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>