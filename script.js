// const hui = document.querySelector('.hui')
const cube = document.querySelector('.cube')
const body = document.querySelector('body')
const gameField = document.querySelector('.game-field')
const buttonStart = document.querySelector('.button-start')
const buttonRestart = document.querySelector('.button-restart')
const huisCountOnScreen = document.querySelector('.huis-counter > span')
const scoreCountOnScreen = document.querySelector('.score > span')
const scoreBoard = document.querySelector('.score-board')

huisCountOnScreen.style.transition = '0.2s'
scoreCountOnScreen.style.transition = '0.2s'


cube.style.width = '30px'
cube.style.height = '30px'
cube.style.left = '0px'
cube.style.bottom = '0px'
let isGame
let huiSpawn
let isJump = true

let huisCount = 0
let score = 0
let scoreCounter

function huiCreate() {
    const hui = document.createElement('div')
    hui.classList.add('hui')
    hui.innerHTML = '<div class="hui__head"></div><div class="hui__stick"></div><div class="hui__balls"></div>'

    
    hui.style.width = '190px'
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
            huiPosition-- 
            hui.style.left = huiPosition + 'px'
            if (collision(cube, hui)) {
                clearInterval(huiMove)
                hui.style.opacity = '20%'
            }
            if (huiPosition === -1) {
                huisCount = huisCount + 1
                huisCountOnScreen.textContent = huisCount
            }
            if (huiPosition === -200) {
                hui.remove()
            }
            if (isGame === false) {
                document.querySelectorAll('.hui').forEach(e => e.remove())
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

function gameStart() {
    score = 0
    huisCount = 0
    scoreCountOnScreen.textContent = 0
    huisCountOnScreen.textContent = 0
    document.querySelectorAll('.hui').forEach(e => e.remove())
    isGame = true
    buttonStart.style.display = 'none'
    buttonRestart.style.display = 'none'
    scoreBoard.style.display =  'flex'
    gameField.style.marginTop = '0px'

    endScreen.style.display = 'none'
    cube.style.opacity = '100%'

    huiSpawn = setInterval(()=>{
        setTimeout(()=>{
            huiCreate()
        },getRndInteger(1000, 3000))      
    }, 3000)

    scoreCounter = setInterval(()=>{
        score = score + 1 * huisCount
        scoreCountOnScreen.textContent = score
        console.log(score);
    },100)
    
    cubeControl()
    
    console.log(isGame);
}

function gameEnd() {
    endScreen.style.display = 'flex'
    scoreBoard.style.display =  'none'
    gameField.style.marginTop = '33.33px'
    
    cube.style.opacity = '20%'
    
    buttonRestart.style.display = 'block'
    isGame = false
    endScreen.innerHTML = `Отакої,<br>ви зачепилися за хуй<br>Ваш рахуок: ${score}<br>Перестрибнуто членів: ${huisCount}`
    clearInterval(huiSpawn)
    clearInterval(scoreCounter)
    return true
}

buttonStart.addEventListener('click', ()=> {
    gameStart()
})

buttonRestart.addEventListener('click', ()=> {
    gameStart()
})



function collision (cube, hui) {
    if (cube.style.left === hui.style.left && cube.style.bottom <= hui.style.height) {
        console.log('collision')
        
        gameEnd()
        return true
    }
}
let rotateDeg = 0
function cubeControl () {
        body.addEventListener('click', ()=>{
            if (cube.style.bottom === '0px' && isGame) {
                cube.style.transition = '0.5s'
                rotateDeg = rotateDeg + 90
                cube.style.rotate = rotateDeg + 'deg'
                cube.style.bottom = '99px'
                setTimeout(() => {
                    cube.style.bottom = '1px'
                    rotateDeg = rotateDeg + 90
                    cube.style.rotate = rotateDeg + 'deg'
                    setTimeout(() => {
                        cube.style.bottom = '0px'
                    }, 500);
                }, 600);
                
            }      
        })
    
}


const endScreen = document.createElement('div')
    gameField.appendChild(endScreen)
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

    









 