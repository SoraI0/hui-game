const hui = document.querySelector('.hui')
const cube = document.querySelector('.cube')
const body = document.querySelector('body')
const gameField = document.querySelector('.game-field')
const buttonStart = document.querySelector('.button-start')
const buttonRestart = document.querySelector('.button-restart')

cube.style.width = 30 + 'px'
cube.style.height = 30 + 'px'
cube.style.left = 0 + 'px'
cube.style.bottom = 0 + 'px'
let huiPosition = 600
hui.style.width = 190 +'px'
hui.style.height = 90 + 'px'
hui.style.left = huiPosition + 'px'
console.log(hui.style.width);


function gameStart() {
    let huiMove = setInterval(()=>{
        huiPosition-- 
        hui.style.left = huiPosition + 'px'
        if (collision(cube, hui)) {
            clearInterval(huiMove)
        }
    }, 5)
    buttonStart.style.display = 'none'
    cubeControl(cube)
}

function gameEnd() {
    
    endScreen.style.display = 'flex'
    hui.style.opacity = '20%'
    cube.style.opacity = '20%'
    
    buttonRestart.style.display = 'block'
    return true
}



buttonStart.addEventListener('click', ()=> {
    gameStart()
})



function collision (cube, hui) {
    if (cube.style.left === hui.style.left && cube.style.bottom <= hui.style.height) {
        console.log('collision')
        gameEnd()
        return true
    }
}

function cubeControl (cube) {
    if (gameEnd) {
        body.addEventListener('click', ()=>{
            cube.style.transition = 0.5+'s'
            setTimeout(() => {
                cube.style.bottom = 0 + 'px'
            }, 800);
            cube.style.bottom = 99 + 'px'
        })
    }
}


const endScreen = document.createElement('div')
    gameField.appendChild(endScreen)
    endScreen.style.width = '100%'
    endScreen.style.height = '100%'
    endScreen.style.display = 'none'
    endScreen.style.justifyContent = 'center'
    endScreen.style.alignItems = 'center'
    endScreen.innerHTML = 'Ви зачепилися за хуй'
    endScreen.style.color = 'white'
    endScreen.style.fontSize = '45px'
    endScreen.style.backgroundColor = 'red'

    









 