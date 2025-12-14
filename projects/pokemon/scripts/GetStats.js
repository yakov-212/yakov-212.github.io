export default function getStats(stats,level){
    const newStats = {'health':0,'attack':0,'defence':0,'special-attack':0,'special-defence':0,'speed':0,}
    let a = 0
    Object.keys(newStats).forEach(stat =>{
        switch(stat){
            case 'health':
                newStats[stat] = getHealth(stats[a++])
                break
            default:
                newStats[stat] = getStat(stats[a++])
        }
    })
    function getHealth(base){
        return Math.floor((2*base.base_stat*level)/100)+level+10
    }
    function getStat(base){
        return Math.floor((2*base.base_stat*level)/100)+5
    }
    return newStats
}