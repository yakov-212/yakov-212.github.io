import areaLocations from '../../data/AreaLocations.json' with {type: 'json'}
import Pokemon from '../../Pokemon.js'
import encounters from '../Encounters.js'
import changeToEncounterMenu, {setHealthText}from '../Battle.js'
import setMessage from '../SetMessage.js'


export default async function encounterEventListener(e){

    const enc = encounters.getPokemonEncounter(areaLocations[e.detail.loc].areas[e.detail.index].locArea)
    encOp = await createPokemon(enc.name,enc.level)
    images[0].src = encOp.data.sprites.front_default
    images[1].src = player.pokemon[0].data.sprites.back_default
    battleScreen.style.display = "grid"
    setMessage(`a wild ${encOp.name} has appeared`)
    setHealthText()
    changeToEncounterMenu()
    player.pokemon.forEach(pokemon =>{pokemon.statStage = {attack: 0,defence:0,speed:0,special_attack:0,special_defence:0,accuracy: 0};})
}

export async function createPokemon(name,level){
    const encPokemon = await P.getPokemonByName(name)
    const encSpecies = await P.getPokemonSpeciesByName(name)
    const evChainId = encSpecies.evolution_chain.url.slice(42).replace('/','')
    let evolves_to = 'none'
    let evolves_at = 'none'
    try{
        const evChain = await P.getEvolutionChainById(evChainId)
        evolves_to = evChain.chain.evolves_to[0].species.name
        evolves_at = evChain.chain.evolves_to[0].evolution_details[0].min_level
    }
    catch{console.log('caught')}
    

    const speciesData = {'capture_rate':encSpecies.capture_rate,'evolves_to':evolves_to,'evolves_at':evolves_at,'growth_rate':encSpecies.growth_rate.name}
    return new Pokemon(level,encPokemon,speciesData)

}