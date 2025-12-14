'use strict';
import encounterEventListener,{createPokemon} from "./scripts/eventListeners/encounterEventListener.js";
import listeners from "./scripts/eventListeners/EventListners.js";
import addEvent from "./scripts/eventListeners/AddEvent.js";
import setMessage from "./scripts/SetMessage.js";
import Pokemon from "./Pokemon.js";

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
    player.pokemon.forEach(pokemon => Object.setPrototypeOf(pokemon,Pokemon.prototype))
    if(player.box.length)
        player.box.forEach(pokemon => Object.setPrototypeOf(pokemon,Pokemon.prototype))
}
    