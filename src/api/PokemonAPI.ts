import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { IPokemon } from "../type/Pokemon";

export const pokemonApi = createApi({
  reducerPath: "pokemonAPi",
  baseQuery: fetchBaseQuery({ baseUrl: "https://tyradex.app/api/v1/" }),
  tagTypes: ["PokemonGen"],

  endpoints: (builder) => ({
    getPokemonByGeneration: builder.query<IPokemon[], number>({
      query: (gen) => `gen/${gen}`,
      providesTags: ["PokemonGen"],
    }),

    getPokemon: builder.query<IPokemon, string>({
      query: (id) => `pokemon/${id}`,
    }),
  }),
});

export const { useGetPokemonByGenerationQuery, useGetPokemonQuery } =
  pokemonApi;
