

export async function getPokemon() {
    const response = await fetch(`https://tyradex.app/api/v1/gen/1`);
    const data = await response.json();
    return data;
}

