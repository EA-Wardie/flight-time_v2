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

function getCurrentTimeSinceEpoch(): number {
  return dayjs().valueOf();
}

function convertEpochHoursMinutes(milliseconds: number): string {
  return dayjs(milliseconds).format("HH:mm");
}

function startNewSession(): void {
  showActions.value = true;
}

function setStart(): void {
  currentSession.start = getCurrentTimeSinceEpoch();
}

function setTaxi(): void {
  currentSession.taxi = getCurrentTimeSinceEpoch();
}

function setTackOff(): void {
  currentSession.takeoff = getCurrentTimeSinceEpoch();
}

function setLand(): void {
  currentSession.land = getCurrentTimeSinceEpoch();
}

function setShutoff(): void {
  currentSession.shutoff = getCurrentTimeSinceEpoch();
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
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonTitle>Current Session</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent class="ion-padding" :fullscreen="true">
      <div
        class="expanded flex column ion-justify-content-center ion-align-items-center"
      >
        <IonButton size="large" v-if="!showActions" @click="startNewSession"
          >Start New Session
        </IonButton>

        <IonList inset lines="full" class="w-full" v-else>
          <IonItem>
            <IonInput
              label="Registration No:"
              placeholder="ZX-XXX"
              v-model="currentSession.registration"
              @input="
                currentSession.registration =
                  currentSession.registration.toUpperCase()
              "
            ></IonInput>
          </IonItem>

          <IonItem>
            <IonLabel>Engine Start</IonLabel>
            <IonButton
              slot="end"
              v-if="currentSession.start === null"
              @click="setStart"
              >Record
            </IonButton>
            <IonLabel slot="end" v-else>{{ convertEpochHoursMinutes(currentSession.start) }} </IonLabel>
          </IonItem>

          <IonItem>
            <IonLabel>Taxi Start</IonLabel>
            <IonButton
              slot="end"
              :disabled="currentSession.start === null"
              v-if="currentSession.taxi === null"
              @click="setTaxi"
              >Record
            </IonButton>
            <IonLabel slot="end" v-else>{{ convertEpochHoursMinutes(currentSession.taxi) }} </IonLabel>
          </IonItem>

          <IonItem>
            <IonLabel>Takeoff</IonLabel>
            <IonButton
              slot="end"
              :disabled="currentSession.taxi === null"
              v-if="currentSession.takeoff === null"
              @click="setTackOff"
              >Record
            </IonButton>
            <IonLabel slot="end" v-else>{{ convertEpochHoursMinutes(currentSession.takeoff) }} </IonLabel>
          </IonItem>

          <IonItem>
            <IonLabel>Landed</IonLabel>
            <IonButton
              slot="end"
              :disabled="currentSession.takeoff === null"
              v-if="currentSession.land === null"
              @click="setLand"
              >Record
            </IonButton>
            <IonLabel slot="end" v-else>{{ convertEpochHoursMinutes(currentSession.land) }} </IonLabel>
          </IonItem>

          <IonItem>
            <IonLabel>Engine Shutoff</IonLabel>
            <IonButton
              slot="end"
              :disabled="currentSession.land === null"
              v-if="currentSession.shutoff === null"
              @click="setShutoff"
              >Record
            </IonButton>
            <IonLabel slot="end" v-else>{{ convertEpochHoursMinutes(currentSession.shutoff) }} </IonLabel>
          </IonItem>
        </IonList>

        <IonButton
          class="w-full"
          v-if="currentSession.shutoff !== null"
          @click="createSession"
          >Save Session
        </IonButton>
      </div>
    </IonContent>

    <IonToast
      message="Session successfully recorded."
      position="top"
      color="success"
      :is-open="snackbar"
      :duration="2000"
      @didDismiss="closeSnackbar()"
    ></IonToast>
  </IonPage>
</template>
