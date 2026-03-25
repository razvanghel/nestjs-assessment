import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';
import { toast } from 'vue-sonner';
import { getCocktails, createCocktail, getCocktailById } from '@/services/cocktails';

export function useCocktails() {
  return useQuery({
    queryKey: ['cocktails'],
    queryFn: getCocktails,
  });
}

export function useCocktail(id) {
  return useQuery({
    queryKey: ['cocktail', id],
    queryFn: () => getCocktailById(id),
    enabled: !!id,
  });
}

export function useCreateCocktail() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCocktail,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cocktails'] });
      toast.success('Cocktail created successfully');
    },
    onError: (error) => {
      toast.error(error?.message);
    },
  });
}
