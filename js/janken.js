//Hands Definition
const hands = ['グー','チョキ','パー']

//Get info what hand button I selected.
function myHandChoise(buttonID){
    var myHandIs;
    switch(buttonID){
        case 'gu_btn':
            myHandIs = 0;
            break;
        case 'cho_btn':
            myHandIs = 1;
            break;
        case 'par_btn':
            myHandIs = 2;
            break;
    }
    console.log('My hand is :' + hands[myHandIs]);
    return myHandIs;
}

//Get info what hand CPU Selected
function cpuHandChoise(){
    return Math.floor(Math.random()*3);
}

//Janken Rule Definition
// https://staku.designbits.jp/check-janken/ おもろそう
function battle(myHand, cpuHand){
    console.log('いざ尋常に勝負！');
    console.log(myHand);
    console.log(cpuHand);
    var result;
    switch((myHand - cpuHand+3)%3){
        case 0:
            result = "aiko";
            break;
        case 1:
            result = "負け";
            break;
        case 2:
            result = '勝ち';
            break;
    }
    return result;
}

//Recognize Which button be chosen.
$('#my_hand > li').on('click', function(){
    //Get ButtonID
    let buttonID = $(this).attr('id');
    console.log(buttonID);
    //Choose CPU selection
    //let cpu = cpuHandChoise();
    $('#pc_hands').html(hands[cpu]);
    let result = battle(myHandChoise(buttonID),cpu);
    $('#judgment').html(result);
});