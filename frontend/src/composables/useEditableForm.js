import { reactive, ref, computed } from 'vue';

export function useEditableForm(initialData, schema) {
  const isEditing = ref(false);

  const form = reactive({ ...initialData });

  const errors = reactive(
    Object.keys(initialData).reduce((acc, key) => {
      acc[key] = '';
      return acc;
    }, {}),
  );

  const original = ref({ ...initialData });

  const resetErrors = () => {
    Object.keys(errors).forEach((key) => (errors[key] = ''));
  };

  const setForm = (data) => {
    Object.keys(form).forEach((key) => {
      form[key] = data?.[key] ?? initialData[key];
    });

    original.value = { ...form };
  };

  const validate = () => {
    resetErrors();
    const payload = { ...form };

    const result = schema.safeParse(payload);

    if (!result.success) {
      const formatted = result.error.format();

      Object.keys(errors).forEach((key) => {
        errors[key] = formatted[key]?._errors?.[0] || '';
      });

      return false;
    }

    return true;
  };

  const isValid = computed(() => {
    const result = schema.safeParse({ ...form });
    return result.success;
  });

  const isDirty = computed(() => {
    return Object.keys(form).some((key) => form[key] !== original.value[key]);
  });

  return {
    form,
    errors,
    isEditing,
    setForm,
    validate,
    isValid,
    isDirty,
    resetErrors
  };
}
