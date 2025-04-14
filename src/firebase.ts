import { initializeApp, setLogLevel } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";
import {
  initializeFirestore,
  memoryLocalCache,
  FirestoreSettings,
  getFirestore,
} from "firebase/firestore";
import { indexedDBLocalPersistence, setPersistence } from "firebase/auth";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyC1mtJtAtu8EEFs5ms7csz6lKtYv4gT4t4",
  authDomain: "bare-ai.firebaseapp.com",
  projectId: "bare-ai",
  storageBucket: "bare-ai.firebasestorage.app",
  messagingSenderId: "1075487874396",
  appId: "1:1075487874396:web:afff107b2b3d055250f599",
  measurementId: "G-0L31TLMB0E"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// `FirestoreSettings` interface extends `PrivateSettings` which contains `useFetchStreams`.
const firestoreSettings: FirestoreSettings /*& { useFetchStreams: boolean } */ = {
  //experimentalAutoDetectLongPolling: true,
  experimentalForceLongPolling: true,
	//useFetchStreams: true
};

//const db = getFirestore(app);
const db = initializeFirestore(app, firestoreSettings, '(default)');

// Other Firebase services
const storage = getStorage(app);
const analytics = getAnalytics(app);

setLogLevel("debug");

console.log("(App) Firebase initialized!");

export { app, db, storage, analytics };
