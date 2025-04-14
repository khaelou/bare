<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<script setup lang="ts">
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import { browserSessionPersistence, getAuth, indexedDBLocalPersistence, inMemoryPersistence, onAuthStateChanged, setPersistence } from 'firebase/auth';
import { onMounted } from 'vue';
import { clientInitialized, openSetupOnBoard } from './clientHandler';
import { app, db } from '@/firebase';
import { clearIndexedDbPersistence } from 'firebase/firestore';

onMounted(() => {
  const auth = getAuth(app);
  const targetPersistence = indexedDBLocalPersistence;
  
  setPersistence(auth, targetPersistence)
  .then(() => {
    console.log("(App) Persistence SET:", targetPersistence.type);

    // Existing and future Auth states are now persisted in the current
    // session only. Closing the window would clear any existing state even
    // if a user forgets to sign out.
    // ...
    // New sign-in will be persisted with session persistence.
    //return signInWithEmailAndPassword(auth, email, password);
  })
  .catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
  });
  
  onAuthStateChanged(auth, user => {
    // Check for user status
    if (user) {
      clientInitialized.value = true;

      console.log("(App) User is signed in:", user.uid);
    } else {
      clientInitialized.value = false;

      openSetupOnBoard();

      console.log("(App) User is signed out!");
    }
  });
})
</script>
