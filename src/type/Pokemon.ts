export type IPokemon = {
    name: string;
    type: string;
    image: string;
    description: string;
    stats: {
        hp: number;
        attack: number;
        defense: number;
        specialAttack: number;
        specialDefense: number;
        speed: number;
    }
    gender?: "Masculin" | "Féminin";
    talents: string[];
    weaknesses: string[];
    resistances: string[];
    moves: string[];
    height: string;
    weight: string;
    category: string;
    level: number;
    exp: number;
}