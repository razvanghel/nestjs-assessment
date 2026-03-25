import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';
import { toast } from 'vue-sonner';
import {
  getCocktails,
  createCocktail,
  getCocktailById,
  updateCocktail,
  deleteCocktail
} from '@/services/cocktails';

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

export function useUpdateCocktail(id) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => updateCocktail(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cocktail', id] });
      queryClient.invalidateQueries({ queryKey: ['cocktails'] });
      toast.success('Cocktail updated successfully');
    },
  }); 
}
    
export function useDeleteCocktail() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCocktail,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cocktails'] });
      toast.success('Cocktail deleted successfully');
    },
    onError: (error) => {
      toast.error(error?.message || 'Something went wrong');
    },
  });
}

