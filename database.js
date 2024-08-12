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

console.log();

let userIP
fetch('https://api.ipify.org?format=json')
	.then(response => response.json())
	.then(data => {
		userIP = data.ip
	})
	.catch(error => {
		console.log('Error:', error);
	});



export function saveUser(username) {
	set(ref(firebase, 'Users/' + username), {
		huis: 0,
		score: 0,
		username: username,
		ip: userIP
	}).then(() => {
		console.log('Успішно збережено', username);
	})

	set(ref(firebase, 'Users/' + localStorage.username + `/Scores/` + 0), {
		score: 0,
		huis: 0,
		time: serverTimestamp()
	}).then(() => {
		console.log('Час успішно збережено');
	})
}




export function saveRecordScore(username, huis, score) {
	update(ref(firebase, 'Users/' + username), {
		huis: huis,
		score: score,
		username: username,
		ip: userIP,		
	}).then(() => {
		console.log('Успішно збережено', huis, ' ', score);
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
		let scoresCount = userScoresArr.length
		if (scoresCount <= 0 ) {
			scoreHistory.textContent = 'Ви ще не зіграли'
		}
		let sortedScores = userScoresArr.sort((u1, u2) => {
			return u2.time - u1.time;
		})
		console.log(sortedScores);
		sortedScores.forEach(el => {
			el = Object.values(el)
			let userScore = document.createElement('div')
			userScore.innerHTML = `<div>${scoresCount}. Рахунок: ${el[1]}, ╭ᑎ╮${el[0]}</div>`
			scoreHistory.appendChild(userScore)
			scoresCount = scoresCount - 1
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
				userRecord.innerHTML = `<div ${userScoreOutline} class="user-score"><span class="score-username">${numScore}. ${el[4]}: </span><span class="score-score"> ${el[3]}╭ᑎ╮${el[1]}</span></div>`
				userScoreOutline = ''
			} else if (el[4] === localStorage.username) {
				userRecord.innerHTML = `<div>...</div><div ${userScoreOutline} class="user-score"><span class="score-username">${numScore}. ${el[4]}: </span><span class="score-score"> ${el[3]}╭ᑎ╮${el[1]}</span></div>`
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

console.log();

export function saveScore(score, huis) {
	set(ref(firebase, 'Users/' + localStorage.username + `/Scores/` + score), {
		score: score,
		huis: huis,
		time: serverTimestamp()
	}).then(() => {
		console.log('Час успішно збережено');
	})
}


// function convertDate(time) {
// 	//time should be server timestamp seconds only
// 	let dateInMillis = time * 1000
// 	let date = new Date(dateInMillis)
// 	let myDate = date.toLocaleDateString()
// 	let myTime = date.toLocaleTimeString()
// 	myDate = myDate.replaceAll('/', '-')
// 	return myDate + " " + myTime
// }

// console.log();




