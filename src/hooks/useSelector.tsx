import { useSelector } from "react-redux";
import { RootState } from "../store/store";

export const useTrainerSelector = () => {
  // Sélectionne tous les dresseurs sous forme de tableau
  const trainers = useSelector((state: RootState) =>
    Object.values(state.trainer.trainers)
  );

  // Sélectionne l'ID du dresseur actif
  const activeTrainerId = useSelector(
    (state: RootState) => state.trainer.activeTrainerId
  );

  // Sélectionne le dresseur actif
  const activeTrainer = useSelector((state: RootState) =>
    state.trainer.activeTrainerId
      ? state.trainer.trainers[state.trainer.activeTrainerId]
      : null
  );

  // Sélectionne tous les IDs des dresseurs
  const trainerIds = useSelector((state: RootState) =>
    Object.keys(state.trainer.trainers)
  );

  // Sélectionne l'objet contenant tous les dresseurs
  const trainersMap = useSelector((state: RootState) => state.trainer.trainers);

  return {
    trainers,
    activeTrainer,
    activeTrainerId,
    trainerIds,
    trainersMap,
  };
};
