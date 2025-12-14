export default async function ailments(meta,target){
    if((meta.ailment.name === 'freeze' && target.types.include('ice')) || (meta.ailment.name === 'posion' && target.types.include('poison')))
        return
    if(Math.ceil(Math.random()*100) <= meta.ailment_chance){
        target.status.id = meta.ailment.name
    }
    
}