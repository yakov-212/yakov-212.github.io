const P = new Pokedex.Pokedex({ cacheImages: true });
const opts = document.querySelectorAll('.button-option');
const controls = document.querySelectorAll('.button-controls');
const messageBox = document.querySelector('#messages');
const battleScreen = document.querySelector('#battle');
const images = document.querySelectorAll("img")
const pokeballs = {
    PokeBall:{amount:0,rate:1},
    GreatBall:{amount:0,rate:1.5},
    UltraBall:{amount:0,rate:2},
}
const player = JSON.parse(localStorage.getItem('player')) || {pokemon:[],bag:{pokeballs:pokeballs},money:0,box:[]};
let encOp;
function turnRed(){
    controls[2].style.backgroundColor = '#ff1493'
}
function turnWhite(){
    controls[2].style.backgroundColor = ''
}
function blinkTwice(){
    turnRed();
    setTimeout(turnWhite,100)
    setTimeout(turnRed,200)
    setTimeout(turnWhite,350)
}
function save(){
    localStorage.setItem('player',JSON.stringify(player))
}