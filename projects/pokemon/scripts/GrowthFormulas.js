const formulas = (function(){
    function slowGrowthRate(level){
        // "\frac{5x^3}{4}"
       return Math.floor((5*Math.pow(level,4))/4)
    }
    function mediumGrowthRate(level){
        // "x^3"
        return Math.floor(Math.pow(level,3))
    }
    function fastGrowthRate(level){
        // "\frac{4x^3}{5}"
        return Math.floor((4*Math.pow(level,3))/5)
    }
    function mediumSlowGrowthRate(level){
        // "\frac{6x^3}{5} - 15x^2 + 100x - 140"
        return Math.floor((6*Math.pow(level,3))/5 - 15*Math.pow(level,2) + 100*level - 140)

    }
    return {
        slowGrowthRate,
        mediumGrowthRate,
        fastGrowthRate,
        mediumSlowGrowthRate
    }
}())
export default formulas