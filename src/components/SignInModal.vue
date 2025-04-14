<template>
     <ion-header>
      <ion-toolbar>
        <ion-title>Bare</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding noselect">
      <div class="signInDiv">
        <ion-avatar class="userAvatar" style="width: 124px; height: 124px;">
          <img class="userAvatarSrc" alt="" src="/assets/avatar.svg"/>
        </ion-avatar>
      </div>

      <div class="desktopDisplayID">
        <ion-list :inset="true">
          <ion-list-header v-if="!isPlatform('mobile') && !isPlatform('ios') && !isPlatform('android')" class="listHeader" color="tertiary">
            <ion-label class="listHeader">{{ greetMsg }}</ion-label>
          </ion-list-header>
          <ion-item>
            <ion-input label="Email" type="text" placeholder="Email" :value="email" @input="handleEmail($event)"></ion-input>
          </ion-item>

          <ion-item>
            <ion-input label="Password" type="password" placeholder="Password" :value="password" @input="password = $event.target.value"></ion-input>
          </ion-item>

          <ion-item v-if="errMsg">
            <ion-text color="danger">{{ errMsg }}</ion-text><br>
          </ion-item>

          <ion-item>
            <ion-button type="button" :disabled="!email && !password && !clientInitialized || email && !password && !clientInitialized || clientInitialized" shape="round" color="secondary" size="default" fill="solid" style="margin-top: 24px; margin-bottom: 24px; margin-right: 12px" @click="signIn()">
              <ion-icon slot="end" :icon="logIn"></ion-icon>
              Continue
            </ion-button>
          </ion-item>
          <ion-item>
            <ion-button type="button" :disabled="clientInitialized" shape="round" color="warning" size="small" fill="solid" style="margin-top: 24px; margin-bottom: 24px; margin-right: 12px" @click="forgotCredentials()">
              <ion-icon slot="end" :icon="help"></ion-icon>
              Forgot
            </ion-button>
          </ion-item>
        </ion-list>
      </div>
    </ion-content>
    <ion-fab slot="fixed" horizontal="end" vertical="bottom" style="margin-right: calc(10px); margin-bottom: calc(135px);">
      <ion-fab-button color="primary" mode="ios" @click="closeModal()">
        <ion-icon slot="icon-only" :icon="airplane"></ion-icon>
      </ion-fab-button>
    </ion-fab>
</template>
  
<script setup lang="ts">
import { onMounted, ref } from "vue";
import { IonContent, IonHeader, IonText, IonTitle, IonIcon, IonAvatar, IonToolbar, IonList, IonInput, IonFab, IonFabButton, IonButton, IonItem, IonProgressBar, isPlatform } from "@ionic/vue";
import { logIn, airplane, help } from "ionicons/icons";
import { auth, clientInitialized, closeSetupOnboard, closeModal } from "@/clientHandler";

import { db } from "@/firebase"; 
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { collection, doc, getDoc, query, where, getDocs } from "firebase/firestore";

const username = ref("");
const email = ref("");
const password = ref("");
const errMsg = ref("");

onMounted(() => {
  //checkDesktopDisplay();
})

const getRandomStringFromArray = (array: any) => {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}

const greetMessagesOut = [`Hey 👋`, `🤐`, `Welcome 🙂`, `🏂`, `Hi Again 🥳`];
const greetMessagesIn = [`😊`, `😎`, `Awesome 🚀`, `🤌`, `Miss You 🥹`];
const greetMsg = ref(getRandomStringFromArray(greetMessagesOut));

const handleEmail = async (event: any) => {
  email.value = event.target.value;
  console.log("(signInModal) handleEmail:", email.value);

  setTimeout(async function() {
    const clientUser = query(collection(db, "users"), where("email", "==", email.value));
    const querySnapshot = await getDocs(clientUser);

    if (querySnapshot.empty) {
      //console.log("(signInModal) handleEmail: No user found with this email.");

      const userAvatarSrc = document.querySelector('.userAvatarSrc');
      if (userAvatarSrc) {
        //console.log("(signInModal) RESET_PHOTO_IN_VIEW");
        userAvatarSrc.setAttribute('src', '/assets/avatar.svg'); // Reset to default avatar
      }
      return;
    }

    querySnapshot.forEach((doc: any) => {
      const docData = doc.data();
      if (docData.email === email.value) {
        //console.log("(signInModal) handleEmail: GET_AVATAR", docData.email);
        getAvatar(docData);
      }
    });
  }, 1000);
};

const signIn = () => {
  console.log(`Email: ${email.value}, Username: ${username.value} | Auth:`, auth);

  signInWithEmailAndPassword(auth, email.value, password.value).then((data) => {
    console.log(`(signInModal.signIn) Successfully Authenticated: ${data.user.email} | ${data.user.uid}`);

    errMsg.value = "";
    greetMsg.value = getRandomStringFromArray(greetMessagesIn);

    setTimeout(function() {
      closeModal();
      setTimeout(function() {
        closeSetupOnboard();
      }, 500)
    }, 100)
  }).catch((error) => {
    console.log(`(signInModal.signIn) ${error.message}`);

    switch (error.code) {
      case "auth/invalid-email":
        errMsg.value = "Invalid email, must contain proper formatting.";
        break;
      case "auth/user-not-found":
        errMsg.value = "No user exists with that email.";
        break;
      case "auth/wrong-password":
          errMsg.value = "Incorrect password.";
          break;
      default:
        errMsg.value = "Email or password was incorrect.";
    }
  });
};

const forgotCredentials = () => {
  console.log(`(signInModal) fireBase.forgotCredentials!`);
};

const getAvatar = async (data: any) => {
  const clientUserID = data.id;
  const userDocRef = doc(db, "users", clientUserID);
  const userDocSnap = await getDoc(userDocRef);

  if (userDocSnap.exists()) {
    const avatar = userDocSnap.data().avatar;
    if (avatar) {
      console.log("(signInModal) getAvatar:", avatar);

      const userAvatarSrc = document.querySelector('.userAvatarSrc');
      if (userAvatarSrc) {
        console.log("(signInModal) SET_PHOTO_IN_VIEW");
        userAvatarSrc.setAttribute('src', `${avatar}`);
      }
    }
  } else {
    console.log("(signInModal) user_invalid", userDocRef, data.id)
  }
};
</script>