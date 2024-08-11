import {saveScore, saveUser, getRecordBoard, sortedUsers} from "./database.js"

const door = document.querySelector('.door')
const body = document.querySelector('body')
const gameField = document.querySelector('.game-field')
const buttonStart = document.querySelector('.button-start')
const buttonRestart = document.querySelector('.button-restart')
const huisCountOnScreen = document.querySelector('.huis-counter > span')
const scoreCountOnScreen = document.querySelector('.score > span')
const scoreBoard = document.querySelector('.score-board')
const staminaInd = document.querySelector('.stamina-indicator')
const form = document.querySelector('.form-username')
const login = document.querySelector('#login')
const game = document.querySelector('#game')
const recordBoard = document.querySelector('.record-box')


const scoreRecord = document.querySelector('.score-record > span')
const huisRecord = document.querySelector('.huis-record > span')

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
endScreen.style.fontSize = '25px'
endScreen.style.backgroundColor = 'rgb(252, 90, 90)'
endScreen.style.transition = '0.5s'
endScreen.style.zIndex = '5'

huisCountOnScreen.style.transition = '0.2s'
scoreCountOnScreen.style.transition = '0.2s'

if (!localStorage.score) {
	scoreRecord.textContent = 0
	huisRecord.textContent = 0
} else {
	scoreRecord.textContent = localStorage.score
	huisRecord.textContent = localStorage.huisCount
}

door.style.left = '0px'
door.style.bottom = '0px'
let isGame
let huiSpawn
let huiSpeed = 1

let huisCount = 0
let score = 0
let scoreCounter



let huis = []
let convs = []



let gameLoop
convCreate(0)
convCreate(600)

getRecordBoard(recordBoard)

body.oncontextmenu = function(event) {
    event.preventDefault();
    event.stopPropagation(); // not necessary in my case, could leave in case stopImmediateProp isn't available? 
    event.stopImmediatePropagation();
    return false;
};


if(localStorage.username != undefined) {
	form.style.display = 'none'
	game.style.display = 'flex'
} else {
	form.style.display = 'flex'
	game.style.display = 'none'
}

login.addEventListener('click', ()=>{
	const username = document.querySelector('#username').value
	
	if(username.length >= 3 && username.length <= 15) {
		form.style.display = 'none'
		game.style.display = 'flex'
	

		localStorage.setItem('username', username)
		saveUser(username)
	} else {
		const inscr = document.querySelector('.inscr')
		console.log(inscr.style.fontSize);

		inscr.style.color = 'red'
		inscr.style.fontSize = (Number(inscr.style.fontSize.slice(0, -2)) + 1) + 'px'
	}
	
})

function gameStart() {
	
	reset()
	isGame = true

	gameLoop = setInterval(gameTick, 5)

	huiSpawn = setInterval(() => {
		setTimeout(() => {
			huiCreate()
		}, getRndInteger(0, 4000+huiSpeed*10*huisCount))
	}, 2000)

	scoreCounter = setInterval(() => {
		score = score + 1 * huisCount
		scoreCountOnScreen.textContent = score
	}, 100)

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
		if (getPosition(conv) <= -conv.width) {
			conv.style.left = conv.width + 'px'
		}
	})

}


function huiCreate() {
	const hui = document.createElement('div')
	hui.classList.add('hui')
	// hui.innerHTML = `<img src="./images/purple-stickman-dancing.gif" alt="DICK :)">`
	hui.innerHTML = `<img src="./images/${getRndInteger(1, 6)}.png" alt="DICK :)">`


	hui.style.width = '90px'
	hui.style.height = '90px'
	let huiPosition = 600
	hui.style.left = huiPosition + 'px'


	gameField.insertAdjacentElement('afterbegin', hui)

	huis.push(hui)
}

function moveHuis() {
	let huisToRemove = []
	huis.forEach(hui => {
		hui.style.left = getPosition(hui) - huiSpeed + 'px'

		if (getPosition(hui) <= -100) {
			hui.remove()
			huisToRemove.push(hui)
			huisCount = huisCount + 1
			huisCountOnScreen.textContent = huisCount
			if (huisCount % 10 === 0 && huisCount >= -1) {
				huiSpeed += 0.2
			}
		}
		if (collision(door, hui)) {
			gameEnd()
		}
	})
	huisToRemove.forEach(hui => {
		hui.remove()
		huis = huis.filter(a => a != hui)
	})
}

function getRndInteger(min, max) {
	return Math.floor(Math.random() * (max - min)) + min
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
	scoreBoard.style.display = 'flex'
	gameField.style.marginTop = '0px'
	door.style.display = 'block'

	endScreen.style.display = 'none'

}

buttonStart.addEventListener('click', () => {
	gameStart()
})

buttonRestart.addEventListener('click', () => {
	gameStart()
})



function collision(door, hui) {
	let doorPosition = getPosition(door)
	let huiPosition = getPosition(hui)

	return doorPosition + 30 >= huiPosition
		&& doorPosition + 10 <= huiPosition
		&& Number(door.style.bottom.slice(0, -2)) <= Number(hui.style.height.slice(0, -2))
}


function doorControl() {
	let stamina = 200
	let lossStamina
	let increasingStamina

	function handleDownEvent () {
		if (Number(door.style.bottom.slice(0, -2)) === 0) {
			if (stamina >= 200) {
				door.style.transition = '0.2s'
				door.style.bottom = '120px'
			}
			clearInterval(increasingStamina)
			lossStamina = setInterval(() => {
				stamina -= 1
				staminaInd.style.width = stamina + 'px'
				if (stamina <= 0) {
					door.style.bottom = '1px'
					setTimeout(() => {
						door.style.bottom = '0px'
					}, 200);
					clearInterval(lossStamina)	
				}
			}, 10)
		}
	}
	function handleUpEvent(){
		clearInterval(increasingStamina)
		door.style.bottom = '1px'
		setTimeout(() => {
			door.style.bottom = '0px'
		}, 200);
		clearInterval(lossStamina)
		increasingStamina = setInterval(() => {
			if (stamina < 200) {
				stamina += 1
				staminaInd.style.width = stamina + 'px'
			}
			if (stamina === 200) {
				clearInterval(increasingStamina)
			}
		}, 5)
	}

	body.addEventListener('mousedown', handleDownEvent)
	body.addEventListener('touchstart', handleDownEvent)
	
	body.addEventListener('mouseup', handleUpEvent)
	body.addEventListener('touchend', handleUpEvent)
}


function gameEnd() {
	clearInterval(gameLoop)
	endScreen.style.display = 'flex'
	scoreBoard.style.display = 'none'
	gameField.style.marginTop = '33.33px'
	buttonRestart.style.display = 'flex'
	isGame = false
	endScreen.innerHTML = `Отакої,<br>ви зачепилися за пеніс<br>Ваш рахуок: ${score}<br>Зібрано пенісів: ${huisCount}`
	clearInterval(huiSpawn)
	clearInterval(scoreCounter)
	document.querySelectorAll('.hui').forEach(e => e.remove())
	door.style.display = 'none'

	if (Number(localStorage.score) <= score ) {
		localStorage.setItem('score', score)
		localStorage.setItem('huisCount', huisCount)
		scoreRecord.textContent = score
		huisRecord.textContent = huisCount
		saveScore(localStorage.username, localStorage.huisCount, localStorage.score)
	} 
	if (!Number(localStorage.score)) {
		localStorage.setItem('score', score)
		localStorage.setItem('huisCount', huisCount)
		scoreRecord.textContent = localStorage.score
		huisRecord.textContent = localStorage.huisCount
		saveScore(localStorage.username, localStorage.huisCount, localStorage.score)
	}

}

// disable userselect for iphone
body.ontouchstart = function(e) {
	e.preventDefault();
}