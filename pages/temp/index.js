/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var clickcount = 0;
var card =      /* an array to hold the ids of the cards */
[
   "card1",
   "card2",
   "card3",
   "card4",
   "card5",
   "card6",
   "card7",
   "card8",
   "card9",
   "card10",
   "card11",
   "card12",
   "card13",
   "card14",
   "card15",
   "card16",
   "card17",
   "card18"
];

var levelOne = new Array();         /* level one cards*/

levelOne[0] = new Image();
levelOne[0].src = 'match_images/a01.bmp';

levelOne[1] = new Image();
levelOne[1].src = 'match_images/a03.bmp';

levelOne[2] = new Image();
levelOne[2].src = 'match_images/a03.bmp';

levelOne[3] = new Image();
levelOne[3].src = 'match_images/a01.bmp';

levelOne[4] = new Image();
levelOne[4].src = 'match_images/a05.bmp';

levelOne[5] = new Image();
levelOne[5].src = 'match_images/a07.bmp';

levelOne[6] = new Image();
levelOne[6].src = 'match_images/a07.bmp';

levelOne[7] = new Image();
levelOne[7].src = 'match_images/a05.bmp';

levelOne[8] = new Image();
levelOne[8].src = 'match_images/a09.bmp';

levelOne[9] = new Image();
levelOne[9].src = 'match_images/a11.bmp';

levelOne[10] = new Image();
levelOne[10].src = 'match_images/a11.bmp';

levelOne[11] = new Image();
levelOne[11].src = 'match_images/a09.bmp';

levelOne[12] = new Image();
levelOne[12].src = 'match_images/a13.bmp';

levelOne[13] = new Image();
levelOne[13].src = 'match_images/a15.bmp';

levelOne[14] = new Image();
levelOne[14].src = 'match_images/a15.bmp';

levelOne[15] = new Image();
levelOne[15].src = 'match_images/a13.bmp';

levelOne[16] = new Image();
levelOne[16].src = 'match_images/a17.bmp';

levelOne[17] = new Image();
levelOne[17].src = 'match_images/a17.bmp';


var levelTwo = new Array();         /* level two cards*/

levelTwo[0] = new Image();
levelTwo[0].src = 'match_images/b1.bmp';

levelTwo[1] = new Image();
levelTwo[1].src = 'match_images/b2.bmp';

levelTwo[2] = new Image();
levelTwo[2].src = 'match_images/b3.bmp';

levelTwo[3] = new Image();
levelTwo[3].src = 'match_images/b4.bmp';

levelTwo[4] = new Image();
levelTwo[4].src = 'match_images/b5.bmp';

levelTwo[5] = new Image();
levelTwo[5].src = 'match_images/b6.bmp';

levelTwo[6] = new Image();
levelTwo[6].src = 'match_images/b7.bmp';

levelTwo[7] = new Image();
levelTwo[7].src = 'match_images/b8.bmp';

levelTwo[8] = new Image();
levelTwo[8].src = 'match_images/b9.bmp';

levelTwo[9] = new Image();
levelTwo[9].src = 'match_images/b1.bmp';

levelTwo[10] = new Image();
levelTwo[10].src = 'match_images/b2.bmp';

levelTwo[11] = new Image();
levelTwo[11].src = 'match_images/b3.bmp';

levelTwo[12] = new Image();
levelTwo[12].src = 'match_images/b4.bmp';

levelTwo[13] = new Image();
levelTwo[13].src = 'match_images/b5.bmp';

levelTwo[14] = new Image();
levelTwo[14].src = 'match_images/b6.bmp';

levelTwo[15] = new Image();
levelTwo[15].src = 'match_images/b7.bmp';

levelTwo[16] = new Image();
levelTwo[16].src = 'match_images/b8.bmp';

levelTwo[17] = new Image();
levelTwo[17].src = 'match_images/b9.bmp';


var levelThree = new Array();         /* level three cards*/

levelThree[0] = new Image();
levelThree[0].src = 'match_images/c1.bmp';

levelThree[1] = new Image();
levelThree[1].src = 'match_images/c2.bmp';

levelThree[2] = new Image();
levelThree[2].src = 'match_images/c3.bmp';

levelThree[3] = new Image();
levelThree[3].src = 'match_images/c4.bmp';

levelThree[4] = new Image();
levelThree[4].src = 'match_images/c5.bmp';

levelThree[5] = new Image();
levelThree[5].src = 'match_images/c6.bmp';

levelThree[6] = new Image();
levelThree[6].src = 'match_images/c7.bmp';

levelThree[7] = new Image();
levelThree[7].src = 'match_images/c8.bmp';

levelThree[8] = new Image();
levelThree[8].src = 'match_images/c9.bmp';

levelThree[9] = new Image();
levelThree[9].src = 'match_images/c1.bmp';

levelThree[10] = new Image();
levelThree[10].src = 'match_images/c2.bmp';

levelThree[11] = new Image();
levelThree[11].src = 'match_images/c3.bmp';

levelThree[12] = new Image();
levelThree[12].src = 'match_images/c4.bmp';

levelThree[13] = new Image();
levelThree[13].src = 'match_images/c5.bmp';

levelThree[14] = new Image();
levelThree[14].src = 'match_images/c6.bmp';

levelThree[15] = new Image();
levelThree[15].src = 'match_images/c7.bmp';

levelThree[16] = new Image();
levelThree[16].src = 'match_images/c8.bmp';

levelThree[17] = new Image();
levelThree[17].src = 'match_images/c9.bmp';

/* a magic function that shuffles the cards written by someone smarter than I*/
function shuffleArray(array)
{
for (var i = array.length - 1; i > 0; i--)
   {
   var j = Math.floor(Math.random() * (i + 1));
   var temp = array[i];
   array[i] = array[j];
   array[j] = temp;
   }
return array;
}

function NewGame(level) /*shuffles the cards, flips all cards to backside*/
{
   clickcount = 0;

   shuffleArray(level);

   if (level === levelOne)
   {
        document.getElementById("demo").innerHTML = "Level One";
   }
   else if (level === levelTwo)
   {
       document.getElementById("demo").innerHTML = "Level Two";
   }
   else if (level === levelThree)
   {
       document.getElementById("demo").innerHTML = "Level Three";
   }

   for (i = 0; i<18; i++)
   {
   document.getElementById(card[i]).src = "match_images/backside.png";

   }
}


function twoFlippedChecker() /*checks if two cards are flipped over*/
{
    var card1 = 0;
    var card2 = 0;

    for (i = 0; i<18; i++)
   {
       var currentcard = document.getElementById(card[i]);

       if (!(currentcard.src.match ("match_images/backside.png")) &&
           !(currentcard.src.match ("match_images/blank.bmp")) )
       {
           if (card1 === 0)
            {
               card1 = currentcard;

            }
            else if (card2 === 0)
            {
                 card2 = currentcard;
            }
            else
            {
                card1 = 0;
                card2 = 0;
            }

       }
   }

   if (!(card1 === 0) && !(card2 === 0))
   {

       setTimeout(function(){
           matchChecker(card1, card2);
       }, 700);



   }
}

function isgameover() /* clecks if the board is all blank */
{
    for (i = 0; i<18; i++)
    {
        var currentcard = document.getElementById(card[i]);

       if (!(currentcard.src.match ("match_images/blank.bmp")))
       {
           return;
       }
    }
    alert("Congratuations! You Finished!\nYour click count was: "+clickcount);

}

function matchChecker (card1, card2)
/*flips the cards back if they are not a match, takes them away if they are */
{
    if (card1.src === card2.src)
    {

        card1.src = "match_images/blank.bmp";
        card2.src = "match_images/blank.bmp";
    }
    else
    {

        card1.src = "match_images/backside.png";
        card2.src = "match_images/backside.png";
    }
    setTimeout(function(){
            isgameover();
        }, 50);

}



function show(i)  /*main function run every time a card is clicked*/
{
    clickcount++;

    var currentcard = document.getElementById(card[i]);
    var level;

    var levelpicker = document.getElementById("demo").innerHTML ;

    if (levelpicker === "Level One")
    {
        level = levelOne;
    }
    else if (levelpicker === "Level Two")
    {
        level = levelTwo;
    }
    else if (levelpicker === "Level Three")
    {
        level = levelThree;
    }

    if (currentcard.src.match ("match_images/backside.png"))
    {

        currentcard.src = level[i].src;
        twoFlippedChecker();
    }

    else
        return;


}
