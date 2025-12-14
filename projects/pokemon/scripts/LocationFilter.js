 function LocationFilter(kantoRegion){
    const gen1Exclusions = [
        '-island',       // Excludes 'one-island', 'two-island', 'four-island', etc.
        'ember',         // 'mt-ember'
        'berry-forest',
        'icefall-cave',
        'pattern-bush',
        'lost-cave',
        'kindle-road',
        'treasure-beach',
        'cape-brink',
        'bond-bridge',
        'three-isle-port',
        'resort-gorgeous',
        'water-labyrinth',
        'five-isle-meadow',
        'memorial-pillar',
        'outcast-island',
        'green-path',
        'water-path',
        'ruin-valley',
        'trainer-tower',
        'canyon-entrance',
        'sevault-canyon',
        'tanoby-ruins',
        'birth-island',
        'navel-rock',
        'three-isle-path',
        
        // ❌ Roaming/Special Locations (Gen 3/4 content)
        'roaming-kanto',     // FireRed/LeafGreen Legendary catch placeholder (Lati@s)
        'kanto-altering-cave', // FireRed/LeafGreen changing encounter location
        
        // ❌ Johto Locations that are tied to the Kanto API list for Gen 2/4
        'kanto-route-26',  // Johto routes accessible after Gen 1
        'kanto-route-27',
        'kanto-route-28',
        'chamber',
    ];
    const gen1Locations = kantoRegion.locations.filter(location => {
        const name = location.name;

        // Keep these specific locations, even if they match an exclusion
        if (name === 'viridian-forest' || 
            name === 'digletts-cave' || 
            name === 'mt-moon' ||
            name === 'rock-tunnel' ||
            name === 'seafoam-islands' ||
            name === 'cerulean-cave' ||
            name === 'pokemon-mansion' ||
            name === 'kanto-safari-zone' ||
            name === 'pokemon-tower') {
            return true;
        }

        // Check if the name contains any of our exclusion keywords
        const isExcluded = gen1Exclusions.some(exclusion => name.includes(exclusion));

        // If it's NOT excluded, keep it
        return !isExcluded;
    });
    
    return gen1Locations
}
