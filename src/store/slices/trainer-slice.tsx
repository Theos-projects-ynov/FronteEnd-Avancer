import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Pokemon } from "../../service/api";

// Type pour un dresseur individuel
export interface Trainer {
  id: string;
  name: string;
  region: string;
  pokemons: Pokemon[];
}

// Type pour l'état du slice
interface TrainerState {
  trainers: Record<string, Trainer>;
  activeTrainerId: string | null;
}

const initialState: TrainerState = {
  trainers: {},
  activeTrainerId: null,
};

export const trainerSlice = createSlice({
  name: "trainer",
  initialState,
  reducers: {
    // Ajouter ou mettre à jour un dresseur
    setTrainer: (state, action: PayloadAction<Trainer>) => {
      const trainer = action.payload;
      state.trainers[trainer.id] = trainer;
    },

    removeTrainer: (state, action: PayloadAction<string>) => {
      delete state.trainers[action.payload];
      if (state.activeTrainerId === action.payload) {
        state.activeTrainerId = null;
      }
    },

    addPokemonToTrainer: (
      state,
      action: PayloadAction<{ trainerId: string; pokemon: Pokemon }>
    ) => {
      const { trainerId, pokemon } = action.payload;
      if (state.trainers[trainerId]) {
        state.trainers[trainerId].pokemons.push(pokemon);
      }
    },

    removePokemonFromTrainer: (
      state,
      action: PayloadAction<{ trainerId: string; pokemonId: number }>
    ) => {
      const { trainerId, pokemonId } = action.payload;
      if (state.trainers[trainerId]) {
        state.trainers[trainerId].pokemons = state.trainers[
          trainerId
        ].pokemons.filter((p) => p.pokedex_id !== pokemonId);
      }
    },
  },
});

export const {
  setTrainer,
  removeTrainer,
  addPokemonToTrainer,
  removePokemonFromTrainer,
} = trainerSlice.actions;

// Sélecteurs
export const selectTrainers = (state: { trainer: TrainerState }) =>
  Object.values(state.trainer.trainers);

export const selectActiveTrainer = (state: { trainer: TrainerState }) =>
  state.trainer.activeTrainerId
    ? state.trainer.trainers[state.trainer.activeTrainerId]
    : null;

export default trainerSlice.reducer;
