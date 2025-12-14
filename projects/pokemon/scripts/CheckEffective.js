const TYPE_CHART_GEN1 = {
    // Key: Attacking Type
    'Normal': { 'Rock': 0.5, 'Ghost': 0, 'Fighting': 1, 'Flying': 1, 'Poison': 1, 'Ground': 1, 'Bug': 1, 'Fire': 1, 'Water': 1, 'Grass': 1, 'Electric': 1, 'Psychic': 1, 'Ice': 1, 'Dragon': 1, 'Fairy': 1 },
    'Fighting': { 'Normal': 2, 'Rock': 2, 'Flying': 0.5, 'Poison': 0.5, 'Ground': 1, 'Bug': 0.5, 'Ghost': 0, 'Fire': 1, 'Water': 1, 'Grass': 1, 'Electric': 1, 'Psychic': 0.5, 'Ice': 2, 'Dragon': 1, 'Fairy': 0.5 },
    'Flying': { 'Fighting': 2, 'Bug': 2, 'Grass': 2, 'Rock': 0.5, 'Electric': 0.5, 'Ice': 1, 'Poison': 1, 'Ground': 0, 'Fire': 1, 'Water': 1, 'Psychic': 1, 'Dragon': 1, 'Ghost': 1, 'Normal': 1, 'Fairy': 1 },
    'Poison': { 'Grass': 2, 'Fighting': 1, 'Poison': 0.5, 'Ground': 0.5, 'Bug': 1, 'Rock': 0.5, 'Ghost': 0.5, 'Fire': 1, 'Water': 1, 'Electric': 1, 'Psychic': 0.5, 'Ice': 1, 'Dragon': 1, 'Normal': 1, 'Flying': 1, 'Fairy': 2 },
    'Ground': { 'Poison': 2, 'Rock': 2, 'Fire': 2, 'Electric': 2, 'Flying': 0, 'Bug': 0.5, 'Grass': 0.5, 'Water': 1, 'Ice': 1, 'Fighting': 1, 'Psychic': 1, 'Dragon': 1, 'Ghost': 1, 'Normal': 1, 'Fairy': 1 },
    'Rock': { 'Flying': 2, 'Bug': 2, 'Fire': 2, 'Ice': 2, 'Fighting': 0.5, 'Ground': 0.5, 'Electric': 1, 'Water': 1, 'Grass': 1, 'Poison': 1, 'Psychic': 1, 'Dragon': 1, 'Ghost': 1, 'Normal': 1, 'Fairy': 1 },
    'Bug': { 'Grass': 2, 'Psychic': 2, 'Poison': 0.5, 'Fighting': 0.5, 'Flying': 0.5, 'Fire': 0.5, 'Ghost': 0.5, 'Rock': 1, 'Ground': 1, 'Water': 1, 'Electric': 1, 'Ice': 1, 'Dragon': 1, 'Normal': 1, 'Fairy': 1 },
    'Ghost': { 'Ghost': 2, 'Normal': 0, 'Psychic': 2, 'Fighting': 1, 'Flying': 1, 'Poison': 1, 'Ground': 1, 'Bug': 1, 'Rock': 1, 'Fire': 1, 'Water': 1, 'Grass': 1, 'Electric': 1, 'Ice': 1, 'Dragon': 1, 'Fairy': 1 },
    'Fire': { 'Grass': 2, 'Ice': 2, 'Bug': 2, 'Rock': 0.5, 'Fire': 0.5, 'Water': 0.5, 'Dragon': 0.5, 'Normal': 1, 'Fighting': 1, 'Flying': 1, 'Poison': 1, 'Ground': 1, 'Electric': 1, 'Psychic': 1, 'Ghost': 1, 'Fairy': 1 },
    'Water': { 'Fire': 2, 'Ground': 2, 'Rock': 2, 'Water': 0.5, 'Grass': 0.5, 'Dragon': 0.5, 'Normal': 1, 'Fighting': 1, 'Flying': 1, 'Poison': 1, 'Bug': 1, 'Electric': 1, 'Psychic': 1, 'Ice': 1, 'Ghost': 1, 'Fairy': 1 },
    'Grass': { 'Ground': 2, 'Rock': 2, 'Water': 2, 'Flying': 0.5, 'Poison': 0.5, 'Bug': 0.5, 'Fire': 0.5, 'Grass': 0.5, 'Dragon': 0.5, 'Normal': 1, 'Fighting': 1, 'Electric': 1, 'Psychic': 1, 'Ice': 1, 'Ghost': 1, 'Fairy': 1 },
    'Electric': { 'Flying': 2, 'Water': 2, 'Ground': 0, 'Grass': 0.5, 'Electric': 0.5, 'Dragon': 0.5, 'Normal': 1, 'Fighting': 1, 'Poison': 1, 'Rock': 1, 'Bug': 1, 'Fire': 1, 'Psychic': 1, 'Ice': 1, 'Ghost': 1, 'Fairy': 1 },
    'Psychic': { 'Fighting': 2, 'Poison': 2, 'Psychic': 0.5, 'Rock': 1, 'Ground': 1, 'Bug': 1, 'Fire': 1, 'Water': 1, 'Grass': 1, 'Electric': 1, 'Ice': 1, 'Dragon': 1, 'Ghost': 0.5, 'Normal': 1, 'Flying': 1, 'Fairy': 1 }, // Gen 1 bug: Ghost is not immune
    'Ice': { 'Flying': 2, 'Ground': 2, 'Grass': 2, 'Dragon': 2, 'Water': 0.5, 'Ice': 0.5, 'Fire': 1, 'Fighting': 1, 'Poison': 1, 'Rock': 1, 'Bug': 1, 'Electric': 1, 'Psychic': 1, 'Ghost': 1, 'Normal': 1, 'Fairy': 1 },
    'Dragon': { 'Dragon': 2, 'Normal': 1, 'Fighting': 1, 'Flying': 1, 'Poison': 1, 'Ground': 1, 'Rock': 1, 'Bug': 1, 'Ghost': 1, 'Fire': 1, 'Water': 1, 'Grass': 1, 'Electric': 1, 'Psychic': 1, 'Ice': 1, 'Fairy': 1 },
    // **Note:** The Gen 1 chart is based on the original 15 types (Dark and Steel were added in Gen 2).
};

export default function getTypeEffectiveness(moveType, targetTypes) {
    let finalMultiplier = 1;

    // Convert moveType to title-case for case-insensitivity (e.g., 'fire' -> 'Fire')
    const formattedMoveType = moveType.charAt(0).toUpperCase() + moveType.slice(1).toLowerCase();

    // Check if the move type is even recognized in the chart
    if (!TYPE_CHART_GEN1[formattedMoveType]) {
        console.warn(`Unknown move type: ${formattedMoveType}. Assuming 1x effectiveness.`);
        return 1;
    }

    // Loop through each of the target's types (usually 1 or 2)
    for (const targetType of targetTypes) {
        // Convert targetType to title-case
        const formattedTargetType = targetType.charAt(0).toUpperCase() + targetType.slice(1).toLowerCase();
        
        const moveEffectiveness = TYPE_CHART_GEN1[formattedMoveType][formattedTargetType];

        // If the effectiveness is not defined (e.g., no entry for Dragon vs. Water in Dragon's list), 
        // it means the multiplier is 1. We use a default of 1 if not found.
        const multiplier = moveEffectiveness !== undefined ? moveEffectiveness : 1;

        // Multiply the current final multiplier by the effectiveness against this specific type
        finalMultiplier *= multiplier;
    }
    // console.log(moveType,targetTypes)
    // if(finalMultiplier>2){
    //     console.log('double super effective',finalMultiplier)
    // }
    // else if (finalMultiplier > 1){
    //     console.log('super effective',finalMultiplier)
    // }
    // else if (finalMultiplier <1)
    //     console.log('not very effective',finalMultiplier)
    // else{
    //     console.log('effective or zero',finalMultiplier)
    // }
    return finalMultiplier;
}

