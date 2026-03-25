import { request } from './api';

export function getCocktails() {
  return request('/cocktails');
}

export function createCocktail(payload) {
  return request('/cocktails', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function getCocktailById(id) {
  return request(`/cocktails/${id}`);
}

export function updateCocktail(id, payload) {
  return request(`/cocktails/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}
