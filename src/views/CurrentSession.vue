<script setup lang="ts">
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonLabel,
  IonItem,
  IonList,
  IonToast,
  IonInput,
  onIonViewWillLeave,
} from "@ionic/vue";
import { useSessionsStore } from "@/stores/sessions";
import { Ref, reactive, ref } from "vue";
import dayjs from "dayjs";
import { Session } from "@/interfaces/Session";

const store = useSessionsStore();
const showActions: Ref<boolean> = ref(false);

function generateNewSession(): Session {
  return {
    id: null,
    timestamp: 0,
    registration: "",
    start: null,
    taxi: null,
    takeoff: null,
    land: null,
    shutoff: null,
  };
}

let currentSession: Session = reactive(generateNewSession());

function getCurrentTimeAsString(): string {
  return dayjs().format("HH:mm");
}

function startNewSession(): void {
  showActions.value = true;
}

function setStart(): void {
  currentSession.start = getCurrentTimeAsString();
}

function setTaxi(): void {
  currentSession.taxi = getCurrentTimeAsString();
}

function setTackOff(): void {
  currentSession.takeoff = getCurrentTimeAsString();
}

function setLand(): void {
  currentSession.land = getCurrentTimeAsString();
}

function setShutoff(): void {
  currentSession.shutoff = getCurrentTimeAsString();
}

function createSession(): void {
  store.create(currentSession);
  resetSession();
  showSnackbar();
}

function resetSession(): void {
  showActions.value = false;
  currentSession = reactive(generateNewSession());
}

const snackbar: Ref<boolean> = ref(false);

function showSnackbar(): void {
  snackbar.value = true;
}

function closeSnackbar(): void {
  snackbar.value = false;
}

onIonViewWillLeave(() => {
  resetSession();
});
</script>

<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Current Session</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding" :fullscreen="true">
      <div
        class="expanded flex column ion-justify-content-center ion-align-items-center"
      >
        <ion-button size="large" v-if="!showActions" @click="startNewSession"
          >Start New Session
        </ion-button>

        <ion-list inset lines="full" class="w-full" v-else>
          <ion-item>
            <ion-input
              label="Registration No:"
              placeholder="ZX-XXX"
              v-model="currentSession.registration"
              @input="
                currentSession.registration =
                  currentSession.registration.toUpperCase()
              "
            ></ion-input>
          </ion-item>

          <ion-item>
            <ion-label>Engine Start</ion-label>
            <ion-button
              slot="end"
              v-if="currentSession.start === null"
              @click="setStart"
              >Record
            </ion-button>
            <ion-label slot="end" v-else>{{ currentSession.start }} </ion-label>
          </ion-item>

          <ion-item>
            <ion-label>Taxi Start</ion-label>
            <ion-button
              slot="end"
              :disabled="currentSession.start === null"
              v-if="currentSession.taxi === null"
              @click="setTaxi"
              >Record
            </ion-button>
            <ion-label slot="end" v-else>{{ currentSession.taxi }} </ion-label>
          </ion-item>

          <ion-item>
            <ion-label>Takeoff</ion-label>
            <ion-button
              slot="end"
              :disabled="currentSession.taxi === null"
              v-if="currentSession.takeoff === null"
              @click="setTackOff"
              >Record
            </ion-button>
            <ion-label slot="end" v-else
              >{{ currentSession.takeoff }}
            </ion-label>
          </ion-item>

          <ion-item>
            <ion-label>Landed</ion-label>
            <ion-button
              slot="end"
              :disabled="currentSession.takeoff === null"
              v-if="currentSession.land === null"
              @click="setLand"
              >Record
            </ion-button>
            <ion-label slot="end" v-else>{{ currentSession.land }} </ion-label>
          </ion-item>

          <ion-item>
            <ion-label>Engine Shutoff</ion-label>
            <ion-button
              slot="end"
              :disabled="currentSession.land === null"
              v-if="currentSession.shutoff === null"
              @click="setShutoff"
              >Record
            </ion-button>
            <ion-label slot="end" v-else
              >{{ currentSession.shutoff }}
            </ion-label>
          </ion-item>
        </ion-list>

        <ion-button
          class="w-full"
          v-if="currentSession.shutoff !== null"
          @click="createSession"
          >Save Session
        </ion-button>
      </div>
    </ion-content>

    <ion-toast
      message="Session successfully recorded."
      position="top"
      color="success"
      :is-open="snackbar"
      :duration="2000"
      @didDismiss="closeSnackbar()"
    ></ion-toast>
  </ion-page>
</template>
