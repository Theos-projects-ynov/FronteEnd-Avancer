import "../../style/page/profilPage.scss";
import { ITrainer } from "../../type/Trainer";
import { IPokemon } from "../../type/Pokemon";
import CardProfil from "../card/CardProfil";
import CarrouselCard from "../card/CarrouselCard";
import { useEffect, useState } from "react";
import axios from "axios";
import { useTrainerSelector } from "../../hooks/useSelector";
import { useDispatcher } from "../../hooks/useDispatcher";
import {
  Box,
  TextField,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";

function ProfilPage() {
  // Utilisation des hooks personnalisés Redux
  const { trainers: reduxTrainers, activeTrainer: reduxActiveTrainer } =
    useTrainerSelector();
  const { createTrainer } = useDispatcher();

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
  const [localTrainers, setLocalTrainers] =
    useState<ITrainer[]>(initialTrainers);
  const [localActiveTrainer, setLocalActiveTrainer] = useState<ITrainer>(
    initialTrainers[0]
  );

  const genTeamPokemon = async (): Promise<IPokemon[]> => {
    let data: Array<Record<string, any>> = [];
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
        talents: random.talents.map((t: { name: string }) => t.name).join(", "),
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
        setLocalTrainers(updated);
        setLocalActiveTrainer(updated[0]);
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : "Une erreur est survenue";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    loadAllTeams();
  }, []);

  const handleTrainerActive = (index: number) => {
    setLocalActiveTrainer(localTrainers[index]);
  };

  const [name, setName] = useState("");
  const [region, setRegion] = useState("");

  const handleCreateTrainer = () => {
    if (name.trim()) {
      createTrainer(name, region);
      setName("");
      setRegion("");
    }
  };

  return (
    <>
      <Typography variant="h4" className="profil-page__title">
        Profil
      </Typography>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error" className="profil-page__error">
          Erreur : {error}
        </Typography>
      ) : (
        <>
          <CarrouselCard
            trainers={localTrainers}
            handleTrainerActive={handleTrainerActive}
            trainersActive={localActiveTrainer}
          />
          <CardProfil trainer={localActiveTrainer} />

          <TextField
            label="Nom du dresseur"
            value={name}
            onChange={(e) => setName(e.target.value)}
            size="small"
          />
          <TextField
            label="Région"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            size="small"
          />
          <Button
            variant="contained"
            onClick={handleCreateTrainer}
            disabled={!name.trim()}
          >
            Créer un dresseur
          </Button>
        </>
      )}
    </>
  );
}

export default ProfilPage;
