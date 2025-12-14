const encounters = (function(){
    function getVersionEncounters(locArea,version='red'){
        const encounters = locArea.pokemon_encounters
        const newEncounters = []
        encounters.forEach(encounter => {
            let done = false;

            for(let i = 0; i< encounter.version_details.length;i++){
                if (encounter.version_details[i].version.name === version){
                    newEncounters.push({"pokemon": encounter.pokemon,"version_details": encounter.version_details[i]})
                    done = true
                }
                if (done){
                        return
                    }
            }
        })
        return newEncounters
    }
    function getEncounters(locArea,method='walk',version='red'){
        const encounterChances = {}
        const encounters = getVersionEncounters(locArea,version)
        encounters.forEach(encounter => {
            let index = 0
            let pokemonName = encounter.pokemon.name
            encounterChances[pokemonName] = {"max_chance": encounter.version_details.max_chance}
            encounter.version_details.encounter_details.forEach(details => {
                if (details.method.name === method || method === 'all'){
                    encounterChances[pokemonName][index++] = details
                }
            })
        })
        return encounterChances
    }
    function getPokemonEncounter(encounters,method='walk',version='red'){
        // const encounters = getEncounters(locArea,method,version)
        const p = getWeightedPokemonIndex(encounters,method)
        const i = getWeightedPokemonIndex(encounters[p])        
        
        return {
            name: p,
            details: encounters[p][i],
            level: getLevel(encounters[p][i])
        }
        

    }
    function getLevel(encounter){
        const min = encounter.min_level - 1
        return getRandom((encounter.max_level - min))+min
    }

    // this function will either get the name of a pokemon or the details of the pokemon
    function getWeightedPokemonIndex(encounters,method='walk'){
        let weight = 0
        let index = 0
        let element;
        const chance = getRandom(encounters.max_chance ?? 100)
        const keys = Object.keys(encounters)

        for (index; index < keys.length; index++) {
            element = encounters[keys[index]];

            if(element[0]){
                if(element[0].method.name !== method){
                    continue
                }
            }

            weight+= element.max_chance ?? element.chance
            if (keys.length === 2 && element.max_chance === 50){
                index = (getRandom(2)-1)
                break
            }
            else if(weight >= chance){
                break
            }           
        }

        return keys[index]
    }

    function getRandom(x){
        return (Math.ceil(Math.random()*x))
    }

    return{
        getVersionEncounters,
        getEncounters,
        getPokemonEncounter
    }
}())
export default encounters