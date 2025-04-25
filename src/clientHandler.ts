import { ref } from "vue";
import { getAuth } from "firebase/auth";
import { app } from "@/firebase";
import { modalController } from "@ionic/vue";

import SetupModal from '@/components/SetupModal.vue';

export let setup: any = ref();
export const setupDismissed = ref(false);

export let clientInitialized = ref(false);

export const auth = getAuth(app);

export function openSetupOnBoard() {
    console.log('SETUP_ON_BOARD');
    setupModal();
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

const MAX_CONCURRENT_LOADS = 3; // Limit number of concurrent loads
let currentLoads = 0; // Track current number of loads

const lazyMediaObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting || currentLoads >= MAX_CONCURRENT_LOADS) return;

    const element = entry.target as HTMLElement;
    const imageUrl = element.dataset.src;
    const cssVariable = element.dataset.cssVariable;

    if (!imageUrl || !cssVariable) return;

    currentLoads++;

    const img = new Image();
    img.src = imageUrl;

    const cleanup = () => {
      lazyMediaObserver.unobserve(element);
      currentLoads--;
    };

    img.onload = () => {
      element.style.setProperty(cssVariable, `url(${imageUrl})`);
      cleanup();
    };

    img.onerror = () => {
      //console.error('(lazyMediaObserver) Failed to load image:', imageUrl);
      cleanup();
    };
  });
}, { rootMargin: '100px', threshold: 0.1 });

export function lazyLoadMedia(element: any, cssVariable: string, imageUrl: string) {
  element.dataset.src = imageUrl;
  element.dataset.cssVariable = cssVariable;
  lazyMediaObserver.observe(element);
}