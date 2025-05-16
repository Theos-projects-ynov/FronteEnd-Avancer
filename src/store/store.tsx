import { configureStore } from "@reduxjs/toolkit";
import trainerReducer from "./slices/trainer-slice";
import { pokemonApi } from "../api/PokemonAPI";

export const store = configureStore({
  reducer: {
    trainer: trainerReducer,
    [pokemonApi.reducerPath]: pokemonApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(pokemonApi.middleware),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
