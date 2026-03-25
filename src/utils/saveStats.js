import { doc, getDoc, updateDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../services/firebase';

export const saveMatchStats = async (user, matchData) => {
  if (!user || !db) return null;

  try {
    // 1. Save individual match record
    const matchRef = await addDoc(collection(db, 'matches'), {
      userId: user.uid,
      wpm: matchData.wpm,
      accuracy: matchData.accuracy,
      errors: matchData.errors,
      mode: matchData.mode || 'solo',
      timestamp: serverTimestamp(),
    });

    // 2. Update user aggregate stats
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const currentData = userSnap.data();
      const currentStats = currentData.stats || { bestWPM: 0, averageWPM: 0, accuracy: 0, totalGames: 0 };
      
      const newTotalGames = currentStats.totalGames + 1;
      const newBestWpm = Math.max(currentStats.bestWPM, matchData.wpm);
      
      // Moving average calculation
      const newAverageWpm = Math.round(((currentStats.averageWPM * currentStats.totalGames) + matchData.wpm) / newTotalGames);
      const newAccuracy = Math.round(((currentStats.accuracy * currentStats.totalGames) + matchData.accuracy) / newTotalGames);

      await updateDoc(userRef, {
        'stats.bestWPM': newBestWpm,
        'stats.averageWPM': newAverageWpm,
        'stats.accuracy': newAccuracy,
        'stats.totalGames': newTotalGames,
      });
    }

    return matchRef.id;
  } catch (err) {
    console.error('Error saving match stats:', err);
    throw err;
  }
};
