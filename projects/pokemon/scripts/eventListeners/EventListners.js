import routes from '../../data/Routes.json' with {type: 'json'};
import areaLocations from '../../data/AreaLocations.json' with {type: 'json'};
import addEvent from './AddEvent.js';
import setMessage from '../SetMessage.js';

const buttonNames = ['Routes',"Gyms","Poke Center",'Poke Store']
const pokemonEncounterEvent = new CustomEvent('pokemonEncounterEvent',{detail:{loc: " "},bubbles:true})

for(let i =0;i<opts.length;i++){
    opts[i].index = i
}
for(let i =0;i<controls.length;i++){
    controls[i].index = i
}

function pretty(route){
    try{route = route.replace('kanto-','').replace('sea-','').replace(/-/g,' ')}catch{console.log('pretty',route)}
    
    return route
};
const listeners = (function() {

    const areaListener = (function (){
        
        function listener(e){
            const button = e.target
            const abListener = areaBuilder(areaLocations[button.uglyText].areas);
            if(areaLocations[button.uglyText].areas.length > 4){
                blinkTwice()}
            
            
            for (let i =0;i<4;i++){

                try{ 
                    opts[i].innerText = pretty(areaLocations[button.uglyText].areas[i].name)
                }
                catch{
                    opts[i].innerText = ''
                }
                addEvent(opts[i],e =>{removeAB(abListener.areaAB),areaEvent(e,button.uglyText)})
            }

            addEvent(controls[0],() => {removeAB(abListener.areaAB);routesListener.areaBack()})
            controls[1].addEventListener('click',abListener.areaAB)
            controls[2].addEventListener('click',abListener.areaAB)
        }

        function removeAB(func){
                controls[1].removeEventListener("click",func)
                controls[2].removeEventListener("click",func)
            }
        

        function areaEvent(e,loc){
            if(!e.target.innerText){return};
            pokemonEncounterEvent.detail.loc = loc;
            pokemonEncounterEvent.detail.index = e.target.index;
            e.target.index = e.target.index < 4? e.target.index : e.target.index - 4
            window.dispatchEvent(pokemonEncounterEvent)
            removeAB()
        }

        function areaBuilder(areas){
            let j=4;
            function areaAB(){
                if (areas.length <5)
                    return
                
                
                if(j>4){j=0}
                for (let i = 0;i<4;i++){
                    try{ 
                        opts[i].innerText = pretty(areas[j++].name);opts[i].index = j-1}
                    catch{opts[i].innerText = ''}
                    
                }
            }
            return{areaAB}
        }
        
        return{listener}
    }())

    const routesListener =(function (){
        let i = 0;
        function toMainMenu(){
            opts.forEach(opt => {opt.innerText = buttonNames[opt.index]});
            removeControlListners();
            i-=4
            start()
        }
        function areaBack(e){
            i-=4
            routeEvent()
        }
        function routeEvent(){
            opts.forEach(opt=>{
                opt.uglyText = routes[i];
                opt.innerText=pretty(routes[i++]);
                addEvent(opt,e => {areaListener.listener(e);removeControlListners()})
            })  
            addControlListeners()
        }

        

        function removeControlListners(){
            controls[1].removeEventListener("click",routeA)
            controls[2].removeEventListener("click",routeB)
        }

        function addControlListeners(){
            addEvent(controls[0],toMainMenu);
            controls[1].addEventListener("click",routeA);
            controls[2].addEventListener("click",routeB);      
        }

        function routeB(){
            opts.forEach(opt=>{
                if (i >= routes.length){i = 0}
                opt.uglyText = routes[i]; 
                opt.innerText=pretty(routes[i++]);
                
            })
        }
        function routeA(){
            i-=8
            opts.forEach(opt=>{
                if (i < 0 ){i = (routes.length +i)}
                if(i === 32){i = 0}
                opt.uglyText = routes[i];
                opt.innerText=pretty(routes[i++]);
            })
        }

        return {routeEvent,areaBack,toMainMenu}
    }())
    function start(){
            
            addEvent(opts[0],() =>{routesListener.routeEvent();blinkTwice()})
            addEvent(opts[2],pokeCenterListener.centerEvent)
        }
    const pokeCenterListener =(function(){
        function centerEvent(){
            opts[0].innerText = 'Heal'
            opts[1].innerText = 'Box'
            opts[2].innerText = 'Change Leader'
            opts[3].innerText = ''
            addEvent(controls[0], ()=>{opts.forEach(opt => {opt.innerText = buttonNames[opt.index]});start()})
            addEvent(opts[0],()=>{heal();setMessage('Your Pokemon have been fully healed')})
            addEvent(opts[1],box)
            addEvent(opts[2],changeLeader)
        }
        function heal(){
            player.pokemon.forEach(pokemon =>{
                pokemon.hp = pokemon.stats.health
                const keys = Object.keys(pokemon.currentMoves)
                keys.forEach(move =>{
                    pokemon.currentMoves[move].pp = pokemon.currentMoves[move].full_pp
                })
                pokemon.status = {id:null, duration: 0, isToxic: false,rate: 1}
            })

            
            addEvent(controls[0],()=>{opts.forEach(opt => {opt.innerText = buttonNames[opt.index]});start();setMessage('')})
            addEvent(opts[1],box)
            
        }
        function changeLeader(){
            let i = 0
            setMessage("Choose a pokemon to go into battle first")
            
            function move(){
                i = i>=0? i: player.pokemon.length - player.pokemon.length%4
                i = i>player.pokemon.length? 0: i
                opts.forEach(opt =>{
                    opt.innerText = player.pokemon[opt.index+i]?.name ? `${player.pokemon[opt.index+i].name} lvl ${player.pokemon[opt.index+i].level}` : '';
                    addEvent(opt,() => switchLeader(opt.index+i))
                })
                addEvent(controls[2],() =>{i+=4;move()})
                addEvent(controls[1],() =>{i-=4;move()})
                addEvent(controls[0],()=>{centerEvent();setMessage('')})
            }
            move()
            
        }
        function switchLeader(pokeI){
            const temp = player.pokemon[0]
            player.pokemon[0] = player.pokemon[pokeI]
            player.pokemon[pokeI] = temp
            centerEvent()
            setMessage('')
        }
        function box(){
            let i = 0
            let boxI = 0
            setMessage('Choose a pokemon to add to your team')

            function move(party){

                i = i>=0? i: party.length - party.length%4
                i = i>party.length? 0: i

                opts.forEach(opt =>{
                    opt.innerText = party[opt.index+i]?.name ? `${party[opt.index+i].name} lvl ${party[opt.index+i].level}` : '';
                    if(party === player.pokemon){
                        addEvent(opt,() =>switchPokemon(opt.index+i))
                    }
                    else
                        addEvent(opt,() =>{addToPokemon();boxI = opt.index +i})
                        
                })
                addEvent(controls[2],() =>{i+=4;move(party)})
                addEvent(controls[1],() =>{i-=4;move(party)})
                addEvent(controls[0],()=>{centerEvent();setMessage('')})
            }
            function addToPokemon(e){
                i = 0
                setMessage(`Choose a pokemon to replace with ${player.box[boxI].name}`)
                move(player.pokemon)
            }
            function switchPokemon(pokeI){
                const temp = player.box[boxI]
                player.box[boxI] = player.pokemon[pokeI]
                player.pokemon[pokeI] = temp
                centerEvent()
                setMessage('')

            }
            move(player.box)
        }
        

        return{centerEvent,heal}
    }())
    return{
        start, 
        run: routesListener.areaBack, 
        back: routesListener.toMainMenu, 
        heal: pokeCenterListener.heal,
        changeToPokeCenter: pokeCenterListener.centerEvent
    }

}())
export default listeners
