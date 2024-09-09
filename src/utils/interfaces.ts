// Interface for Pokémon data
export interface PokemonStats {
  id: number;
  name: string;
  is_legendary: boolean;
  sprites: {
    versions: {
      "generation-viii": {
        icons: {
          front_default: string;
        };
      };
      "generation-v": {
        "black-white": {
          animated: {
            front_default: string;
            back_default: string;
            front_shiny: string;
            back_shiny: string;
          };
        };
      };
    };
    other: {
      home: {
        front_default: string;
      };
    };
  };
  weight: number;
  height: number;
  stats: Array<{
    base_stat: number;
    stat: {
      name: string;
    };
  }>;
  moves: Array<{
    move: {
      name: string;
    };
  }>;
  abilities: Array<{
    ability: {
      name: string;
    };
  }>;
  forms: Array<{
    name: string;
  }>;
  types: Array<{ type: { name: string } }>;
  past_types: Array<{ types: Array<{ type: { name: string } }> }>;
}

// Interface for Pokédex list
export interface PokeListProps {
  id: string;
  name: string;
  is_legendary: boolean;
  icon: string;
  homeImage: string;
  animatedImage: string;
  animatedImageBack: string;
  shinyAnimatedImage: string;
  shinyAnimatedImageBack: string;
  abilities: string[];
  //type: string[];
  //typeImages: string[];
  weight: number;
  height: number;
  stats: number[];
  statsName: string[];
  moves: string[];
  forms: string[];
  onAddToTeam: (
    pokemon: PokemonStats,
    team: TeamItem[],
    setTeam: React.Dispatch<React.SetStateAction<TeamItem[]>>
  ) => void;
  team: TeamItem[];
  pokemon: PokemonStats;
  setTeam: React.Dispatch<React.SetStateAction<TeamItem[]>>;
  getPokemonTypes: string[];
  getPokemonTypeImages: TypeImage[];
}

// Interface for each Pokémon team item
export interface TeamItem {
  pokemon: PokemonStats;
  isShiny: boolean;
}

// Interface for Team Builder
export interface TeamBuilderProps {
  team: TeamItem[];
  setTeam: React.Dispatch<React.SetStateAction<TeamItem[]>>;
  removeFromTeam: (
    pokemon: PokemonStats,
    team: TeamItem[],
    setTeam: React.Dispatch<React.SetStateAction<TeamItem[]>>
  ) => void;
  toggleShiny: (
    pokemon: PokemonStats,
    team: TeamItem[],
    setTeam: React.Dispatch<React.SetStateAction<TeamItem[]>>
  ) => void;
  addToTeam: (
    pokemon: PokemonStats,
    team: TeamItem[],
    setTeam: React.Dispatch<React.SetStateAction<TeamItem[]>>
  ) => void;
  moveSets: MoveData[];
  getMoveSets: (pokemonMoves: { move: { name: string } }[]) => string[];
  getAbilities: (pokemonAbilities: { ability: { name: string } }[]) => string[];
  allNatures: NatureData[];
  getPokemonTypes: (pokemon: PokemonStats) => string[];
  getPokemonTypeImages: (pokemon: PokemonStats) => TypeImage[];
}

// Interface for move data
export interface MoveData {
  id: number;
  name: string;
  accuracy: number | null;
  power: number | null;
  pp: number;
  //priority: number;
  effect_chance: number | null;
  effect_entries: {
    effect: string;
    short_effect: string;
    language: {
      name: string;
      url: string;
    };
  }[];
  type: {
    name: string;
    url: string;
  };
  damage_class: {
    name: string;
    url: string;
  };
}

// Interface for ability data
export interface AbilityData {
  id: number;
  name: string;
  effect_entries: {
    effect: string;
    language: {
      name: string;
      url: string;
    };
  }[];
  pokemon: {
    pokemon: {
      name: string;
      url: string;
    };
    slot: number;
  }[];
}

// Nested interface containing string for stat name
export interface Stat {
  name: string;
}

// Interface for nature data
export interface NatureData {
  url: string;
  id: number;
  name: string;
  increased_stat: Stat | null;
  decreased_stat: Stat | null;
}

// Interface for type images containing image(URL) and name strings
export interface TypeImage {
  image: string;
  name: string;
}

// Interface for Pokémon modal
export interface ModalProps {
  onClick: () => void;
  id: string;
  name: string;
  is_legendary: boolean;
  icon: string;
  homeImage: string;
  animatedImage: string;
  animatedImageBack: string;
  shinyAnimatedImage: string;
  shinyAnimatedImageBack: string;
  abilities: string[];
  type: string[];
  typeImages: TypeImage[];
  weight: number;
  height: number;
  //forms: string[];
  stats: number[];
  statsName: string[];
  moves: string[];
}

// Interface for ability details modal section
export interface AbilityDetailsModalProps {
  abilities: string[];
  selectedAbility: AbilityData;
  handleAbilityClick: (
    abilityName: string,
    fetchAbilityData: (abilityName: string) => Promise<AbilityData>,
    setSelectedAbility: (ability: AbilityData) => void
  ) => void;
  abilityData: AbilityData;
  setSelectedAbility: (ability: AbilityData) => void;
}

// Interface for move details modal section
export interface MoveDetailsModalProps {
  moves: string[];
  selectedMove: MoveData;
  handleMoveClick: (
    moveName: string,
    fetchMoveData: (moveName: string) => Promise<MoveData>,
    setSelectedMove: (move: MoveData) => void
  ) => void;
  moveData: MoveData;
  setSelectedMove: (move: MoveData) => void;
}

// Interface for the about modal
export interface AboutModalProps {
  closeAboutModalHandler: () => void;
}

// Interface for the search bar
export interface SearchBarProps {
  onSearch: (term: string, allPokemon: PokemonStats[]) => void;
  allPokemon: PokemonStats[];
}

// Interface for the species in the Pokémon entries
export interface PokemonSpecies {
  name: string;
}

// Interface for the entries in the Pokédex
export interface PokemonEntry {
  pokemon_species: PokemonSpecies;
}

// Interface for the overall Pokédex data
export interface PokedexResponse {
  pokemon_entries: PokemonEntry[];
}
