import "../../style/component/card/IconProfil.scss";
import { ITrainer } from "../../type/trainer";
import { useEffect } from "react";

function IconProfils({ image, handleTrainerActive, id, isActive }: { image: string, handleTrainerActive: (id: number) => void, id: number, isActive: boolean }) {
    useEffect(() => {
        console.log("image : ", image);
    }, [image]);

    return (
        <div className={`icon-profil ${isActive ? "active" : ""}`} onClick={() => handleTrainerActive(id)}>
            <img src={image} alt="icon" />
        </div>
    );
}

export default IconProfils;