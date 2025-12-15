import { useState, useEffect } from 'react'
function Poke() {
  const [pokemonList, setPokemonList] = useState([]);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [loadingList, setLoadingList] = useState(true);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');

  const filteredPokemon = pokemonList.filter(pokemon =>
    pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
);

  // Fetch the list of first 151 Pokémon
  useEffect(() => {
    async function fetchPokemonList() {
      try {
        const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0');
        const data = await res.json();
        setPokemonList(data.results);
        setLoadingList(false);
      } catch (err) {
        setError(err.message);
        setLoadingList(false);
      }
    }
    fetchPokemonList();
  }, []);

  // Fetch details when a Pokémon is selected
  async function fetchPokemonDetails(url) {
    setLoadingDetails(true);
    try {
      const res = await fetch(url);
      const data = await res.json();
      setSelectedPokemon(data);
      setLoadingDetails(false);
    } catch (err) {
      setError(err.message);
      setLoadingDetails(false);
    }

    function useDebounce(value, delay) {
    const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
  }

  if (loadingList) return <p>Loading Pokémon list...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="pock">
    <div style={{ display: 'flex', flexDirection: 'row-reverse',}}>
      {/* List */}
      <div style={{ width: '40%', overflowY: 'scroll', height: '90vh', borderRight: '1px solid gray' }}>
        <h2>Pokédex</h2>
      <input
    type="text"
    placeholder="Search Pokémon..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    style={{ width: '90%', padding: '5px', marginBottom: '10px' }}
  />
  <ul style={{ listStyle: 'none', padding: 0 }}>
    {filteredPokemon.map((pokemon) => (
      <li
        key={pokemon.name}
        onClick={() => fetchPokemonDetails(pokemon.url)}
        style={{ cursor: 'pointer', margin: '10px 0', textTransform: 'capitalize' }}
      >
        {pokemon.name}
      </li>
    ))}
  </ul>
      </div>
      

      {/* Details */}
      <div className img style={{ width: '60%', padding: '50px' }}>
        {loadingDetails && <p>Loading details...</p>}
        {!selectedPokemon && <p>Click a Pokémon to see details.</p>}
        {selectedPokemon && (
          <div>
            <h2 style={{ textTransform: 'capitalize' }}>{selectedPokemon.name}</h2>
            <img src={selectedPokemon.sprites.front_default} alt={selectedPokemon.name} />
            <p><strong>Height:</strong> {selectedPokemon.height}</p>
            <p><strong>Weight:</strong> {selectedPokemon.weight}</p>
            <p><strong>Types:</strong> {selectedPokemon.types.map(t => t.type.name).join(', ')}</p>
            <p><strong>Abilities:</strong> {selectedPokemon.abilities.map(a => a.ability.name).join(', ')}</p>
          </div>
        )}
      </div>
    </div>

    </div>
  );
}

export default Poke
