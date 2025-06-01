import "../../style/component/card/cardProfil.scss";
import { Trainer } from "../../type/Trainer";
import { useEffect, useState } from "react";

function CardProfil() {
  const [trainerData, setTrainer] = useState<Trainer>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("card : ", localStorage.getItem('token'));

    const token = localStorage.getItem('token');
    if (!token) {
      console.log("no token");
      setLoading(false);
      return;
    }


    const fetchTrainer = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/trainer/me`, {
          headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setTrainer(data);
      setLoading(false);
      } catch (error) {
        console.log("Erreur lors de la récupération du profil :", error);
        setLoading(false);
      }
    };
    fetchTrainer();
  }, []);

  if (loading) {
    return (
      <div className="profil-page__card">
        <p>Chargement...</p>
      </div>
    );
  }

  if (!trainerData) {
    return (
      <div className="profil-page__card">
        <p>Aucun données sur votre compte trouvé</p>
      </div>
    );
  }

  return (
    <div className="profil-page__card">
      {loading ? (
        <p>Chargement...</p>
      ) : (
        <>
      <div className="profil-page__card__header">
        <img
          src={trainerData.image}
          alt={trainerData.name}
          className="profil-page__card__image"
        />
        <div className="profil-page__card__info">
          <h2>{trainerData.name}</h2>
          <p>{trainerData.level} niveau</p>
          <p>{trainerData.exp} exp</p>
          <p>{trainerData.gender}</p>
          <p>{trainerData.height} m</p>
          <p>{trainerData.weight} kg</p>
          <p>{trainerData.description}</p>
        </div>
      </div>

      <h3>Teams de Pokémon</h3>
      <div className="profil-page__card__teams">
        { 
          trainerData.pokemons?.length > 0 ? (
            trainerData.pokemons?.map((pokemon, index) => (
              <p key={`pokemon-${index}`}>{String(pokemon.name)}</p>
            ))
          ) : (
            <p>Aucun Pokémon</p>
          )
        }
      </div>
      </>
      )}
    </div>
  );
}

export default CardProfil;
