document.addEventListener('DOMContentLoaded', () => {
    const allLeaves = document.querySelectorAll('.leaf');
    const gameLeaves = document.querySelectorAll('.gameLeaf');
    const presentLeaves = document.querySelectorAll('div.leaf.gameLeaf.presentLeaf');
    
    const containers = document.querySelectorAll('.container');
    const startBtn = document.querySelector('#button')
    const frog = document.querySelector('.frog')

    let frogIndex = 0;
    let winScore = 0;
    let loseScore = 0;

    let gameLeavesArray = Array.from(gameLeaves)
    let gameLeavesArrayFiltered;
    let filteredArrCopy;
    let arrayFin = [];

    let gameIsOn = null;
    let maxNumOfLeaves = 5;

    const noLeftTurn = [0, 5, 10, 15, 20];
    const noRightTurn = [4, 9, 14, 19, 24];
    const rowLength = 5

    //generate random leaf shape
    gameLeaves.forEach(el => randomLeafShape(el));

    function randomLeafShape(el){
        let num1 = Math.floor(Math.random() * 20) + 40;
        let num2 = Math.floor(Math.random() * 20) + 40;
        let num3 = Math.floor(Math.random() * 20) + 40;
        let num4 = Math.floor(Math.random() * 20) + 40;
        el.style.borderRadius = `${num1}% ${num2}% ${num3}% ${num4}%`
      };

    
    //LEAVES POP UP 
    startBtn.addEventListener('click', gameStart)
    function gameStart() {
        frog.classList.remove('jump');
        if (document.querySelector('.splash')){document.querySelector('.splash').remove()};
        if(frogIndex != 0){
            frogIndex = 0;
            document.querySelector('#start').appendChild(frog);
        }
        document.addEventListener('keyup', moveFrog);
        gameIsOn = setInterval(pickrandomLeaves, 900);
    }

    function pickrandomLeaves(){
        //we don't want leaves that already popped up and shrinking
        gameLeavesArray.filter(el => !el.classList.contains('presentLeaf'));
        filteredArrCopy = gameLeavesArray.slice(0);
        for (let i=0; i<maxNumOfLeaves; i++){
                if (filteredArrCopy.length < 1) { filteredArrCopy = myArray2.slice(0); }
                let index = Math.floor(Math.random() * filteredArrCopy.length);
                let item = filteredArrCopy[index];
                filteredArrCopy.splice(index, 1);
                item.classList.add("presentLeaf"); 
                arrayFin.push(item)
        }
        console.log('presentLeaves / presentLeaves  '+ presentLeaves.length)
        
        //find the shrunk leaves(0px width), remove PresetnLeaves class, remove them from the array
        // where new leaves are added(added PresentLeaves class(100px)) 
        //5001 cause css animation is set on 5s
        setTimeout(() => {
            const removeZeroSized = arrayFin.filter(leaf => leaf.offsetWidth == 0 && leaf.offsetHeight == 0);
            removeZeroSized.forEach(leaf => leaf.classList.remove('presentLeaf'));
            arrayFin = arrayFin.filter(el => !removeZeroSized.includes(el));

            console.log('filteredArrCopy '+ filteredArrCopy.length)
            console.log('arrayFin / removeZeroSized  '+ arrayFin.length)
           
        }, 5001);

        allLeaves[frogIndex].offsetWidth == 0 && allLeaves[frogIndex].offsetHeight == 0 ? 
        splash(frogIndex) : null;
    }
    
    function moveFrog(e) {
        containers[frogIndex].removeChild(frog);
        switch(e.keyCode) {
            //left
            case 37:
                if(noLeftTurn.includes(frogIndex) ){
                    frogIndex
                } else {
                    frogIndex -=1;
                }
                break;
            //up
            case 38:
                if(frogIndex >=5)
                frogIndex -=rowLength;
                break;
            //down
            case 40:
                if(frogIndex < 20)
                frogIndex +=rowLength;
                break;
            //right
            case 39:
                if(noRightTurn.includes(frogIndex)){
                    frogIndex
                } else {
                    frogIndex +=1;
                }
                break;
        }
        allLeaves[frogIndex].classList.contains('presentLeaf') ||
        allLeaves[frogIndex].classList.contains('start') ||
        allLeaves[frogIndex].classList.contains('finish')  ?
        containers[frogIndex].appendChild(frog) : splash(frogIndex);

        if(frogIndex == 24){
            winScore+=1;
            document.getElementById('win').innerHTML = `Won: ${winScore}`;
            frogCelebrates();
            endGame(); 
        } 
    }
    function frogCelebrates(){
        document.removeEventListener('keyup', moveFrog);
        frog.classList.add('jump')
    }
    function splash(ind){
        endGame();
        if (containers[frogIndex].contains(frog)){
            containers[frogIndex].removeChild(frog);
        }
        const splashImg = document.createElement("img");
        splashImg.classList.add("splash");
        splashImg.src = "images/splash-128.png";
        containers[ind].appendChild(splashImg);
        loseScore+=1;
        document.getElementById('lost').innerHTML = `Lost: ${loseScore}`
    }

    function endGame() {
        clearInterval(gameIsOn);
    }
})
