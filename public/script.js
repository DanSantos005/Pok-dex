document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('search');
  const searchButton = document.getElementById('searchButton');
  const pokemonList = document.getElementById('pokemonList');

  const renderPokemon = pokemon => {
      const card = document.createElement('div');
      card.classList.add('col-md-3', 'mb-4');
      card.innerHTML = `
          <div class="card">
              <img src="${pokemon.ThumbnailImage}" class="card-img-top" alt="${pokemon.name}">
              <div class="card-body">
                  <h5 class="card-title">${pokemon.name}</h5>
                  <p class="card-text">${pokemon.type.join(', ')}</p>
                  <button class="btn btn-primary btn-sm details-btn" data-id="${pokemon.id}">Details</button>
              </div>
          </div>
      `;
      pokemonList.appendChild(card);
  };

  const renderModal = pokemon => {
      const modalBody = document.getElementById('modalBody');
      modalBody.innerHTML = `
          <p><strong>Name:</strong> ${pokemon.name}</p>
          <p><strong>Type:</strong> ${pokemon.type.join(', ')}</p>
          <p><strong>Weight:</strong> ${pokemon.weight} lbs</p>
          <p><strong>Height:</strong> ${pokemon.height} inches</p>
          <p><strong>Abilities:</strong> ${pokemon.abilities.join(', ')}</p>
          <p><strong>Weakness:</strong> ${pokemon.weakness.join(', ')}</p>
      `;
  };

  const fetchPokemonData = async searchTerm => {
    try {
        // Use the data that you fetched when the page loaded
        const data = await fetch('/api/pokclearedex').then(response => response.json());
        pokemonList.innerHTML = ''; // Cleans the list to show new results
        const filteredData = searchTerm ? 
                             data.filter(pokemon => pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())) :
                             data;

        if (filteredData.length > 0) {
            filteredData.forEach(pokemon => renderPokemon(pokemon));
        } else {
            pokemonList.innerHTML = `<p>You still have not caught "${searchTerm}". Try with another Pokémon, please.</p>`;
        }
    } catch (error) {
        console.error('Error fetching Pokémon data:', error);
    }
};


  fetchPokemonData();

  pokemonList.addEventListener('click', async event => {
    if (event.target.classList.contains('details-btn')) {
      const pokemonId = parseInt(event.target.dataset.id);
      try {
        const response = await fetch('/api/pokclearedex');  // Use the correct route here
        const data = await response.json();
        const pokemon = data.find(pokemon => pokemon.id === pokemonId);  // Match by ID
  
        if (pokemon) {
          renderModal(pokemon);  // Populate modal with the Pokémon data
          $('#pokemonModal').modal('show');  // Show the modal using Bootstrap
        }
      } catch (error) {
        console.error('Error fetching Pokémon details:', error);
      }
    }
  });
  

  searchButton.addEventListener('click', () => {
    const searchTerm = searchInput.value.trim();
    fetchPokemonData(searchTerm);
  });
});