(async function(){
    const P = new Pokedex.Pokedex();
    const region = await P.getRegionByName("kanto");

    const locations = LocationFilter(region)

    async function getLocation(location){
       l = await P.getLocationByName(location.name)
        return l
    }
    async function getLocationArea(location){
        let locAreas = []
        location.areas.forEach(async function(locArea){
            locAreas.push(P.getLocationAreaByName(locArea.name))
        })
        locAreas = Promise.all(locAreas)
        return locAreas
    }
    function walkFilter(locAreas){
        let walk = false
        locAreas.forEach(locArea => {
            if(!locArea.encounter_method_rates.length){
                walk = false
            }
            locArea.encounter_method_rates.forEach(method => {
                if (method.encounter_method.name === "walk"){
                    walk = true
                    return
                }
            })
            //console.log(locArea.name,walk)
            if (locArea.name === "kanto-route-3-pokemon-center"){
                //console.log(locArea)
            }
        })
        //console.log(locAreas)
        return walk
    }

    async function filterLocations(locations) {
    // 1. Create an array of Promises that will resolve to true/false
    const resultsPromises = locations.map(async (location) => {
        // Fetch the location details asynchronously
        const locationDetails = await P.getLocationByName(location.name);

        // Get the location areas (using your corrected getLocationArea function)
        const locAreas = await getLocationArea(locationDetails);

        // Run the synchronous filter logic and return a boolean
        return walkFilter(locAreas);
    });

    // 2. Wait for all promises to resolve into an array of booleans: [true, false, true, ...]
    const shouldKeepArray = await Promise.all(resultsPromises);

    // 3. Use the synchronous .filter() on the original array
    const filteredLocations = locations.filter((_, index) => {
        // Use the pre-computed boolean from the resolved array
        return shouldKeepArray[index];
    });

    return filteredLocations;
}
    const newLocations = await filterLocations(locations)
    //l= await getLocation(locations[43])
    //locAreas = (await getLocationArea(l))
    //console.log(l.areas)
    //console.log(locAreas)
    //console.log(encounters.getEncounters(locAreas[1]))
    //console.log("test",walkFilter(locAreas))
    //console.log(locations,newLocations)
    // const filename = 'PokemonEncounterLocations.json'
    //const jsonString = JSON.stringify(newLocations,null,2)
    
    //console.log(jsonString)
    //console.log(encounters.getEncounters())
}())
