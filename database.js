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
import {getDatabase, ref, child, get, set, update, remove, onValue} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js";

const firebase = getDatabase();
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
    set(ref(firebase, 'Users/'+ username), {
        huis: 0,
        score: 0,
        username: username,
        ip: userIP
    }).then(()=>{
        console.log('Успішно збережено', username); 
    })
}

export function saveScore(username, huis, score) {
    set(ref(firebase, 'Users/'+ username), {
        huis: huis,
        score: score,
        username: username,
        ip: userIP
    }).then(()=>{
        console.log('Успішно збережено', huis, ' ', score); 
    })
}

export let sortedUsers
let usersArr
export function getRecordBoard(board){
    const db = getDatabase();
    const UserstRef = ref(db, 'Users/');
    
    onValue(UserstRef, (snapshot) => {
        board.innerHTML = ''
        const data = snapshot.val();
        usersArr = Object.values(data)
        sortedUsers = usersArr.sort((u1, u2) => {
            return  u2.score - u1.score;
        })

        let numScore = 1
        sortedUsers.forEach(el=>{
            el = Object.values(el)
            let userRecord = document.createElement('div')
            if (numScore <= 15) {
                userRecord.innerHTML = `<div class="user-score"><span class="score-username">${numScore}. ${el[3]}: </span><span class="score-score"> ${el[2]}╭ᑎ╮${el[0]}</span></div>`
            } else if (el[3] === localStorage.username) {
                userRecord.innerHTML = `<div>...</div><div class="user-score"><span class="score-username">${numScore}. ${el[3]}: </span><span class="score-score"> ${el[2]}╭ᑎ╮${el[0]}</span></div>`
            }
            
            board.appendChild(userRecord)
            numScore++

        
        })
        // console.log(usersArr);
        
        
    })
}




