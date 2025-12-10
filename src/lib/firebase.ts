import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc, updateDoc, increment } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBcgXB-iOzJ_yfF46Eln-BBiznRC61Nfgc",
    authDomain: "world-dumpling-index.firebaseapp.com",
    projectId: "world-dumpling-index",
    storageBucket: "world-dumpling-index.firebasestorage.app",
    messagingSenderId: "924177358324",
    appId: "1:924177358324:web:8b76b161d18a7726b86da1",
    databaseURL: "https://world-dumpling-index-default-rtdb.firebaseio.com/",
};

// The structure of votes is country-dumplingName as the document ID
// That document contains fields for 'yes' and 'no' vote counts

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

/**
 * Cast a vote for a dumpling in a specific country.
 * 
 * @param country Name of the country the vote is for
 * @param dumplingName Name of the dumpling in the country you're voting for
 * @param isDumpling Did the user press yes or no
 * @returns the yes/no vote counts after the vote has been cast
 */
export async function castVote(country: string, dumplingName: string, isDumpling: boolean) {
    const vote = isDumpling ? 'yes' : 'no';
    const voteKey = `${country}-${dumplingName}`;
    const voteRef = doc(db, 'votes', voteKey);

    // Get current vote counts
    const voteDoc = await getDoc(voteRef);

    if (voteDoc.exists()) {
        await updateDoc(voteRef, {
            [vote]: increment(1)
        });
    } else {
        // Create a new document if no one has voted for this dumpling yet
        await setDoc(voteRef, {
            country,
            dumplingName,
            yes: vote === 'yes' ? 1 : 0,
            no: vote === 'no' ? 1 : 0
        });
    }

    // Get updated counts
    const updatedDoc = await getDoc(voteRef);
    const data = updatedDoc.data();

    return {
        yes: data?.yes || 0,
        no: data?.no || 0
    };
}

/**
 * Get the current vote counts for a dumpling in a specific country.
 * 
 * @param country Name of the country you're getting votes for
 * @param dumplingName Name of the dumpling you're getting votes for
 * @returns 
 */
export async function getVotes(country: string, dumplingName: string) {
    const voteKey = `${country}-${dumplingName}`;
    const voteRef = doc(db, 'votes', voteKey);
    const voteDoc = await getDoc(voteRef);

    if (voteDoc.exists()) {
        const data = voteDoc.data();
        return {
            yes: data?.yes || 0,
            no: data?.no || 0
        };
    }

    return {
        yes: 0,
        no: 0
    };
}
