import { useDispatch } from "react-redux";
import {
  setTrainer,
  removeTrainer,
  addPokemonToTrainer,
  removePokemonFromTrainer,
  Trainer,
} from "../store/slices/trainer-slice";
import { Pokemon } from "../service/api";

export const useDispatcher = () => {
  const dispatch = useDispatch();

  return {
    setTrainer: (trainer: Trainer) => {
      dispatch(setTrainer(trainer));
    },

    removeTrainer: (trainerId: string) => {
      dispatch(removeTrainer(trainerId));
    },

    addPokemonToTrainer: (trainerId: string, pokemon: Pokemon) => {
      dispatch(addPokemonToTrainer({ trainerId, pokemon }));
    },

    /**
     * Supprime un pokémon d'un dresseur
     */
    removePokemonFromTrainer: (trainerId: string, pokemonId: number) => {
      dispatch(removePokemonFromTrainer({ trainerId, pokemonId }));
    },

    /**
     * Crée un nouveau dresseur
     */
    createTrainer: (name: string, region: string = "") => {
      const newTrainer: Trainer = {
        id: crypto.randomUUID(),
        name,
        region,
        pokemons: [],
      };
      dispatch(setTrainer(newTrainer));
      return newTrainer.id;
    },
  };
};
