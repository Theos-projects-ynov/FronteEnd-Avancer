import { ITrainer } from "../../type/Trainer";
import "../../style/component/card/cardProfil.scss";
import { useEffect } from "react";
import { IPokemon } from "../../type/Pokemon";


function CardProfil({ trainer }: { trainer: ITrainer }) {

    useEffect(() => {
        console.log("Load : ", trainer.name);
        console.log("Not load : ", trainer.teamPokemon);
    }, [trainer.name]);

    return (
        <div className="profil-page__card">
            <h2>{trainer.name}</h2>
            <p>{trainer.age} ans</p>
            <p>{trainer.money} $</p>
            <p>{trainer.level} niveau</p>
            <p>{trainer.exp} exp</p>
            <p>{trainer.gender}</p>
            <p>{trainer.height} m</p>
            <p>{trainer.weight} kg</p>
            <p>{trainer.description}</p>

            <h3>Teams de Pokémon</h3>
            <div className="profil-page__card__teams">
                {trainer.teamPokemon?.map((pokemon, index) => (
                    <p key={index + pokemon.name}>{pokemon.name}</p>
                ))}
            </div>
        </div>
    );
}

export default CardProfil;