import handleMove from "./handleMove.js";
import listeners from "./eventListeners/EventListners.js";
import addEvent from "./eventListeners/AddEvent.js";
import setMessage from "./SetMessage.js";

let runAttempts = 1
const battleMenuButtons = ['Fight','Bag','Capture','Switch Pokemon']
const battleMenuListeners = [changeToFightMenu,changeToBagMenu,changeToCaptureMenu,switchLead]
const info = document.querySelectorAll('.info')
const MAX_ROLL = 65536
let palp;
const evolves = new CustomEvent('evolves')


export function setHealthText(){
    info[0].children[0].innerText = encOp.level
    info[0].children[1].innerText = `${encOp.hp}/${encOp.stats.health}`
    info[1].children[0].innerText = player.pokemon[0].level
    info[1].children[1].innerText = `${player.pokemon[0].hp}/${player.pokemon[0].stats.health}`
}
export default function changeToEncounterMenu(){
    
    opts.forEach(opt =>{
        opt.innerText = battleMenuButtons[opt.index]
        addEvent(opt,()=>{battleMenuListeners[opt.index]();controls[0].innerText = 'back'})
    })
    controls[0].innerText = 'run'
    addEvent(controls[0],run)
    
    palp = player.pokemon[0]
}

function changeToFightMenu(e){
    const keys = Object.keys(player.pokemon[0].currentMoves)
    opts.forEach(opt =>{
        opt.innerText = keys[opt.index] || ''
        addEvent(opt,attack)
    })
    addEvent(controls[0],changeToEncounterMenu)
}


function changeToBagMenu(){
    addEvent(controls[0],changeToEncounterMenu)
    opts.forEach(opt => {opt.innerText = player.bag?.name || ''})
}

function changeToCaptureMenu(){

    opts[0].innerText = "PokeBall"
    opts[1].innerText = "GreatBall"
    opts[2].innerText = "UltraBall"
    opts[3].innerText = ""
    
    addEvent(controls[0],changeToEncounterMenu)
    addEvent(opts[0],capture)
    addEvent(opts[1],capture)
    addEvent(opts[2],capture) 
}

function capture(e){
    let shakes = 0
    const B = calculateCaptureChance(e)
    blinkTwice()
    if (B >= MAX_ROLL){
        shakes = 4
    }
    else
        for (let i =0;i<4;i++){
            if(Math.floor(Math.random()*MAX_ROLL) <B)
                shakes++
            else
                break
        }
    if (shakes === 4){
        if(player.pokemon.length >= 6){
            player.box.push(encOp)
        }
        else{
            player.pokemon.push(encOp)
        }
        setMessage(`You captured a ${encOp.name}!`)
        clickBContinue(()=>{
            listeners.run();
            battleScreen.style.display = 'none';
            //setMessage
        }) 
    }
    else{
        setMessage(`the ball shook ${shakes} time${shakes===1?'':'s'} and then broke open`)
        clickBContinue(() =>{
            handleMove(opAttack(),encOp,palp);
            setHealthText()
            clickBContinue(changeToEncounterMenu)})
        
    }
}
function calculateCaptureChance(e){
    const maxHp = encOp.stats.health;
    const curHp = encOp.hp || 1;
    const captRate = encOp.species.capture_rate;
    const ballRate = player.bag.pokeballs[e.target.innerText].rate
    const statusRate = encOp.status.rate;
    const hpFactor = (3*maxHp - 2* curHp)/ (3*maxHp)
    const r = Math.min(255,(hpFactor * captRate * ballRate * statusRate))
    const b = r=== 255 ? MAX_ROLL : MAX_ROLL/Math.pow((255/r),.1875)
    return Math.floor(Math.min(MAX_ROLL,b))
}
function switchLead(){
    setMessage('Choose a pokemon to switch to')
    
    let i = 0
    function move(){
        i = i <0 ? player.pokemon.length - player.pokemon.length%4 : i
        i = i> player.pokemon.length ? 0 : i
        opts.forEach(opt => {
            opt.innerText = player.pokemon[opt.index + i]?.name || ''
            opt.innerText += opt.innerText === ''? '': ` lvl ${player.pokemon[opt.index + i].level}`
            opt.innerText += opt.innerText !== '' && !player.pokemon[opt.index +i].hp ? ' fainted' : ''
            addEvent(opt,()=>{
                if(!player.pokemon[opt.index +i].hp){
                    setMessage(`${player.pokemon[opt.index +i].name} is fainted`)
                    move()
                }
                else if(opt.index+i === 0){
                    changeToEncounterMenu()
                }
                else{
                    switchPokemon(opt.index+i)
                    setMessage(`I choose you! ${palp.name}`)
                    changeToEncounterMenu()
                }
                
            })
        })
        addEvent(controls[1],()=>{i+= 4;move()})
        addEvent(controls[2],()=>{i-= 4;move()})
        if(player.pokemon[0].hp)
            addEvent(controls[0],changeToEncounterMenu)
    }
    move()

    
}
function switchPokemon(index){
    [player.pokemon[0],player.pokemon[index]] = [player.pokemon[index],player.pokemon[0]]
    palp = player.pokemon[0]
    images[1].src = palp.sprites.back_default
    setHealthText()
}
function run() {
    if(attemptEscape()){
        runAttempts = 1
        setMessage('You ran away')
        blinkTwice()
        clickBContinue(() =>{
            setMessage("")
            listeners.run()
            battleScreen.style.display = 'none';
            controls[0].innerText = 'back'
        })
    }
    else{
        setMessage('failed to run away')
        blinkTwice()
        clickBContinue(() =>{handleMove(opAttack(),encOp,palp);setHealthText();changeToEncounterMenu()})
        
    }
    
    
}
function attemptEscape() {
    if (encOp.stats.speed + encOp.statStage.speed <= 0) return true;
    const sum = Math.floor(((palp.stats.speed + palp.statStage.speed) * 128) / (encOp.stats.speed + encOp.statStage.speed)) + (30 * runAttempts++);
    if (sum > 255) return true;
    const F = sum % 256;
    const R = Math.floor(Math.random() * 256);
    return R < F;
}

function attack(e){
    const palMove = palp.currentMoves[e.target.innerText]
    if(palMove.pp === 0){
        setMessage(` ${palMove.name} has zero pp and cannot be used`)
        changeToFightMenu()
        return
    }
    palMove.pp -= 1
    const opMove = opAttack()
    blinkTwice()
    if(opMove.priority > palMove.priority){
        moveOrder(opMove,encOp,palMove,palp,false)
    }
    else if(palMove.priority > opMove.priority || palp.stats.speed >= encOp.stats.speed ){
        moveOrder(palMove,palp,opMove,encOp,true)
    }
    else{
        moveOrder(opMove,encOp,palMove,palp,false)
    }
    
}
function opAttack(){

    const moves = Object.keys(encOp.currentMoves)
    let pp = 0

    moves.forEach(move => {if (encOp.currentMoves[move].pp > 0){pp++}})
    if(!pp){return}
    let move;

    do{
        move = moves[Math.floor(Math.random()*moves.length)] 
    }
    while(encOp.currentMoves[move].pp < 0)
    encOp.currentMoves[move].pp -= 1
    return encOp.currentMoves[move]
}

function moveOrder(move,pokemon,move2,pokemon2,first){
    handleMove(move,pokemon,pokemon2)
    setHealthText()
    if(pokemon2.hp <= 0 && first)
        opDefeated()
    else if(pokemon2.hp <= 0 && !first){
        palDefeated()
    }
    else
        clickBContinue(()=>secondMove(move2,pokemon2,pokemon,first))
    
}

function secondMove(move2,pokemon2,pokemon,first){
    handleMove(move2,pokemon2,pokemon)
    setHealthText()
    if(!first && pokemon.hp <=0){
        opDefeated()
    }
    else if(first && pokemon.hp <=0){
        palDefeated()
    }
    else
        changeToEncounterMenu()
}
function clickBContinue(func){
    controls[2].addEventListener("click",func,{once:true})
}
function palDefeated(){
    let anyAlive = 0
    player.pokemon.forEach(pal =>{anyAlive += pal.hp})
    if(!anyAlive){
        
        clickBContinue(()=>{
            setMessage('All of your pokemon have fainted and you black out')
            clickBContinue(()=>{
                setMessage('You wake up with all your pokemon healed and your money gone')
                listeners.heal()
                listeners.changeToPokeCenter()
                battleScreen.style.display = 'none'
            })
        })
    }
    else{
        clickBContinue(()=>{
            setMessage(`${palp.name} fainted`)
            clickBContinue(switchLead)
        })
    }
}
function opDefeated(){
    palp.exp += Math.ceil((1.5*encOp.level*encOp.data.base_experience)/7)
    
    clickBContinue(() => {
        setMessage(`${palp.name} gained ${palp.exp}/${palp.expNeeded} exp`)
        if(palp.exp >= palp.expNeeded){
            const newMove = leveledUp()
            clickBContinue(() =>{setHealthText();
                setMessage(`${palp.name} leveled up! ${palp.name} is now level ${palp.level}`);
                if(newMove){
                    learnNewMove(newMove.move)
                }
                else
                    clickBContinue(() => {
                        listeners.run();//setMessage
                        battleScreen.style.display = 'none'
                        if(palp.species.evolves_at === palp.level)
                            window.dispatchEvent(evolves);
                    });
            });          
        }
        else
            clickBContinue(() => {listeners.run();;battleScreen.style.display = 'none'})//setMessage
    })
}
function leveledUp(){
    
    let newMove = false
    palp.level+= 1
    palp.exp -= palp.expNeeded
    palp.setStats()
    palp.hp = palp.stats.health
    palp.growthRate()
    palp.movesToLearn.forEach(move =>{
        if (move.level_learned_at === palp.level){
            newMove = move
        }
    })
    return newMove
}
function learnNewMove(move){
    clickBContinue(()=>{
        
        if(Object.keys(palp.currentMoves).length <4){
            setMessage(`${palp.name} learned ${move.name}`)
            palp.setCurrentMoves()
            clickBContinue(() => {
                listeners.run();//setMessage
                battleScreen.style.display = 'none'
                if(palp.species.evolves_at === palp.level)
                    window.dispatchEvent(evolves);
            });
        }
        else{
            setMessage(`${palp.name} wants to learn ${move.name}. Pick a move to be replaced by ${move.name}`)
            opts.forEach(opt => addEvent(opt,async ()=>{
                let newMove = await P.getMoveByName(move.name);
                delete palp.currentMoves[opt.innerText]
                const {name,accuracy,meta,power,pp,type,target,priority,stat_changes} = newMove;
                palp.currentMoves[name] = {name,accuracy,meta,power,pp,type:type.name,target:target.name,priority,stat_changes};
                listeners.run();//setMessage
                battleScreen.style.display = 'none'
            }))
            addEvent(controls[0],()=>{
                listeners.run()
                battleScreen.style.display = 'none'
                setMessage('')
            })
        }

    })
}
