import setMessage from "../SetMessage.js";
export default function netGood(move,pokemon,target){
    let t;
    let e;
    move.stat_changes.forEach(stat_change => {
        let stat = stat_change.stat.name

        if (stat === 'defense')
            stat = 'defence'

        const change = stat_change.change
        switch(move.target){
            case 'all-opponents':
            case 'selected-pokemon':
                target.statStage[stat] += change;
                t = target.name                
                break;
            case 'user':
                pokemon.statStage[stat] += change;
                t = pokemon.name
                break;
            default:
                console.warn('new target type',move.target,'for',move)

        }
        setMessage(`${pokemon.name} used ${move.name}. ${t}'s ${stat} was ${change > 0 ? 'raised': 'decreased'}`)
    });
    
}