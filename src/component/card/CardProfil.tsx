import "../../style/component/card/cardProfil.scss";
import { useTrainerSelector } from "../../hooks/useSelector";

function CardProfil() {
  const { activeTrainer } = useTrainerSelector();

  if (!activeTrainer) {
    return <div className="profil-page__card">Aucun dresseur sélectionné</div>;
  }

  return (
    <div className="profil-page__card">
      <div className="profil-page__card__header">
        <img
          src={activeTrainer.image}
          alt={activeTrainer.name}
          className="profil-page__card__image"
        />
        <div className="profil-page__card__info">
          <h2>{activeTrainer.name}</h2>
          <p>{activeTrainer.age} ans</p>
          <p>{activeTrainer.money} $</p>
          <p>{activeTrainer.level} niveau</p>
          <p>{activeTrainer.exp} exp</p>
          <p>{activeTrainer.gender}</p>
          <p>{activeTrainer.height} m</p>
          <p>{activeTrainer.weight} kg</p>
          <p>{activeTrainer.description}</p>
        </div>
      </div>

      <h3>Teams de Pokémon</h3>
      <div className="profil-page__card__teams">
        {activeTrainer.pokemons?.map((pokemon, index) => (
          <p key={`pokemon-${index}`}>{String(pokemon.name)}</p>
        ))}
      </div>
    </div>
  );
}

export default CardProfil;
