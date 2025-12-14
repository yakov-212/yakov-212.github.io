const con = document.querySelector('#console')

export default function addEvent(button,func){
    const event = e =>{
        if(e.target === button && button.innerText){
            removeEvents.forEach(remove => remove());
            removeEvents = [];
            func(e);
        }      
    }
    con.addEventListener('click',event);
    removeEvents.push(() => con.removeEventListener('click',event));
}
let removeEvents = [];