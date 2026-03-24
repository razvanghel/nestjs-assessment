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
