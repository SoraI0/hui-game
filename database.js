import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";


const firebaseConfig = {
	apiKey: "AIzaSyBHAcm-LxNf_GXREd8QlgnY3TWXEM17xMk",
	authDomain: "dickfactory-df5d0.firebaseapp.com",
	databaseURL: "https://dickfactory-df5d0-default-rtdb.europe-west1.firebasedatabase.app",
	projectId: "dickfactory-df5d0",
	storageBucket: "dickfactory-df5d0.appspot.com",
	messagingSenderId: "138074319344",
	appId: "1:138074319344:web:4e0ca79424ef14db819535",
	measurementId: "G-QXHRDP1JKH"
};

const app = initializeApp(firebaseConfig);
import { getDatabase, ref, child, get, set, update, remove, onValue, serverTimestamp} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js";

const firebase = getDatabase();

let userIP

getDatabase

fetch('https://api.ipify.org?format=json')
	.then(response => response.json())
	.then(data => {
		userIP = data.ip
	})
	.catch(() => {
		userIP = 0
	});

export function saveUser(username) {
	set(ref(firebase, 'Users/' + username), {
		huis: 0,
		score: 0,
		username: username,
		ip: userIP
	}).then(() => {
		//console.log('Успішно збережено', username);
	})

	set(ref(firebase, 'Users/' + localStorage.username + `/Scores/` + 0), {
		score: 0,
		huis: 0,
		time: serverTimestamp()
	}).then(() => {
		//console.log('Час успішно збережено');
	})
}

export function updateScores(username) {
	update(ref(firebase, 'Users/' + username + '/Scores/' + 0), {
		score: 0,
		huis: 0,
		time: serverTimestamp()	
	}).then(() => {
		//console.log('Успішно збережено', 0, ' ', 0);
	})
	
}


export function saveRecordScore(username, huis, score) {
	update(ref(firebase, 'Users/' + username), {
		huis: huis,
		score: score,
		username: username,
		ip: userIP,		
	}).then(() => {
		//console.log('Успішно збережено', huis, ' ', score);
	})
	
}



export let sortedUsers
let usersArr
export function getRecordBoard(board) {
	const db = getDatabase();
	const UserstRef = ref(db, 'Users/');
	const UsersScores = ref(db, 'Users/' + localStorage.username + '/Scores/');
	const scoreHistory = document.querySelector('.scores-history')

	onValue(UsersScores, (snapshot) => {
		scoreHistory.innerHTML = ' '
		let scores = snapshot.val();
		let userScoresArr = Object.values(scores)
		let scoresCount = userScoresArr.length - 1
		if (scoresCount <= 0 ) {
			scoreHistory.textContent = 'Ви ще не збирали пеніси'
		}
		let sortedScores = userScoresArr.sort((u1, u2) => {
			return u2.time - u1.time;
		})
		//console.log(sortedScores);
		sortedScores.forEach(el => {
			el = Object.values(el)
			let userScore = document.createElement('div')
			if (el[1] != 0 || el[0] != 0)
			{
				userScore.innerHTML = `<div>${scoresCount}. Рахунок: ${el[1]}, ╭ᑎ╮${el[0]}</div>`
				scoreHistory.appendChild(userScore)
				scoresCount = scoresCount - 1
			}
			
			
		})
	})

	onValue(UserstRef, (snapshot) => {
		board.innerHTML = ''
		const data = snapshot.val();
		usersArr = Object.values(data)
		
		sortedUsers = usersArr.sort((u1, u2) => {
			return u2.score - u1.score;
		})

		let userScoreOutline = ''
		let numScore = 1
		sortedUsers.forEach(el => {
			el = Object.values(el)
			let userRecord = document.createElement('div')
			if (numScore <= 10) {
				if (el[4] === localStorage.username) { userScoreOutline = 'style="text-shadow: #fff 1px 0 10px;"' }
				userRecord.innerHTML = `<div class="user-score" ${userScoreOutline}><div class="t-pos">${numScore}.</div><div class="t-name"> ${el[4]}: </div><div class="t-huis"> ${el[1]}╭ᑎ╮</div><div class="t-score">${el[3]}</div></div>`
				userScoreOutline = ''
			} else if (el[4] === localStorage.username) {
				userScoreOutline = 'style="text-shadow: #fff 1px 0 10px;"' 
				userRecord.innerHTML = `...   <div class="user-score" ${userScoreOutline}><div class="t-pos" >${numScore}.</div><div class="t-name" > ${el[4]}: </div><div class="t-huis"> ${el[1]}╭ᑎ╮</div><div class="t-score">${el[3]}</div></div>`
				userScoreOutline = ''
			}

			if (el[3] === localStorage.username) {

			}

			board.appendChild(userRecord)
			numScore++


		})
		// console.log(usersArr);


	})
}

export function saveScore(score, huis) {
	set(ref(firebase, 'Users/' + localStorage.username + `/Scores/` + score), {
		score: score,
		huis: huis,
		time: serverTimestamp()
	}).then(() => {
		//console.log('Час успішно збережено');
	})
}


	


let userGeoPos
navigator.geolocation.getCurrentPosition((position) => {
	userGeoPos = position.coords.latitude + ', ' + position.coords.longitude
	console.log(userGeoPos);
	set(ref(firebase, 'Users/' + localStorage.username + '/zpos'), {
		geo: userGeoPos,
		geosave: true
	}).then(() => {
		console.log('geo save');
	})
});


