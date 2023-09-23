<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="current-session" href="/home/current-session">
          <ion-icon aria-hidden="true" :icon="airplaneOutline" />
          <ion-label>Current Session</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="all-sessions" href="/home/all-sessions">
          <ion-icon aria-hidden="true" :icon="listOutline" />
          <ion-label>All Sessions</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonLabel,
  IonIcon,
  IonPage,
  IonRouterOutlet,
} from "@ionic/vue";
import { airplaneOutline, listOutline } from "ionicons/icons";
</script>
