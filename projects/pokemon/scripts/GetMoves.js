const getMoves = (function (){
    function GetMoves(pokemon,method="all",version='red-blue'){
        if(!method === 'all' && !CheckMethod(method)){
            throw new Error("Unknow Learning Method")
        }
        const moves = pokemon.moves
        const versionMoves = {"moves": []};
        let a = 0
       moves.forEach(move => {
            let add = false
            move.version_group_details.forEach(versionGroupDetails => {
                if (versionGroupDetails.version_group.name === version)
                    add = true;
                    return
            })
            if (add){
                versionMoves["moves"][a++] = move
            }
        })
        if (method !== 'all' ){
            return GetMovesMethod(versionMoves,method,version) 
        }
        return versionMoves

    }
    function GetMovesMethod(pokeMoves,method,version){
        const methodMoves = {"moves":[]}
        let a = 0
        pokeMoves["moves"].forEach(moves => {
            let add = false
            moves.version_group_details.forEach(move => {
                if (move.move_learn_method.name === method && move.version_group.name == version){
                    add = true
                    return  
                }
            })
            if (add){
                methodMoves["moves"][a++] = moves
            }
        })
        return filterMoves(methodMoves)

    }

    async function CheckMethod(checkMe){
        let good = false
        ((await (await fetch("https://pokeapi.co/api/v2/move-learn-method")).json()).results).forEach(method => {
            if(method.name === checkMe){
                good = true
                return 
            }
        })
        return good
    }
    function filterMoves(moves){
        
        for (let index = 0; index < moves.moves.length; index++) {
            moves.moves[index].level_learned_at = moves.moves[index].version_group_details[0].level_learned_at
            delete moves.moves[index].version_group_details
        }
        moves.moves.sort((a,b) =>  b.level_learned_at - a.level_learned_at)
        return moves.moves
    }

    return GetMoves
}())
export default getMoves