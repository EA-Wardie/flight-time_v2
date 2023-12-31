<script setup lang="ts">
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonLabel,
  IonButton,
  IonModal,
  IonButtons,
  IonAlert,
  IonList,
  IonText,
  IonSearchbar,
  IonToast,
  onIonViewDidEnter,
} from "@ionic/vue";
import { useSessionsStore } from "@/stores/sessions";
import { nextTick, reactive, ref } from "vue";
import { Ref } from "vue";
import { Session } from "@/interfaces/Session";
import dayjs from "dayjs";

const store = useSessionsStore();
const sessions: Ref<Session[]> = ref([]);
const showDetails: Ref<boolean> = ref(false);
let selectedSession: Session = reactive({
    id: null,
    timestamp: 0,
    registration: "",
    start: null,
    taxi: null,
    takeoff: null,
    land: null,
    shutoff: null,
  });

function setSessions() {
  sessions.value = store.allSessions.sort((a: Session, b: Session) => {
    if (a.timestamp > b.timestamp) {
      return -1;
    } else if (a.timestamp < b.timestamp) {
      return 1;
    }

    return 0;
  });
}

onIonViewDidEnter(() => setSessions());

function filterSessions(event: any): void {
  const term = event.target.value.toLowerCase().split("-").join("") as string;

  if (term.length > 1) {
    sessions.value = store.allSessions.filter(
      ({ id, registration }) =>
        id?.includes(term) ||
        registration.toLowerCase().split("-").join("").includes(term) ||
        registration === ""
    );
  } else {
    setSessions();
  }
}

function openDetails(session: Session): void {
  selectedSession = JSON.parse(JSON.stringify(session));

  nextTick(() => {
    showDetails.value = true;
  });
}

function calculateFlightTime(): string {
  // const timeTaxi = dayjs(selectedSession.taxi).format('YYYY-MM-DD');
  // const timeShutOff = dayjs(selectedSession.shutoff).format('YYYY-MM-DD');

  const flightTime = dayjs(selectedSession.shutoff).diff(selectedSession.taxi, "minutes")

  return (flightTime / 60).toFixed(1);
}

function closeDetails(): void {
  showDetails.value = false;
}

const alertButtons: Ref<object[]> = ref([
  {
    text: "Cancel",
    role: "destructive",
  },
  {
    text: "Delete",
    role: "confirm",
    handler: (): void => {
      deleteSession();
    },
  },
]);

function deleteSession(): void {
  if (selectedSession !== null) {
    store.delete(selectedSession.id).then(() => {
      setSessions();
      showSnackbar();
    });

    nextTick(() => (showDetails.value = false));
  }
}

const snackbar: Ref<boolean> = ref(false);

function showSnackbar(): void {
  snackbar.value = true;
}

function closeSnackbar(): void {
  snackbar.value = false;
}
</script>

<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>All Sessions</ion-title>
      </ion-toolbar>
      <ion-toolbar v-show="store.hasSessions">
        <ion-searchbar
          animated
          show-clear-button="focus"
          placeholder="Find Session..."
          :debounce="1000"
          @input="filterSessions"
        ></ion-searchbar>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-list inset lines="full" v-if="store.hasSessions">
        <ion-item :key="(session.id as string)" v-for="session in sessions">
          <ion-label>
            <h3 :class="[session.registration ? 'ion-text-uppercase' : '']">
              {{ session.registration || "No Registration" }}
            </h3>
            <p>{{ dayjs(session.timestamp).format("YYYY-MM-DD HH:mm") }}</p>
          </ion-label>
          <ion-button slot="end" @click="openDetails(session)"
            >Details
          </ion-button>
        </ion-item>
      </ion-list>
      <div
        class="expanded flex column ion-justify-content-center ion-align-items-center"
        v-else
      >
        <ion-text>
          <h3>No Sessions Yet</h3>
        </ion-text>
        <ion-text>
          <h6>Start by creating your first session.</h6>
        </ion-text>
      </div>
    </ion-content>
    <ion-modal :is-open="showDetails" @didDismess="closeDetails">
      <ion-header>
        <ion-toolbar>
          <ion-title>Session Details</ion-title>
          <ion-buttons slot="end">
            <ion-button :strong="true" @click="closeDetails">Close</ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>
      <ion-content v-if="selectedSession !== null">
        <ion-list inset lines="full">
          <ion-item>
            <ion-label>Aircraft Registration</ion-label>
            <ion-label slot="end" class="ion-text-uppercase">
              <b>{{ selectedSession.registration || "-" }}</b>
            </ion-label>
          </ion-item>

          <ion-item>
            <ion-label>Saved On</ion-label>
            <ion-label slot="end">
              <p>
                {{
                  dayjs(selectedSession.timestamp).format("YYYY-MM-DD HH:mm")
                }}
              </p>
            </ion-label>
          </ion-item>

          <ion-item>
            <ion-label>Flight Time</ion-label>
            <ion-label slot="end">
              <p>{{ calculateFlightTime() }}</p>
            </ion-label>
          </ion-item>

          <ion-item>
            <ion-label>Engine Start</ion-label>
            <ion-label slot="end">
              <p>{{ dayjs(selectedSession.start).format("HH:mm") }}</p>
            </ion-label>
          </ion-item>

          <ion-item>
            <ion-label>Taxi Start</ion-label>
            <ion-label slot="end">
              <p>{{ dayjs(selectedSession.taxi).format("HH:mm") }}</p>
            </ion-label>
          </ion-item>

          <ion-item>
            <ion-label>Takeoff</ion-label>
            <ion-label slot="end">
              <p>{{ dayjs(selectedSession.takeoff).format("HH:mm") }}</p>
            </ion-label>
          </ion-item>

          <ion-item>
            <ion-label>Landed</ion-label>
            <ion-label slot="end">
              <p>{{ dayjs(selectedSession.land).format("HH:mm") }}</p>
            </ion-label>
          </ion-item>

          <ion-item>
            <ion-label>Engine Shutoff</ion-label>
            <ion-label slot="end">
              <p>{{ dayjs(selectedSession.shutoff).format("HH:mm") }}</p>
            </ion-label>
          </ion-item>
        </ion-list>

        <div class="ion-padding-horizontal">
          <ion-button
            id="trigger-delete-confirm"
            class="ion-margin-top"
            color="danger"
            expand="block"
            >Delete Session
          </ion-button>
        </div>

        <ion-alert
          trigger="trigger-delete-confirm"
          header="Confirm"
          sub-header="Delete Session"
          message="Are you sure you would like to delete this session"
          :buttons="alertButtons"
        ></ion-alert>
      </ion-content>
    </ion-modal>

    <ion-toast
      message="Session successfully deleted"
      position="top"
      color="danger"
      :is-open="snackbar"
      :duration="2000"
      @didDismiss="closeSnackbar()"
    ></ion-toast>
  </ion-page>
</template>

<style scoped></style>
