<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Bare</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Home</ion-title>
        </ion-toolbar>
      </ion-header>
      
      <Welcome v-if="!clientInitialized" name="Bare" />
      <UserAccount v-if="clientInitialized" name="Home" />
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/vue';
import { clientInitialized } from '@/clientHandler';
import UserAccount from '@/components/UserAccount.vue';
import Welcome from '@/components/Welcome.vue';
</script>
