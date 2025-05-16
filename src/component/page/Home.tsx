import { useEffect, useState } from "react";
import {
  getPokemonByGeneration as getPokemonTest,
  Pokemon,
} from "../../service/api";
import "../../style/page/home.scss";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [generation, setGeneration] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);

  const loadGeneration = async (generation: number) => {
    setLoading(true);
    try {
      const data = await getPokemonTest(generation);
      setPokemons(data);
      setGeneration(generation);
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGeneration(generation);
  }, [generation]);

  const handleNextGeneration = () => {
    const nextGen = generation + 1;
    if (nextGen <= 9) {
      loadGeneration(nextGen);
    }
  };

  const handlePreviousGeneration = () => {
    const previousGen = generation - 1;
    if (previousGen >= 1) {
      loadGeneration(previousGen);
    }
  };

  const changeNumberGeneration = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newGeneration = Number(e.target.value);
    if (newGeneration >= 1 && newGeneration <= 9) {
      loadGeneration(newGeneration);
    }
  };

  return (
    <div className="home">
      <h1 className="title-home">PokéDex</h1>

      <div className="content-container">
        <h2 className="title-generation">Génération {generation}</h2>

        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
          </div>
        ) : (
          <>
            <div className="pokemon-grid">
              {pokemons.map((pokemon) => (
                <div key={pokemon.pokedex_id} className="pokemon-card">
                  <div
                    className="card"
                    onClick={() => {
                      navigate(`/pokemon/${pokemon.pokedex_id}`);
                    }}
                  >
                    <div className="card-image-container">
                      <img
                        src={pokemon.sprites.regular}
                        alt={pokemon.name.fr}
                        className="card-image"
                      />
                    </div>
                    <div className="card-content">
                      <h3 className="card-title">{pokemon.name.fr}</h3>
                      <p className="card-subtitle">
                        #{pokemon.pokedex_id} - {pokemon.category}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="button-container">
              {generation === 1 ? (
                <></>
              ) : (
                <>
                  <button
                    className="load-button"
                    onClick={handlePreviousGeneration}
                    disabled={loading}
                  >
                    ⬅️ Charger Génération {generation - 1}
                  </button>
                </>
              )}

              <input
                type="number"
                value={generation}
                className="generation-input"
                onChange={changeNumberGeneration}
                min={1}
                max={9}
              />

              {generation === 9 ? (
                <></>
              ) : (
                <button
                  className="load-button"
                  onClick={handleNextGeneration}
                  disabled={generation >= 9 || loading}
                >
                  ➡️ Charger Génération {generation + 1}
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
