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
import {getDatabase, ref, child, get, set, update, remove} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js";

const firebase = getDatabase();

const confirmButton = document.querySelector('#login')

confirmButton.addEventListener('click',()=>{
    saveUser()
})

export function saveUser(username) {
    set(ref(firebase, 'Users/'+ username), {
        huis: 0,
        score: 0
    }).then(()=>{
        console.log('Успішно збережено', username); 
    })
}

export function saveScore(username, huis, score) {
    set(ref(firebase, 'Users/'+ username), {
        huis: huis,
        score: score
    }).then(()=>{
        console.log('Успішно збережено', huis, ' ', score); 
    })
}


