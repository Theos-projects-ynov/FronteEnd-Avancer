import { ITrainer } from "../../type/Trainer";
import { IPokemon } from "../../type/Pokemon";
import "../../style/component/card/cardProfil.scss";
import React from "react";

function CardProfil({ name, teamPokemon }: { name: string; teamPokemon: IPokemon[] }) {
    return (
        <div className="profil-card">
            <h2>{name}</h2>
            <div className="team">
                {teamPokemon?.map(p => (
                    <img key={p.name} src={p.image} alt={p.name} />
                ))}
            </div>
        </div>
    );
}
export default CardProfil; 