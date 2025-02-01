//List of variables by get element
const pokemonName = document.getElementById("pokemonName");
const pokedexNumber = document.getElementById("pokedexNumber");
const pokemonType = document.getElementById("pokemonType");
const pokemonPicture = document.getElementById("pokemonPicture");
const togglePicture = document.getElementById("togglePicture")
const showLocation = document.getElementById("showLocation")
const showAbilities = document.getElementById("showAbilities")
const showMoves = document.getElementById("showMoves")
const showEvolution = document.getElementById("showEvolution")
const textBox = document.getElementById("textBox")
const searchButton = document.getElementById("searchButton")
const searchInput = document.getElementById("searchInput")
const randomBtn = document.getElementById("randomBtn")
const toggleFavorite = document.getElementById("toggleFavorite")
const showFavorites = document.getElementById("showFavorites")
const textBoxParent = document.getElementById("textBoxParent")
const favoriteList = document.getElementById("favoriteList")

//List of async functions
const getPokemon = async (pokemon) => {
    const fetchData = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`)
    const data = await fetchData.json();

    return data;
}

const getSpecies = async(pokemon) =>{
    const fetchData = await fetch (`https://pokeapi.co/api/v2/pokemon-species/${pokemon}/`)
    const data = await fetchData.json()

    return data
}
const getEvolution = async(evolutionChain) =>{
    const fetchData = await fetch(evolutionChain)
    const data = await fetchData.json()

    return data
}
const getLocation = async (id) => {
    const fetchData = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/encounters`)
    const data = await fetchData.json()

    return data;
}

//Set variables equal to values I need
let abilities = [];
let movesPokemon = [];
let pokedex = 0;
let pokemonAPIName = "";
let pokemonEncounter = [];
let pokemonElements = [];
let picture = "";
let shinyPicture = "";
let pokemonEvolution = [];
let evolutionChain= "";
let evolutionNames = []

const parseData = async (userInput) => {
    let data;

    if (userInput == null) {
        data = await getPokemon("mewtwo");
    }
    else {
        data = await getPokemon(userInput)
    }

    
    //To get the ID and Name
    pokedex = data.id;
    pokemonAPIName = data.name;
    
    let speciesData = await getSpecies(pokedex);
    evolutionChain = speciesData.evolution_chain.url;
    let chainData = await getEvolution(evolutionChain)
    //get evolution names

    if(chainData.chain.evolves_to.length != null){

        if (chainData.chain.evolves_to.length > 1){
            evolutionNames.push(chainData.chain.species.name)
            for (let i = 0; i < chainData.chain.evolves_to.length; i++){
                let checkPokeId = await getPokemon(chainData.chain.evolves_to[i].species.name)
                if(checkPokeId.id < 650){
                    evolutionNames.push(chainData.chain.evolves_to[i].species.name)
                }
            }
        }
        else{
            checkForSpecies(chainData)
        }
    }


    if (pokedex > 649){
        parseData("ditto")
        clearData("You cannot search anything outside of Gen I to Gen V. Here is Ditto instead")
    }

    picture = data.sprites.front_default;
    if (data.sprites.front_shiny) {
        shinyPicture = data.sprites.front_shiny
    }
    else shinyPicture = ""


    let locationData = await getLocation(pokedex)

    //  for loop to push all abilities into variable "abilities"
    for (let i = 0; i < data.abilities.length; i++) {
        abilities.push(data.abilities[i].ability.name)
    }
    //for loop to push all moves into variable moves
    for (let i = 0; i < data.moves.length; i++) {
        movesPokemon.push(data.moves[i].move.name)
    }
    //if statement to for assigning location information for pokemon
    if (locationData.length > 0) {
        for (let i = 0; i < locationData.length; i++) {
            pokemonEncounter.push(locationData[i].location_area.name);
        }
    }
    else pokemonEncounter.push("N/A");

    //for loop to push all element types into variable 
    for (let i = 0; i < data.types.length; i++) {
        pokemonElements.push(data.types[i].type.name)
    }


    //To change teh innerText
    pokemonName.innerText = "Name: " + pokemonAPIName;
    pokedexNumber.innerText ="Pokedex#" + pokedex;
    pokemonType.innerText ="Type: " + pokemonElements.join(" | ")
    pokemonPicture.src = picture;
    pokemonPicture.alt = "front default of " + pokemonAPIName;
    let determineFavorite = getLocalStorage();
    if (!determineFavorite.includes(pokemonAPIName)){
        toggleFavorite.innerHTML =`<svg class="h-full w-full regular" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M225.8 468.2l-2.5-2.3L48.1 303.2C17.4 274.7 0 234.7 0 192.8l0-3.3c0-70.4 50-130.8 119.2-144C158.6 37.9 198.9 47 231 69.6c9 6.4 17.4 13.8 25 22.3c4.2-4.8 8.7-9.2 13.5-13.3c3.7-3.2 7.5-6.2 11.5-9c0 0 0 0 0 0C313.1 47 353.4 37.9 392.8 45.4C462 58.6 512 119.1 512 189.5l0 3.3c0 41.9-17.4 81.9-48.1 110.4L288.7 465.9l-2.5 2.3c-8.2 7.6-19 11.9-30.2 11.9s-22-4.2-30.2-11.9zM239.1 145c-.4-.3-.7-.7-1-1.1l-17.8-20-.1-.1s0 0 0 0c-23.1-25.9-58-37.7-92-31.2C81.6 101.5 48 142.1 48 189.5l0 3.3c0 28.5 11.9 55.8 32.8 75.2L256 430.7 431.2 268c20.9-19.4 32.8-46.7 32.8-75.2l0-3.3c0-47.3-33.6-88-80.1-96.9c-34-6.5-69 5.4-92 31.2c0 0 0 0-.1 .1s0 0-.1 .1l-17.8 20c-.3 .4-.7 .7-1 1.1c-4.5 4.5-10.6 7-16.9 7s-12.4-2.5-16.9-7z"/></svg>`
    }
    else{
        toggleFavorite.innerHTML= `<svg class="h-full w-full favorite" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z"/></svg>`
    }
}

parseData()

const checkForSpecies = async (chainData)=>{
    let newChain = chainData.chain;
    do {
        let checkPokeId = await getPokemon(newChain.species.name)
        if (checkPokeId.id < 650){
            evolutionNames.push(newChain.species.name)
        }
        
        newChain = newChain.evolves_to[0];
    } 
    while (newChain != null);
}

//---Button event listeners---

//toggle pickture
togglePicture.addEventListener("click", () => {
    if (pokemonPicture.src !== shinyPicture) {
        pokemonPicture.src = shinyPicture;
    }
    else pokemonPicture.src = picture;;
})

//Text for Abilities, Moves, Evolution, and Location
showAbilities.addEventListener("click", () => {
    textBox.innerText = abilities.join(" | ");

    showAbilities.classList.add("border-red-500")
    showLocation.classList.remove("border-red-500")
    showMoves.classList.remove("border-red-500")
    showEvolution.classList.remove("border-red-500")
})
showMoves.addEventListener("click", () => {
    textBox.innerText = movesPokemon.join(" | ");

    showMoves.classList.add("border-red-500")
    showLocation.classList.remove("border-red-500")
    showAbilities.classList.remove("border-red-500")
    showEvolution.classList.remove("border-red-500")
})
showEvolution.addEventListener("click", () => {
    textBox.innerText = evolutionNames.join(" | ");

    showEvolution.classList.add("border-red-500")
    showLocation.classList.remove("border-red-500")
    showMoves.classList.remove("border-red-500")
    showAbilities.classList.remove("border-red-500")
})

showLocation.addEventListener("click", () => {
    textBox.innerText = pokemonEncounter.join(" | ")

    showLocation.classList.add("border-red-500")
    showEvolution.classList.remove("border-red-500")
    showMoves.classList.remove("border-red-500")
    showAbilities.classList.remove("border-red-500")
})

const favoriteDiv= document.createElement("div")
const favoriteHeader = document.createElement("h2");
showFavorites.addEventListener("click", () => {

    favoriteDiv.innerHTML=""
    favoriteHeader.innerHTML=""

    textBox.classList.add("hidden")

    favoriteHeader.innerText = "Visit all your favorites\nPick a pokemon before continuing."
    favoriteList.appendChild(favoriteHeader)
    favoriteList.classList.remove("hidden")
    
    favoriteDiv.id = "favoriteDiv"
    favoriteDiv.className = "flex justify-around"
    textBoxParent.appendChild(favoriteDiv)


    getLocalStorage().forEach(element => {
        const favoriteBtn = document.createElement("button")
        favoriteBtn.id = element;
        const favoriteBtnText = document.createElement("p")
        favoriteBtnText.innerText = element;

        favoriteBtnText.className= "hover:text-red-600 mt-8"

        favoriteBtn.appendChild(favoriteBtnText)
        favoriteDiv.appendChild(favoriteBtn);

        favoriteBtn.addEventListener("click", ()=>{
            clearData()
            parseData(element)
            favoriteList.classList.add("hidden")
            favoriteList.removeChild(favoriteHeader)
            textBoxParent.removeChild(favoriteDiv)
            textBox.classList.remove("hidden")
        })
        
    });
    textBox.innerText = getLocalStorage().join(" | ")

    showLocation.classList.add("border-red-500")
    showEvolution.classList.remove("border-red-500")
    showMoves.classList.remove("border-red-500")
    showAbilities.classList.remove("border-red-500")
})

const clearData = (message)=>{
    if (message ==null){
        textBox.innerText =""
    }
    else {
        textBox.innerText =message
    }


    abilities = [];
    movesPokemon = [];
    pokedex = 0;
    pokemonAPIName = "";
    pokemonEncounter = [];
    pokemonElements = [];
    picture = "";
    shinyPicture = "";
    pokemonEvolution = [];
    evolutionNames = []
    
    showLocation.classList.remove("border-red-500")
    showEvolution.classList.remove("border-red-500")
    showMoves.classList.remove("border-red-500")
    showAbilities.classList.remove("border-red-500")
}

//Search Function
searchButton.addEventListener("click", () => {
    clearData()
    parseData(searchInput.value)
})
searchInput.addEventListener("keyup", (e)=>{
    if (e.key === "Enter"){
        clearData()    
        parseData(searchInput.value)
    }
    
})
randomBtn.addEventListener("click", async()=>{
    let idNumber = Math.floor(Math.random() * 649);
  
    clearData()
    parseData(idNumber)
})

//favorite event listener to add or remove items from local storage
toggleFavorite.addEventListener("click", ()=>{
    let currentSVG = toggleFavorite.querySelector("svg")

    //save current pokemon to favorites else we want to remove it
    if( currentSVG.classList.contains("regular")){
        toggleFavorite.innerHTML= `<svg class="h-full w-full favorite" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z"/></svg>`
        //saveToFavorites
        saveToFavorites()
    }
    else{
        toggleFavorite.innerHTML =`<svg class="h-full w-full regular" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M225.8 468.2l-2.5-2.3L48.1 303.2C17.4 274.7 0 234.7 0 192.8l0-3.3c0-70.4 50-130.8 119.2-144C158.6 37.9 198.9 47 231 69.6c9 6.4 17.4 13.8 25 22.3c4.2-4.8 8.7-9.2 13.5-13.3c3.7-3.2 7.5-6.2 11.5-9c0 0 0 0 0 0C313.1 47 353.4 37.9 392.8 45.4C462 58.6 512 119.1 512 189.5l0 3.3c0 41.9-17.4 81.9-48.1 110.4L288.7 465.9l-2.5 2.3c-8.2 7.6-19 11.9-30.2 11.9s-22-4.2-30.2-11.9zM239.1 145c-.4-.3-.7-.7-1-1.1l-17.8-20-.1-.1s0 0 0 0c-23.1-25.9-58-37.7-92-31.2C81.6 101.5 48 142.1 48 189.5l0 3.3c0 28.5 11.9 55.8 32.8 75.2L256 430.7 431.2 268c20.9-19.4 32.8-46.7 32.8-75.2l0-3.3c0-47.3-33.6-88-80.1-96.9c-34-6.5-69 5.4-92 31.2c0 0 0 0-.1 .1s0 0-.1 .1l-17.8 20c-.3 .4-.7 .7-1 1.1c-4.5 4.5-10.6 7-16.9 7s-12.4-2.5-16.9-7z"/></svg>`
        //removeFromFavorites
        removeFromFavorites()
    }
})

const saveToFavorites = () =>{
let storedPokemons = getLocalStorage();

if (!storedPokemons.includes(pokemonAPIName)){
    storedPokemons.push(pokemonAPIName);
}
localStorage.setItem("favoritePokemon", JSON.stringify(storedPokemons))
}
const removeFromFavorites = ()=>{
    let storedPokemons = getLocalStorage();
    let nameIndex = storedPokemons.indexOf(pokemonAPIName)

    storedPokemons.splice(nameIndex, 1)
    localStorage.setItem("favoritePokemon", JSON.stringify(storedPokemons))
}
const getLocalStorage = ()=>{
    let localStorageData = localStorage.getItem("favoritePokemon");

    if (localStorageData == null) {
        return []
    }
    return JSON.parse(localStorageData);
}