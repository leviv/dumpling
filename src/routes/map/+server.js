import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onValue } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyBcgXB-iOzJ_yfF46Eln-BBiznRC61Nfgc",
    authDomain: "world-dumpling-index.firebaseapp.com",
    projectId: "world-dumpling-index",
    storageBucket: "world-dumpling-index.firebasestorage.app",
    messagingSenderId: "924177358324",
    appId: "1:924177358324:web:8b76b161d18a7726b86da1",
    databaseURL: "https://world-dumpling-index-default-rtdb.firebaseio.com/",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

function writeData(country,dumpling,vote){
    const db = getDatabase();
    const reference = ref(db, 'countries/' + country);

    set(reference, {
        dumpling: dumpling,
        vote: vote
    });

}

writeData('TestCountry','YummyDumpling', '1');

export const GET = () => {
    return new Response("map endpoint ok", { status: 200 });
};