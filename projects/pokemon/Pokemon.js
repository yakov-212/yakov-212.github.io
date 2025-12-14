import formulas from "./scripts/GrowthFormulas.js"
import getStats from "./scripts/GetStats.js"
import getMoves from "./scripts/GetMoves.js"
export default class Pokemon{
        currentMoves = {};
        exp = 130;
        expNeeded;
        statStage = {attack: 0,defence:0,speed:0,special_attack:0,special_defence:0,accuracy: 0};
        status = {id:null, duration: 0, isToxic: false,rate: 1}
        
        constructor(level, pokemon,species){
            this.name = pokemon.name
            const {cries,name,sprites,stats,types,base_experience} = pokemon;
            this.data = {cries,name,sprites,types,base_experience,base_stats:stats};
            this.species = species;
            this.level = level;
            this.setStats()
            this.hp = this.stats.health ;
            this.movesToLearn = getMoves(pokemon,'level-up');
            this.sprites = pokemon.sprites;
            this.growthRate();
            this.setCurrentMoves();
            this.#fixTypes(types);
        }
        damage(damage){
            this.hp = parseFloat((this.hp - damage).toFixed(2));
            if (this.hp <0)
                this.hp = 0;
        }
        async setCurrentMoves(){
            for (let i = 0;i< this.movesToLearn.length;i++){
                if(this.currentMoves.length === 4)
                    return;
                if (this.movesToLearn[i].level_learned_at <= this.level){
                    let move = await P.getMoveByName(this.movesToLearn[i].move.name);
                    const {name,accuracy,meta,power,pp,type,target,priority,stat_changes} = move;
                    this.currentMoves[name] = {name,accuracy,meta,power,pp,full_pp:pp,type:type.name,target:target.name,priority,stat_changes};
                }
                    
            }
        }
        setStats(){
            this.stats = getStats(this.data.base_stats,this.level);
        }
        growthRate(){
            let expN
            switch(this.species.growth_rate){
                case 'medium':
                    expN = formulas.mediumGrowthRate(this.level);
                case 'slow':
                    expN = formulas.slowGrowthRate(this.level);
                case 'fast':
                    expN = formulas.fastGrowthRate(this.level);
                default:
                    expN = formulas.mediumSlowGrowthRate(this.level);
            }
            this.expNeeded = expN
        }
        #fixTypes(types){for (let i = 0; i< types.length;i++){types[i] = types[i].type.name}};
    }