import setMessage from '../SetMessage.js';
import getTypeEffectiveness from '../CheckEffective.js'
export default function damage(move,pokemon,target){
    const levelFactor = Math.floor(2*pokemon.level/5)+2;
    let ratio = (pokemon.stats.attack*convertStatStage(pokemon.statStage.attack))/(target.stats.defence*convertStatStage(target.statStage.defence))
    ratio = parseFloat(ratio.toFixed(2))
    const basedamage = Math.floor((levelFactor * move.power * ratio)/50)+2
    const mod = modifier(move,pokemon,target)
    const d = parseFloat((basedamage*mod).toFixed(2))
    target.damage(d)
    setMessage(`${pokemon.name} used ${move.name} inflicting ${d} damage on ${target.name} `)
    
}
function modifier(move,pokemon,target){
    let stab = 1;
    const typeEffect = getTypeEffectiveness(move.type,target.data.types);
    let rand = Math.random() * (1-.85) +.85
    rand = parseFloat(rand.toFixed(2))
    for (const type of pokemon.data.types ){
        if (type === move.type)
            stab = 1.5
    }
    return stab*typeEffect*rand

}
function convertStatStage(statStage){
    if(statStage >= 0)
        return parseFloat(((2+statStage)/2).toFixed(2))
    else
        return parseFloat((2/(2-statStage)).toFixed(2))
}
export function multDamage(move,pokemon,target){
    damage(move,pokemon,target)
    damage(move,pokemon,target)
    const rand = Math.ceil(Math.random()*100)
    let chance = 37.5
    for(let i = 0; i < move.meta.max_hits-2;i++){
        if(chance > rand)
            return
        damage(move,pokemon,target)
        chance += chance === 37.5 ? chance : 12.5
    }
}