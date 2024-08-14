import { saveScore, saveRecordScore, saveUser, getRecordBoard, sortedUsers, updateScores} from "./database.js"

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
let convSpeed = 1

let huisCount = 0
let score = 0
let scoreCounter



let huis = []
let convs = []



let gameLoop
convCreate(0)
convCreate(600)

getRecordBoard(recordBoard)

body.oncontextmenu = function (event) {
	event.preventDefault();
	event.stopPropagation(); // not necessary in my case, could leave in case stopImmediateProp isn't available? 
	event.stopImmediatePropagation();
	return false;
};

if (localStorage.username != undefined) {
	form.style.display = 'none'
	game.style.display = 'flex'

} else {
	form.style.display = 'flex'
	game.style.display = 'none'
}


login.addEventListener('click', () => {
	const username = document.querySelector('#username').value
	const inscr = document.querySelector('.inscr')
	let sameName = false

	sortedUsers.forEach(el => {
		el = Object.values(el)
		if (el[4] === username) {
			//console.log('dawda');
			sameName = true
			inscr.textContent = "(таке ім'я вже існує)"
			inscr.style.color = 'red'
			inscr.style.fontSize = (Number(inscr.style.fontSize.slice(0, -2)) + 1) + 'px'
		}
		
	})
	

	if (username.length >= 3 && username.length <= 15 && !sameName ) {
		form.style.display = 'none'
		game.style.display = 'flex'

		localStorage.setItem('username', username)
		saveUser(username)
		updateScores(localStorage.username)
		window.location.reload();
	} else if (username.length < 3 || username.length > 15) {
		inscr.textContent = '(мінімум 3 символи, максимум 15)'
		inscr.style.color = 'red'
		inscr.style.fontSize = (Number(inscr.style.fontSize.slice(0, -2)) + 1) + 'px'
	} 

	

})

function pauseGame() {
	clearInterval(gameLoop)
	clearInterval(huiSpawn)
	clearInterval(scoreCounter)
}



function gameStart() {
	isGame = true
	reset()

	gameLoop = setInterval(gameTick, 5)

	huiSpawn = setInterval(() => {
		setTimeout(() => {
			huiCreate()
		}, getRndInteger(0, 4000 + convSpeed * 100 + huisCount * 10))
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
		conv.style.left = getPosition(conv) - convSpeed + 'px'
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
		hui.style.left = getPosition(hui) - convSpeed + 'px'

		if (getPosition(hui) <= -100) {
			hui.remove()
			huisToRemove.push(hui)
			huisCount = huisCount + 1
			huisCountOnScreen.textContent = huisCount
			if (huisCount % 10 === 0 && huisCount >= -1) {
				convSpeed += 0.2
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
	convSpeed = 1
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

function getPosition(element) {
	return Number(element.style.left.slice(0, -2))
}

function collision(door, hui) {
	let doorPosition = getPosition(door)
	let huiPosition = getPosition(hui)

	return doorPosition + 43 >= huiPosition
		&& doorPosition <= huiPosition
		&& Number(door.style.bottom.slice(0, -2)) <= 30
		|| doorPosition + 13 >= huiPosition
		&& doorPosition <= huiPosition
		&& Number(door.style.bottom.slice(0, -2)) > 30
		&& Number(door.style.bottom.slice(0, -2)) < 90
		|| doorPosition >= huiPosition
		&& doorPosition - 60 <= huiPosition
		&& Number(door.style.bottom.slice(0, -2)) < 90
		
}

function gameEnd() {
	saveScore(score, huisCount)
	getRecordBoard(recordBoard)
	isGame = false
	clearInterval(gameLoop)
	endScreen.style.display = 'flex'
	scoreBoard.style.display = 'none'
	gameField.style.marginTop = '33.33px'
	buttonRestart.style.display = 'flex'

	endScreen.innerHTML = `Отакої,<br>ви зачепилися за пеніс<br>Ваш рахуок: ${score}<br>Зібрано пенісів: ${huisCount}`
	clearInterval(huiSpawn)
	clearInterval(scoreCounter)
	document.querySelectorAll('.hui').forEach(e => e.remove())
	door.style.display = 'none'

	if (Number(localStorage.score) <= score) {
		localStorage.setItem('score', score)
		localStorage.setItem('huisCount', huisCount)
		scoreRecord.textContent = score
		huisRecord.textContent = huisCount
		saveRecordScore(localStorage.username, huisCount, score)
	}
	if (!Number(localStorage.score)) {
		localStorage.setItem('score', score)
		localStorage.setItem('huisCount', huisCount)
		scoreRecord.textContent = localStorage.score
		huisRecord.textContent = localStorage.huisCount
		saveRecordScore(localStorage.username, huisCount, score)
	}

}

// disable userselect for iphone
body.ontouchstart = function (e) {
	e.preventDefault();
}


let stamina = 200;
let lossStamina;
let increasingStamina;
let doorMove;

function doorOpening() {
	clearInterval(doorMove);
	doorMove = setInterval(() => {
		door.style.bottom = Number(door.style.bottom.slice(0, -2)) + 1 * convSpeed + 'px';
		if (Number(door.style.bottom.slice(0, -2)) >= 120) { clearInterval(doorMove); }
	}, 3);
	
}

function doorEnding() {
	clearInterval(doorMove);
	doorMove = setInterval(() => {
		door.style.bottom = Number(door.style.bottom.slice(0, -2)) - 1*convSpeed + 'px';
		if (Number(door.style.bottom.slice(0, -2)) <= 0) { clearInterval(doorMove); }
	}, 3);
}

function handleDownEvent() {
	if (Number(door.style.bottom.slice(0, -2)) <= 0) {
		if (stamina >= 75) {
			doorOpening();
		}
		clearInterval(increasingStamina);
		lossStamina = setInterval(() => {
			stamina -= 1 * convSpeed;
			staminaInd.style.width = stamina + 'px';
			if (stamina <= 0) {
				doorEnding();
				clearInterval(lossStamina);
			}
		}, 13);
	}
}

function handleUpEvent() {
	if (Number(door.style.bottom.slice(0, -2)) > 0) { doorEnding(); }
	clearInterval(increasingStamina);
	clearInterval(lossStamina);
	increasingStamina = setInterval(() => {
		if (stamina < 200) {
			stamina += 1;
			staminaInd.style.width = stamina + 'px';
		}
		if (stamina === 200) {
			clearInterval(increasingStamina);
		}
	}, 10);
}
function spaceBarDown(event){
	if (event.code === 'Space') {
		handleDownEvent()
	}
}
function spaceBarUp(event){
	if (event.code === 'Space') {
		handleUpEvent()
	}
}

function doorControl() {
	body.removeEventListener('mousedown', handleDownEvent);
	body.removeEventListener('mouseup', handleUpEvent);
	body.removeEventListener('touchstart', handleDownEvent);
	body.removeEventListener('touchend', handleUpEvent);
	body.removeEventListener('keydown', spaceBarDown)
	body.removeEventListener('keyup', spaceBarUp)

	
	
	
	body.addEventListener('mousedown', handleDownEvent);
	body.addEventListener('touchstart', handleDownEvent);
	body.addEventListener('mouseup', handleUpEvent);
	body.addEventListener('touchend', handleUpEvent);

	body.addEventListener('keydown', spaceBarDown)

	body.addEventListener('keyup', spaceBarUp)
	
}


	

