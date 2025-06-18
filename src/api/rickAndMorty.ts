import { Character, CharactersResponse } from '../types/api';

const BASE_URL = 'https://rickandmortyapi.com/api';

export const fetchCharacters = async (page: number = 1): Promise<CharactersResponse> => {
  const response = await fetch(`${BASE_URL}/character?page=${page}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch characters: ${response.statusText}`);
  }
  
  return response.json();
};

export const fetchCharacter = async (id: string): Promise<Character> => {
  const response = await fetch(`${BASE_URL}/character/${id}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch character: ${response.statusText}`);
  }
  
  return response.json();
};