import "../../style/page/profilPage.scss";
import { ITrainer } from "../../type/Trainer";
import { IPokemon } from "../../type/Pokemon";
import CardProfil from "../card/CardProfil";
import CarrouselCard from "../card/CarrouselCard";
import { useEffect, useState } from "react";
import axios from "axios";

function ProfilPage() {
    const initialTrainers: ITrainer[] = [
        {
            name: "Sacha",
            age: 25,
            region: "Kanto",
            money: 1000,
            level: 1,
            exp: 0,
            gender: "Homme",
            height: 170,
            weight: 60,
            description: "Sacha est un jeune homme qui aime les Pokémon.",
            image:
                "https://i.pinimg.com/736x/3e/2c/ff/3e2cffde9d752d9aa565e58862d1edc0.jpg",
        },
        {
            name: "Ondine",
            age: 25,
            region: "Kanto",
            money: 1000,
            level: 1,
            exp: 0,
            gender: "Femme",
            height: 170,
            weight: 60,
            description: "Ondine est une jeune fille qui aime les Pokémon.",
            image:
                "https://th.bing.com/th/id/OIP.9wSIMg4oAVv6s7xuouhdWQHaHa?rs=1&pid=ImgDetMain",
        },
    ];

    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [trainers, setTrainers] = useState<ITrainer[]>(initialTrainers);
    const [activeTrainer, setActiveTrainer] = useState<ITrainer>(
        initialTrainers[0]
    );

    const genTeamPokemon = async (): Promise<IPokemon[]> => {
        let data: any[] = [];
        try {
            const response = await axios.get("https://tyradex.app/api/v1/gen/1");
            data = response.data;
        } catch (err) {
            console.error("Erreur fetch Pokémon :", err);
            throw err;
        }

        const team: IPokemon[] = [];
        for (let i = 0; i < 6; i++) {
            const random = data[Math.floor(Math.random() * data.length)];
            team.push({
                name: random.name.fr,
                type: random.type,
                level: 0,
                exp: 0,
                image: random.image,
                description: random.description,
                stats: random.stats,
                talents: random.talents.map((t: any) => t.name).join(", "),
                weaknesses: random.weaknesses,
                resistances: random.resistances,
                gender:
                    random.sexe && Math.random() * 100 < random.sexe.female
                        ? "Féminin"
                        : "Masculin",
                height: random.height,
                weight: random.weight,
                category: random.category,
                moves: random.moves,
            });
        }
        return team;
    };

    useEffect(() => {
        const loadAllTeams = async () => {
            setLoading(true);
            setError(null);

            try {
                const updated = await Promise.all(
                    initialTrainers.map(async (trainer) => {
                        const team = await genTeamPokemon();
                        return { ...trainer, teamPokemon: team };
                    })
                );
                setTrainers(updated);
                setActiveTrainer(updated[0]);
            } catch (err: any) {
                setError(err.message || "Une erreur est survenue");
            } finally {
                setLoading(false);
            }
        };

        loadAllTeams();
    }, []);

    const handleTrainerActive = (index: number) => {
        setActiveTrainer(trainers[index]);
    };

    return (
        <>
            <h1 className="profil-page__title">Profil</h1>

            {loading ? (
                <p>Chargement...</p>
            ) : error ? (
                <p className="profil-page__error">Erreur : {error}</p>
            ) : (
                <>
                    <CarrouselCard
                        trainers={trainers}
                        handleTrainerActive={handleTrainerActive}
                        trainersActive={activeTrainer}
                    />
                    <CardProfil trainer={activeTrainer} />
                </>
            )}
        </>
    );
}

export default ProfilPage;
