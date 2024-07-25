// const hui = document.querySelector('.hui')
const door = document.querySelector('.door')
const body = document.querySelector('body')
const gameField = document.querySelector('.game-field')
const buttonStart = document.querySelector('.button-start')
const buttonRestart = document.querySelector('.button-restart')
const huisCountOnScreen = document.querySelector('.huis-counter > span')
const scoreCountOnScreen = document.querySelector('.score > span')
const scoreBoard = document.querySelector('.score-board')

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
    endScreen.style.backgroundColor = 'red'
    endScreen.style.transition = '0.5s'

    const conv = document.createElement('img')
    conv.setAttribute('src', './images/conv.PNG')
    conv.classList.add('conv')
    gameField.appendChild(conv)
function gameStart() {

    reset()
    isGame = true
    
    // convMove = setInterval(()=>{
    //     gameField.appendChild(conv)
    //     conv.style.marginLeft = Number(conv.style.marginLeft.slice(0, -2)) - 1 + 'px'
    // },5)


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

function convCreate() {
    
}

function huiCreate() {
    const hui = document.createElement('div')
    hui.classList.add('hui')
    hui.innerHTML = `<img src="./images/${getRndInteger(1, 6)}.png" alt="DICK :)">`

    
    hui.style.width = '90px'
    hui.style.height = '90px'
    let huiPosition = 600
    hui.style.left = huiPosition + 'px'

    if (isGame) {
        hui.style.opacity = '100%'
    } else {
        hui.style.opacity = '20%'
    }
    
    gameField.insertAdjacentElement('afterbegin', hui)
    
    function huiMove () {
    
        let huiMove = setInterval(()=>{
            // console.log('Hui: ',huiPosition)
            // console.log('Door:',door.style.left)
            if(huiPosition > -200) {huiPosition = huiPosition - huiSpeed}
            
            hui.style.left = huiPosition + 'px'
            
            if (huiPosition === 0 ) {
                
                huisCount = huisCount + 1
                huisCountOnScreen.textContent = huisCount
                if(huisCount % 10 === 0 && huisCount >= -1){
                    huiSpeed = huiSpeed + 0.5
                    console.log(true, huisCount, huiSpeed, huiPosition)
                }
            }
            if (huiPosition === -200) {
                hui.remove()
            }
            if (collision(door, hui)) {
                clearInterval(huiMove)
                hui.style.opacity = '20%'
                document.querySelectorAll('.hui').forEach(e => e.remove())
                door.style.display = 'none'
            }
        }, 5)
        
    }
    if(isGame) {
        huiMove()
    }
}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min
}

function reset() {
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
    door.style.opacity = '100%'
}

buttonStart.addEventListener('click', ()=> {
    gameStart()
})

buttonRestart.addEventListener('click', ()=> {
    gameStart()
})



function collision (door, hui) {
    if (Number(door.style.left.slice(0, -2)) + 30 >= Number(hui.style.left.slice(0, -2)) && Number(door.style.left.slice(0, -2))+10 <= Number(hui.style.left.slice(0, -2)) && Number(door.style.bottom.slice(0, -2)) <= Number(hui.style.height.slice(0, -2))) {
            console.log('collision')
            gameEnd()
            return true   
    }
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
    endScreen.style.display = 'flex'
    scoreBoard.style.display =  'none'
    gameField.style.marginTop = '33.33px'
    
    door.style.opacity = '20%'
    
    buttonRestart.style.display = 'block'
    isGame = false
    endScreen.innerHTML = `Отакої,<br>ви зачепилися за хуй<br>Ваш рахуок: ${score}<br>Перестрибнуто членів: ${huisCount}`
    clearInterval(huiSpawn)
    clearInterval(scoreCounter)
    return true
}
    









 