'use strict';
import encounterEventListener,{createPokemon} from "./scripts/eventListeners/encounterEventListener.js";
import listeners from "./scripts/eventListeners/EventListners.js";
import addEvent from "./scripts/eventListeners/AddEvent.js";
import setMessage from "./scripts/SetMessage.js";

const starters = ['Bulbasaur','Charmander','Squirtle','']


function startGame(){
    listeners.start();
    window.addEventListener('pokemonEncounterEvent',encounterEventListener);
    opts[0].innerText = 'Routes'
    opts[1].innerText = 'Gyms'
    opts[2].innerText = 'Poke Center'
    opts[3].innerText = 'Poke Store'
}
 
if (!player.pokemon.length){
    blinkTwice()
    const interval = setInterval(()=>{blinkTwice()},3500)
    addEvent(controls[2],chooseStarter)

    function chooseStarter(){
        clearInterval(interval)
        setMessage("Choose Your Starting Pokemon")
        opts.forEach(opt =>{
            opt.innerText = starters[opt.index]
            addEvent(opt,()=>{startGame();addStarter(starters[opt.index].toLowerCase())})
        })
    }
    async function addStarter(pokemon){
        player.pokemon[0] = await createPokemon(pokemon,5)
        setMessage(`${pokemon} has been added to your Party!`)
        save()
        const player2 = JSON.parse(localStorage.getItem('player'))
    }
}
else{

    startGame()
    async function fromJson(pokemon){
        return await createPokemon(pokemon.name,pokemon.level)
    }
    player.pokemon.map(pokemon => {
        const tempMoves = pokemon.currentMoves;
        const newPokemon = fromJson(pokemon);
        newPokemon.currentMoves = tempMoves
        return newPokemon
    })
    await Promise.all(player.pokemon)
    if(player.box.length){
        player.box.map(pokemon => {
            const tempMoves = pokemon.currentMoves;
            const newPokemon = fromJson(pokemon);
            newPokemon.currentMoves = tempMoves
            return newPokemon
        })
        await Promise.all(boxPromises)
    }
}
    