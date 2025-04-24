import { ITrainer } from "../../type/Trainer";
import IconProfils from "./IconProfils";
import "../../style/component/card/carrouselCard.scss";
import { useEffect } from "react";

function CarrouselCard({ trainers, handleTrainerActive, trainersActive }: { trainers: ITrainer[], handleTrainerActive: (id: number) => void, trainersActive: ITrainer | null }) {

    useEffect(() => {
        console.log("trainers DEDE : ", trainers);
    }, [trainers]);

    return (
        <div className="carrousel-card">
            <div className="carrousel-card__container">
                {trainers.map((trainer, index) => (
                    <IconProfils key={trainer.name} image={trainer.image} handleTrainerActive={handleTrainerActive} id={index} isActive={trainer.name === trainersActive?.name} />
                ))}
            </div>
        </div>
    );
}

export default CarrouselCard;