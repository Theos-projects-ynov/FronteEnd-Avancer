import { IPokemon } from "./Pokemon";

export type ITrainer = {
  name: string;
  age: number;

  pokemonStarter?: IPokemon;
  pokemons?: IPokemon[];
  teamPokemon?: IPokemon[];

  badge?: string[];
  region: string;
  money: number | 0;
  level: number | 0;
  exp: number | 0;

  gender: "Homme" | "Femme" | "Autre";
  height: number;
  weight: number;
  description: string;
  image: string;
};

export interface Trainer {
  id: string;
  name: string;
  email: string;
  region: string;
  level: number;
  exp: number;
  gender: string;
  height: number;
  weight: number;
  description: string;
  image: string;
  badge: string[];
  pokemonStarter: unknown | null;
  teamPokemon: unknown | null;
  isAdmin: boolean;
  createdAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  trainer: Trainer;
}
