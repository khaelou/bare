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
import { IonHeader, IonToolbar, IonTitle, IonProgressBar, IonContent, IonIcon, IonButton, IonText, modalController, isPlatform } from "@ionic/vue";
import { location, camera, idCard, logIn, glasses } from "ionicons/icons";
import { Camera, CameraResultType } from '@capacitor/camera';
import JoinModal from '@/components/JoinModal.vue';
import SignInModal from '@/components/SignInModal.vue';
import { clientInitialized, clientOnlyBrowsing } from "@/clientHandler";
import { ref, onMounted } from "vue";

let geoBtn, camBtn : any;

const isBouncing = ref(false);
const isWiggling = ref(false);

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
          window.history.replaceState({}, 'Tyme', `/`);
        }
      }, 500)
    }
  }
})

async function initScroll() {
  console.log('(setupModal) InitScroll');

  const scrollGuide = document.querySelector(".scrollGuide"); // 0 w/o prevMonth
  
  if (scrollGuide) {
    console.log('scrollGuide:', scrollGuide);
    //console.log('SCROLL_SUCCESS:', scrollGuide);

    scrollGuide.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } else {
    console.log('SCROLL_ERROR');
  }
}

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

async function checkCameraPermissions() {
  if (await Camera.checkPermissions()) {
    console.log('(checkCameraPermissions) GRANTED!');
  }
}
</script>

<style>
.swimmingPool {
  --background: #0377F5 !important;
}
</style>