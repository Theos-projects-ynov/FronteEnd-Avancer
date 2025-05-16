import { useEffect, useState } from "react";
import "../../style/page/home.scss";
import { useNavigate } from "react-router-dom";
import { useGetPokemonByGenerationQuery } from "../../api/PokemonAPI";
import { IPokemon } from "../../type/Pokemon";

const Home = () => {
  const navigate = useNavigate();

  const [pokemons, setPokemons] = useState<IPokemon[]>([]);
  const [generation, setGeneration] = useState<number>(1);

  const {
    data: pokemonsData,
    isLoading,
    isError,
  } = useGetPokemonByGenerationQuery(generation);

  useEffect(() => {
    console.log("chagement");

    console.log(pokemonsData);
    console.log(isLoading);
    console.log(isError);

    if (pokemonsData && !isLoading && !isError) {
      setPokemons(pokemonsData);
    }
  }, [pokemonsData, isLoading, isError]);

  const handleNextGeneration = () => {
    const nextGen = generation + 1;
    if (nextGen <= 9) {
      setGeneration(nextGen);
    }
  };

  const handlePreviousGeneration = () => {
    const previousGen = generation - 1;
    if (previousGen >= 1) {
      setGeneration(previousGen);
    }
  };

  const changeNumberGeneration = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newGeneration = Number(e.target.value);
    if (newGeneration >= 1 && newGeneration <= 9) {
      setGeneration(newGeneration);
    }
  };

  return (
    <div className="home">
      <h1 className="title-home">PokéDex</h1>

      <div className="content-container">
        <h2 className="title-generation">Génération {generation}</h2>

        <div className="button-container">
          {generation === 1 ? (
            <></>
          ) : (
            <>
              <button
                className="load-button"
                onClick={handlePreviousGeneration}
                disabled={isLoading}
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
              disabled={generation >= 9 || isLoading}
            >
              ➡️ Charger Génération {generation + 1}
            </button>
          )}
        </div>

        {isLoading ? (
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
                    disabled={isLoading}
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
                  disabled={generation >= 9 || isLoading}
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
