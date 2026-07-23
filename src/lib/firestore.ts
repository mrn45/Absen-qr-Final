import { getFirestore, initializeFirestore, doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { app } from './firebase';
import firebaseConfig from '../../firebase-applet-config.json';

export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
}, firebaseConfig.firestoreDatabaseId || '(default)');
const DOC_REF = doc(db, 'absenqr', 'main');

export const getFirestoreData = async () => {
  const snapshot = await getDoc(DOC_REF);
  if (snapshot.exists()) {
    return snapshot.data();
  }
  return null;
};

export const updateFirestoreData = async (data: any) => {
  await setDoc(DOC_REF, data, { merge: true });
};

export const subscribeToFirestore = (callback: (data: any) => void) => {
  return onSnapshot(DOC_REF, (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.data());
    }
  });
};
