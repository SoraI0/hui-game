// const hui = document.querySelector('.hui')
const door = document.querySelector('.door')
const body = document.querySelector('body')
const gameField = document.querySelector('.game-field')
const buttonStart = document.querySelector('.button-start')
const buttonRestart = document.querySelector('.button-restart')
const huisCountOnScreen = document.querySelector('.huis-counter > span')
const scoreCountOnScreen = document.querySelector('.score > span')
const scoreBoard = document.querySelector('.score-board')

const endScreen = document.createElement('div')
    gameField.appendChild(endScreen)
    endScreen.style.position = 'absolute'
    endScreen.style.width = '100%'
    endScreen.style.height = '100%'
    endScreen.style.display = 'none'
    endScreen.style.justifyContent = 'center'
    endScreen.style.alignItems = 'center'
    endScreen.style.textAlign = 'center'
    endScreen.style.color = 'white'
    endScreen.style.fontSize = '35px'
    endScreen.style.backgroundColor = 'rgb(252, 90, 90)'
    endScreen.style.transition = '0.5s'
    endScreen.style.zIndex = '5'

huisCountOnScreen.style.transition = '0.2s'
scoreCountOnScreen.style.transition = '0.2s'


door.style.left = '0px'
door.style.bottom = '0px'
let isGame
let huiSpawn
let isJump = true
let huiSpeed = 1

let huisCount = 0
let score = 0
let scoreCounter

let huis = []
let convs = []

let gameLoop
convCreate(0)
convCreate(600)


function gameStart() {

    reset()
    isGame = true

    gameLoop = setInterval(gameTick, 5)

    huiSpawn = setInterval(()=>{
        setTimeout(()=>{
            huiCreate()
        },getRndInteger(1000, 3000))      
    }, 3000)

    scoreCounter = setInterval(()=>{
        score = score + 1 * huisCount
        scoreCountOnScreen.textContent = score
    },100)
    
    doorControl()
}

function gameTick() {
    moveHuis()
    moveConvs()
}


function getPosition(element) {
    return Number(element.style.left.slice(0, -2))
}

function convCreate(startPos) {
    const conv = document.createElement('img')
    conv.setAttribute('src', './images/conv.png')
    conv.classList.add('conv')
    conv.style.left = startPos + 'px'
    gameField.appendChild(conv)
    convs.push(conv)
}



function moveConvs() {
    convs.forEach(conv => {
        conv.style.left = getPosition(conv) - huiSpeed + 'px'
        if (getPosition(conv) <= -conv.width ) {
            conv.style.left = conv.width + 'px'
        }
    })
   
}


function huiCreate() {
    const hui = document.createElement('div')
    hui.classList.add('hui')
    hui.innerHTML = `<img src="./images/${getRndInteger(1, 6)}.png" alt="DICK :)">`

    
    hui.style.width = '90px'
    hui.style.height = '90px'
    let huiPosition = 600
    hui.style.left = huiPosition + 'px'


    gameField.insertAdjacentElement('afterbegin', hui)
    
    huis.push(hui)
}

function moveHuis () {
    let huisToRemove = []
    huis.forEach(hui => {
        hui.style.left = getPosition(hui) - huiSpeed + 'px'

        if (getPosition(hui) <= -100) {
            hui.remove()
            huisToRemove.push(hui)
            huisCount = huisCount + 1
            huisCountOnScreen.textContent = huisCount
            if (huisCount % 10 === 0 && huisCount >= -1) {
                huiSpeed += 0.5
                // console.log(true, huisCount, huiSpeed, getPosition(hui))
            }
        }
        if (collision(door, hui)) {
            gameEnd()
        }
    })
    huisToRemove.forEach(hui => {
        // console.log(true, huisCount, huiSpeed, getPosition(hui))
        console.log(huis);
        hui.remove()
        huis = huis.filter(a => a != hui)
    })
}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min
}

function reset() {
    huis = []
    score = 0
    huisCount = 0
    huiSpeed = 1
    scoreCountOnScreen.textContent = 0
    huisCountOnScreen.textContent = 0
    document.querySelectorAll('.hui').forEach(e => e.remove())
    buttonStart.style.display = 'none'
    buttonRestart.style.display = 'none'
    scoreBoard.style.display =  'flex'
    gameField.style.marginTop = '0px'
    door.style.display = 'block'

    endScreen.style.display = 'none'
    
}

buttonStart.addEventListener('click', ()=> {
    gameStart()
})

buttonRestart.addEventListener('click', ()=> {
    gameStart()
})



function collision (door, hui) {
    let doorPosition = getPosition(door)
    let huiPosition = getPosition(hui)

    return doorPosition + 30 >= huiPosition 
        && doorPosition + 10 <= huiPosition 
        && Number(door.style.bottom.slice(0, -2)) <= Number(hui.style.height.slice(0, -2))   
}


function doorControl () {
        body.addEventListener('click', ()=>{
            if (Number(door.style.bottom.slice(0, -2)) === 0 && isGame) {
                door.style.transition = '0.5s'

                door.style.bottom = '120px'
                setTimeout(() => {
                    door.style.bottom = '1px'
                    setTimeout(() => {
                        door.style.bottom = '0px'
                    }, 500);
                }, 600);  
            }      
        })
}

    
function gameEnd() {
    clearInterval(gameLoop)
    endScreen.style.display = 'flex'
    scoreBoard.style.display =  'none'
    gameField.style.marginTop = '33.33px'
    
    
    buttonRestart.style.display = 'block'
    isGame = false
    endScreen.innerHTML = `Отакої,<br>ви зачепилися за пеніс<br>Ваш рахуок: ${score}<br>Зібрано пенісів: ${huisCount}`
    clearInterval(huiSpawn)
    clearInterval(scoreCounter)
    document.querySelectorAll('.hui').forEach(e => e.remove())
    door.style.display = 'none'
}
    









 