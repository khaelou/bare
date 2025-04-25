<template>
    <ion-header>
      <ion-toolbar>
        <ion-title>Bare</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding noselect swimmingPool">
      <div class="setupDiv">
      </div>

      <div class="desktopDisplayID">
        <div style="width: calc(70%); margin-left: auto; margin-right: auto;">
          <ion-button type= "button" expand="block" shape="round" color="warning" size="large" fill="solid" style="margin: 24px;" :class="{ joinBtn: true }" @click="joinListener()">
            <ion-icon slot="start" :icon="idCard"></ion-icon>
            Get Started
          </ion-button>
          <ion-button type= "button" expand="block" shape="round" color="dark" size="large" fill="solid" style="margin: 24px;" :class="{ loginBtn: true }" @click="signInListener()">
            <ion-icon slot="end" :icon="logIn"></ion-icon>
            Sign In
          </ion-button>
        </div>

        <div class="innerDiv ion-text-center">
        </div>
        <div class="footerDiv blur">
        </div>
      </div>
    </ion-content>
</template>
  
<script setup lang="ts">
import { IonHeader, IonToolbar, IonTitle, IonContent, IonIcon, IonButton, modalController } from "@ionic/vue";
import {idCard, logIn} from "ionicons/icons";
import JoinModal from '@/components/JoinModal.vue';
import SignInModal from '@/components/SignInModal.vue';
import { ref, onMounted } from "vue";

onMounted(() => {
  //checkDesktopDisplay();

  const url = new URL(window.location.href);
  if (url.searchParams.has('mode') && url.searchParams.has('oobCode')) {
    const mode = url.searchParams.get('mode');
    const oobCode = url.searchParams.get('oobCode');

    if (mode === 'resetPassword' && oobCode) {
      //resetPasswordModal(oobCode);
    } else if (mode === 'verifyEmail' && oobCode) {
      //confirmProfileModal(oobCode);
    } else {
      setTimeout(() => {
        // Redirect to the home page
        window.location.href = '/';
        
        if (window.history.replaceState) {
          window.history.replaceState({}, 'Bare', `/`);
        }
      }, 500)
    }
  }
})

const joinModal = async function() {
  const modal = await modalController.create({
    component: JoinModal,
    cssClass: 'fullscreen',
    backdropDismiss: false,
  });
  return modal.present().then(() => {
    console.log('(setupModal) joinModal: Create Account');
  });
};

const signInModal = async function() {
  const modal = await modalController.create({
    component: SignInModal,
    cssClass: 'fullscreen',
    backdropDismiss: false,
  });
  return modal.present().then(() => {
    console.log('(setupModal) signInModal: Returning User');
  });
};

function joinListener() {
  console.log('(setupModal) Open JoinModal:');
  joinModal();
}

function signInListener() {
  console.log('(setupModal) Open SignInModal:');
  signInModal();
}
</script>

<style>
.swimmingPool {
  --background: #0377F5 !important;
}
</style>