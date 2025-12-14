const palp = player.pokemon[0]
export default function leveledUp(e){
    palp.level+= 1
    palp.exp -= palp.expNeeded
    palp.growthRate()

}