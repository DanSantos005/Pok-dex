const express = require('express');
const path = require('path');
const pokedexData = require('./pokedex.json');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public'))); //Configures middleware to serve static files from "public" folder

// Route to get Pokédex data without duplicates
app.get('/api/pokedex', (req, res) => {
  const uniquePokemonIds = new Set(); // Create a new set to store unique Pokémon IDs

// Filter Pokédex data to eliminate duplicates
// If the Pokémon ID is not in the set, add it and return true (to include it in the result)
// If the Pokémon ID already in the set, return false (to exclude it from the results)
  const uniquePokedexData = pokedexData.filter(pokemon => {
    if (!uniquePokemonIds.has(pokemon.id)) {
      uniquePokemonIds.add(pokemon.id);
      return true;
    }
    return false;
  });

  // Send the response with filtered data omitting duplicates
  res.json(uniquePokedexData);
});

// Starting route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
