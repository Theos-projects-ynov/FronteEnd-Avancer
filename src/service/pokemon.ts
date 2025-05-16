import { useGetPokemonByGenerationQuery } from "../api/PokemonAPI";

export function usePokemonService() {
  const { data, isLoading, isError } = useGetPokemonByGenerationQuery(1);

  return {
    pokemons: data || [],
    isLoading,
    isError,
  };
}
