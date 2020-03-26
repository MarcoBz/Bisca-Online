function shuffle(array) {
    let counter = array.length;

    // While there are elements in the array
    while (counter > 0) {
        // Pick a random index
        let index = Math.floor(Math.random() * counter);

        // Decrease counter by 1
        counter--;

        // And swap the last element with it
        let temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }
    return array;
}

function nextDealerIndex(currentPlayerIndex, nPlayers, players){

    let nextPlayerIndex = null
    let tempIndex = currentPlayerIndex

    while (nextPlayerIndex === null){
        
        tempIndex = tempIndex + 1 == nPlayers ? 0 : tempIndex + 1
        if (!players.find(c => c[0] === `player_${tempIndex}`)[1].is_dead){
            nextPlayerIndex = tempIndex
        }
    }
    return nextPlayerIndex
}

module.exports.shuffle = shuffle
module.exports.nextDealerIndex = nextDealerIndex