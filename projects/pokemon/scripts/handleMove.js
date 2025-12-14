import netGood from "./damageCategoryScripts/netGood.js";
import damage,{multDamage} from "./damageCategoryScripts/damage.js";
import ailments from './damageCategoryScripts/ailment.js';
const categories = ["damage","ailment","net-good-status","damage+lower","damage+raise","damage+ailment","damage+heal","heal","ohko","unique","force-switch"];


export default function handleMove(move,pokemon,target) {

    const category = move.meta.category.name

    if(!checkStatus(pokemon)){
        console.log('pokeomon cant move because of',pokemon.status.id)
        return
    }

    switch (category) {
        case 'damage':
            if(move.meta.min_hits)
                multDamage(move,pokemon,target)
            else
                damage(move,pokemon,target)
            break;

        case 'ailment':
            ailments(move,pokemon,target)
            break;

        case 'net-good-stats':
            netGood(move,pokemon,target)
            break;

        case 'damage+lower':
            damage(move,pokemon,target)
            break;

        case 'damage+raise':
            damage(move,pokemon,target)
            break;

        case 'damage+ailment':
            damage(move,pokemon,target)
            ailments(move.meta,pokemon,target)
            
            break;

        case 'damage+heal':
            damage(move,pokemon,target)
            break;

        case 'heal':
            break;

        case 'ohko':
            break;

        case 'unique':
            break;

        case 'force-switch':
            break;

        default:
            console.warn(`Unknown category: ${category}`);
            break;
    }

    
}

function checkStatus(pokemon){
    switch(pokemon.status.id){
        case 'paralysis':
            return Math.floor(Math.random()*4)
        case 'sleep':
        case 'freeze':
            return 0
        default:
            return 1
    }
}
