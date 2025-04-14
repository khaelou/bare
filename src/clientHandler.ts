import { ref } from "vue";
import { getAuth } from "firebase/auth";
import { app } from "@/firebase";
import { modalController } from "@ionic/vue";

import SetupModal from '@/components/SetupModal.vue';

export let setup: any = ref();
export const setupDismissed = ref(false);

export let clientInitialized = ref(false);
export let clientReady = ref(false);
export let clientOnlyBrowsing = ref(true);

export const auth = getAuth(app);

export function openSetupOnBoard() {
    console.log('SETUP_ON_BOARD');
    setupModal();

    if (!clientReady.value && clientOnlyBrowsing.value) {
        clientReady.value = true;
    }
}

export function closeSetupOnboard() {
    console.log('(closeSetupOnboard) CLOSE_ON_BOARD');

    closeModal();
    if (setup) {
        setup.remove();
    }
}

const setupModal = async function() {
    const modal = await modalController.create({
      component: SetupModal,
      cssClass: 'fullscreen',
      backdropDismiss: false,
    });
    setup = modal;

    return modal.present().then(() => {
      console.log('(clientHandler) setupModal: Initialize Client');
    });
}; 

export async function closeModal() {
    const activeModal = await modalController.getTop();
    if (activeModal) {
        console.log('Close Modal');

        activeModal.dismiss();
    }
}
