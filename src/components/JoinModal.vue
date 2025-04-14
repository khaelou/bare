<template>
     <ion-header>
      <ion-toolbar>
        <ion-title>Bare</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding noselect">
      <div class="joinAvatarDiv">
        <ion-avatar class="userAvatar" style="width: 124px; height: 124px;">
          <img class="userAvatarSrc" alt="" src="/assets/avatar.svg"/>
        </ion-avatar>
      </div>
      <div class="addAvatarDiv">
        <ion-button color="success" size="small" @click="addAvatarImage">
            <ion-icon slot="icon-only" :icon="add"></ion-icon>
        </ion-button>
      </div>

      <div class="desktopDisplayID">
        <ion-list :inset="true" lines="none">
          <ion-list-header v-if="!isPlatform('mobile') && !isPlatform('ios') && !isPlatform('android')" class="listHeader" color="secondary">
            <ion-label class="listHeader">Join Bare</ion-label>
          </ion-list-header>
          <ion-item>
            <ion-input :label="`Name`" labelPlacement="floating" type="text" placeholder="Name" :counter="true" :maxlength="16" :value="fullName" @input="fullName = $event.target.value"></ion-input>
          </ion-item>
          <ion-item>
            <ion-input :label="`Username`" labelPlacement="floating" type="text" placeholder="Username" :value="username" :counter="true" :maxlength="16" @input="username = $event.target.value"></ion-input>
          </ion-item>
          <ion-item>
            <ion-input :label="`Email`" labelPlacement="floating" type="text" placeholder="Email" :value="email" @input="email = $event.target.value"></ion-input>
          </ion-item>
          <ion-item>
            <ion-input :label="`Password`" labelPlacement="floating" type="password" placeholder="Password" :value="password" @input="password = $event.target.value"></ion-input>
          </ion-item>
          <ion-item v-if="isPlatform('desktop')" color="none" lines="none" style="margin-top: 8px;">
            <ion-text>Birthday</ion-text>
          </ion-item>
          <ion-item v-if="isPlatform('desktop')" color="none" lines="none" style="margin-top: 4px; margin-bottom: 24px;">
            <ion-datetime-button datetime="birthdate"></ion-datetime-button>
          </ion-item>
          <ion-item color="none" lines="none" style="margin-top: 8px; margin-bottom: 8px;">
            <ion-toggle color="success" labelPlacement="start" :checked="complianceRead" @ion-change="toggleCompliance($event)">I agree to comply with `Bare`.</ion-toggle>
          </ion-item>
          <ion-item v-if="errMsg" style=" margin-bottom: 8px">
            <ion-text color="danger">{{ errMsg }}</ion-text><br>
          </ion-item>
          <ion-item v-if="complianceRead">
            <ion-button type="button" :disabled="!fullName || !username || !email || !password" shape="round" color="secondary" size="default" fill="solid" style="margin-top: 8px; margin-bottom: 24px;" @click.passive="signUp()">
              <ion-icon slot="end" :icon="chevronForward"></ion-icon>
              Continue
            </ion-button>
          </ion-item>
        </ion-list>
      </div>
    </ion-content>
    <ion-fab slot="fixed" horizontal="end" vertical="bottom" style="margin-right: calc(10px); margin-bottom: calc(135px);">
      <ion-fab-button color="primary" mode="ios" @click="closeModal()">
        <ion-icon style="width: 32px; height: 32px; margin-left: -1.5px;" src="" />
      </ion-fab-button>
    </ion-fab>
    <ion-modal :keep-contents-mounted="true">
      <ion-datetime id="birthdate" :value="formattedBirthday" @ion-change="updateBirthDate($event)"></ion-datetime>
    </ion-modal>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { IonContent, IonHeader, IonListHeader, IonTitle, IonToolbar, IonList, IonText, IonToggle, IonFab, IonFabButton, IonIcon, IonAvatar, IonInput, IonButton, IonLabel, IonItem, IonProgressBar, IonSelect, IonSelectOption, IonDatetimeButton, isPlatform } from "@ionic/vue";
import { add, chevronForward, documentLock, documentText } from "ionicons/icons";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import { db } from "@/firebase"; 
import { createUserWithEmailAndPassword, updateProfile} from "firebase/auth";
import { doc, setDoc, Timestamp, getDoc } from "firebase/firestore";
import { uploadFile } from "@/auth";
import { auth, closeSetupOnboard, closeModal } from "@/clientHandler";


const fullName = ref("");
const username = ref("");
const email = ref("");
const password = ref("");
const birthday = ref(new Date(new Date().setFullYear(new Date().getFullYear() - 13)));
const avatar = ref();
const avatarFileName = ref("");
const avatarURL = ref(""); // https://firebasestorage.googleapis.com/v0/b/on-tyme.appspot.com/o/tyme%2Favatar.png?alt=media&token=45391171-4ff2-4eb1-ac1d-f85270e4cd49

const haltSubmission = ref(false);
const uploadIsVideo = ref(false);

const complianceRead = ref(false);
const errMsg = ref("");

onMounted(() => {
  //checkDesktopDisplay();
})

const formattedBirthday = computed(() => {
  if (!birthday.value) return '';
  
  const date = new Date(birthday.value);
  date.setHours(date.getHours() - 6); // Adjust for the 5-hour difference
  return date.toISOString().slice(0, 19);

  // input format: Fri Jul 21 20000 01:22:00 GMT+0000 (Coordinated Universal Time)
  // target format: 2000-07-21T01:22:00
});

const updateBirthDate = (event: any) => {
  console.log("(updateBirthDate) BIRTH_DATE:", event.target.value);
  birthday.value = new Date(event.target.value);
};

const toggleCompliance = async (data: any) => {
  if (complianceRead.value) {
    complianceRead.value = false;
  } else {
    complianceRead.value = true;
  }
}

const signUp = async() => {
  console.log(`Email: ${email.value}, Username: ${username.value}, FullName: ${fullName.value}`);

  // Check if the user is at least 13 years old (only for desktop platform)
  if (isPlatform('desktop')) {
    const today = new Date();
    const birthDate = new Date(birthday.value);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    if (age < 13) {
      errMsg.value = "You must be at least 13 years old.";
      return;
    }
  }

  // Check if the username is already taken
  const takenUsernamesDoc = await getDoc(doc(db, "takenUsernames", username.value));
  if (takenUsernamesDoc.exists()) {
    const err = new Error("Username is already taken.");
    errMsg.value = err.message;
  } else {
    // Check if the email is valid for development environment
    if (import.meta.env.NODE_ENV === 'development' && !email.value.endsWith('@tyme.today')) {
      errMsg.value = "In development, access restricted to team members only.";
      return;
    }

    createUserWithEmailAndPassword(auth, email.value, password.value).then(async (data) => {
      console.log(`(joinModal.signUp) Successfully Registered: ${data.user}`);

      errMsg.value = "";

      if (auth.currentUser) {
        if (avatar.value && avatarFileName.value) {
          avatarURL.value = await uploadFile(avatar.value, avatarFileName.value, auth.currentUser.uid); // Upload image via Firebase Storage
        } else {
          avatarURL.value = "https://firebasestorage.googleapis.com/v0/b/bare-ai.firebasestorage.app/o/bare%2Favatar.svg?alt=media&token=046ca0a7-c04c-4cbd-923e-e457a6e5e3d0";
        }
        console.log("(Firebase) AVATAR_UPLOAD:", avatarURL.value);
      }

      // Store additional details in database via Firestore
      try {
        const userID = data.user.uid;
        const docRef = await setDoc(doc(db, "users", userID), {
          id: userID,
          fullName: fullName.value,
          username: username.value.toLowerCase(),
          email: email.value,
          emailConfirmed: false,    
          birthday: Timestamp.fromDate(birthday.value),
          hapticsPref: false,
          soundsOnPref: true,
          languagePref: "en",
          avatar: avatarURL.value,
          customURL: "",
          peerInCircle: false,
          circleRequests: ["8EFDX3ryctcWtqu78puxV7IWMJw1", "eBGXL3NBbYP3Y8k57XIfXfgEAn03", "vE6UwrKdoJOBZtlWlDrdHCGs8QG2"],
          circle: [],
          following: [],
          followers: [],
          filter: [],
          interests: [],
          crates: [],
          usedCodes: [],
          blocked: [],
          silent: [],
          checkoutDate: Timestamp.fromDate(new Date()),
          checkoutSessionPlan: "",
          sessionSubscription: "",
          plusSub: false,
          plusBadge: "",
          voucherSub: false,
          voucherSubCode: "",
          voucherSubDate: Timestamp.fromDate(new Date()),
          voucherSubDue: Timestamp.fromDate(new Date()),
          pushToken: null,
          verified: false,
          isOnline: false,
          shareOnlineStatus: true,
          discovery: true,
          hidePrivates: false,
          location: "",
          ip: "",
          compliant: complianceRead.value,
          status: "",
          emeralds: 101,
          merchant: false,
          ban: false,
          tinker: false,
          tinkerRole: 0,
          press: false,
          angel: false,
          lastActivity: Timestamp.fromDate(new Date()),
          dateCreated: Timestamp.fromDate(new Date()),
        });

        const user = data.user;
        updateProfile(user, {
          displayName: fullName.value,
          photoURL: avatarURL.value
        })

        // Add the username to the takenUsernames collection
        await setDoc(doc(db, "takenUsernames", username.value), { userID: userID });

        console.log("(Firebase.signUp): Document written with ID:", userID);
      } catch (e) {
        console.error("(Firebase.signUp) Error adding document: ", e);
      }
       
      closeModal();
      setTimeout(function() {
        closeSetupOnboard();

        setTimeout(() => {
         //setSession();
          //clientHandler();
          
          setTimeout(function() {      
            //
          }, 1000)
        }, 500)
      }, 1000)
    }).catch((error) => {
      console.log(`(joinModal.signUp) ${error.message}`);

      switch (error.code) {
        case "auth/email-already-in-use":
          errMsg.value = "That email is already in use.";
          break;
        case "auth/invalid-email":
          errMsg.value = "Invalid email, must contain proper formatting.";
          break;
        case "auth/invalid-password":
            errMsg.value = "Invalid password, must contain at least six characters.";
            break;
        default:
          errMsg.value = error.message;
      }
    });
  }
};

const addAvatarImage = async () => {
  console.log("(joinModal) addAvatarImage: Take / Upload Photo");

  const takePhoto = async () => {
    const photo = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Prompt,
      quality: 100,
    });

    if (photo) {      
      // Read the file from the photo object
      const file = await fetch(`${photo.webPath}`);
      const buffer = await file.arrayBuffer();
      
      // Determine the file extension
      const extensionRegex = /(?:\.([^.]+))?$/;
      const extension = extensionRegex.exec(`${photo.webPath}`)?.[1] ?? "jpeg";
      const fileType = `image/${extension}`;
      
      // Create blob with the automatic fileType
      const blob = new Blob([buffer], { type: fileType });

      // Create a reference to the file in Firebase Storage
      const fileName = `avatar`;

      avatar.value = blob;
      avatarFileName.value = `${fileName}`;

      const userAvatarSrc = document.querySelector('.userAvatarSrc');
      if (userAvatarSrc) {
        console.log("(joinModal) SET_PHOTO_IN_VIEW");
        userAvatarSrc.setAttribute('src', `${photo.webPath}`);
      }
    } else {
      console.log("(joinModal) PHOTO_HALTED");
    }
  };

  return await takePhoto();
}
</script>