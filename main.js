var charData = [
    {
        id: "ipa-fr",
        name: "IPA French",
        chars: []
    },
    {
        id: "ipa-en",
        name: "IPA English",
        chars: []
    },
    {
        id: "ipa-ascii",
        name: "IPA ASCII",
        chars: [{char: "ʌ", value: "^"}, {char: "ɑ:", value: "a:"}, {char: "æ", value: "@"}, {char: "e", value: "e"}, {char: "ə", value: ".."}, {char: "ɜ:ʳ", value: "e:(r)"}, {char: "ɪ", value: "i"}, {char: "i:", value: "i:"}, {char: "ɒ", value: "o"}, {char: "ɔ:", value: "o:"}, {char: "ʊ", value: "u"}, {char: "u:", value: "u:"}, {char: "aɪ", value: "ai"}, {char: "aʊ", value: "au"}, {char: "eɪ", value: "ei"}, {char: "oʊ", value: "Ou"}, {char: "ɔɪ", value: "oi"}, {char: "eəʳ", value: "e..(r)"}, {char: "ɪəʳ", value: "i..(r)"}, {char: "ʊəʳ", value: "u..(r)"}, {char: "b", value: "b"}, {char: "d", value: "d"}, {char: "f", value: "f"}, {char: "g", value: "g"}, {char: "h", value: "h"}, {char: "j", value: "j"}, {char: "k", value: "k"}, {char: "l", value: "l"}, {char: "m", value: "m"}, {char: "n", value: "n"}, {char: "ŋ", value: "N"}, {char: "p", value: "p"}, {char: "r", value: "r"}, {char: "s", value: "s"}, {char: "ʃ", value: "S"}, {char: "t", value: "t"}, {char: "tʃ", value: "tS"}, {char: "θ", value: "th"}, {char: "ð", value: "TH"}, {char: "v", value: "v"}, {char: "w", value: "w"}, {char: "z", value: "z"}, {char: "ʒ", value: "Z"}, {char: "dʒ", value: "dZ"}]
    }
]

var activeChars = [];
var enabled = [];

function randomize(array){
    var index = array.length, tempVal, randomIndex;
    while (index !== 0){
        randomIndex = Math.floor(Math.random() * index);
        index -=1;
        tempVal = array[index];
        array[index] = array[randomIndex];
        array[randomIndex] = tempVal;
    }
    return array;
}

let correct = [];
let incorrect = [];
let helpCounter = 0;
let progressCount = 0;
let box = document.getElementById("box");
let buttonBox = document.getElementById("buttonbox");
let answer = document.getElementById("answer");
let progress = document.getElementById("progress");
let char = document.getElementById("kana");
let help = document.getElementById("help");
let options = document.getElementsByClassName("options");
let gameover = document.getElementsByClassName("gameover");

for(const ipaCat of charData) {
    var btnAdd = document.createElement("BUTTON");
    btnAdd.innerHTML = ipaCat.name;
    btnAdd.id = ipaCat.id;
    btnAdd.className = "options";

    btnAdd.addEventListener("click", ()=>{
        if(enabled.includes(ipaCat.id)){
            const index = enabled.indexOf(ipaCat.id);
            if (index > -1) {
                enabled.splice(index, 1)
            }
            btnAdd.style.setProperty('background-color', '#363636');
        } else {
            enabled.push(ipaCat.id);
            btnAdd.style.setProperty('background-color', '#6665d2');
        }
    });

    buttonBox.appendChild(btnAdd);
}

function helpClicked(char){
    answer.value = char;
    answer.focus();
    helpCounter++;
}

start = async(callback)=>{
    Array.from(options).forEach(option=>{option.style.setProperty("display", "none")});
    progress.style.setProperty("display", "block");
    help.style.setProperty("display", "block");
    char.style.setProperty("display", "block");
    answer.style.setProperty("display", "inline");
    for(const currentChar of activeChars){
        progressCount++;
        progress.innerText = `${progressCount}/${activeChars.length}`;
        setTimeout(()=>{
            box.style.setProperty('animation', 'none');
            answer.style.setProperty('border-bottom', '2px solid #6665d2')}, 300);
        await help.setAttribute("onclick", `helpClicked('${currentChar.value}')`);
        await new Promise(resolve=>{
            char.innerText = currentChar.char;
            answer.value = '';
            answer.focus();
            answer.addEventListener("keyup", (e)=>{
                if(e.keyCode === 13){
                    resolve();
                }
            });
        }).then(async()=>{
            if(answer.value == currentChar.value){
                correct.push(currentChar.char);
            } else {
                incorrect.push(currentChar.char);
                answer.value = currentChar.value;
                box.style.setProperty('animation', 'shake 0.7s cubic-bezier(.36,.07,.19,.97) both');
                answer.style.setProperty('border-bottom', '2px solid red');

                await new Promise(resolve=>{
                  answer.focus();
                  answer.addEventListener("keyup", (e)=>{
                      if(e.keyCode === 13){
                          resolve();
                      }
                  });
                });
            }
        });
    }
    callback();
};

document.getElementById("start").addEventListener("click", ()=>{
    for(const category of enabled){
        for (const section of charData) {
            if (section.id == category) {
                activeChars.push.apply(activeChars, section.chars);
            }
        }
    }
    if(activeChars.length > 0){
        randomize(activeChars);
        start(()=>{
            char.style.setProperty('display', 'none');
            answer.style.setProperty('display', 'none');
            help.style.setProperty('display', 'none');
            progress.style.setProperty('display', 'none');
            Array.from(gameover).forEach(stats => {
                stats.style.setProperty('display', 'inline');
            });
            document.getElementById("correct").innerText = `Correct: ${correct.length}`;
            document.getElementById("incorrect").innerText = `Incorrect: ${incorrect.length}`;
            document.getElementById("helpCount").innerText = `Times used help: ${helpCounter}`
            document.getElementById("refresh").addEventListener("click", ()=>{location.reload()});
        });
    }
});
