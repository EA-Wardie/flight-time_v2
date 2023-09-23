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
    IonInput, onIonViewWillLeave,
  } from '@ionic/vue';
  import {useSessionsStore} from '@/stores/sessions';
  import {Ref, ref} from "vue";
  import dayjs from 'dayjs';
  import {Session} from "@/interfaces/Session";
  import {maskito as vMaskito} from '@maskito/vue';
  import {MaskitoOptions} from "@maskito/core";

  const store = useSessionsStore();
  const showActions: Ref<boolean> = ref(false);

  const registrationOptions = {
    mask: [/[a-zA-Z]/g, /[a-zA-Z]/g, '-', /[0-9a-zA-Z]/g, /[0-9a-zA-Z]/g, /[0-9a-zA-Z]/g],
  } as MaskitoOptions;

  const session: Ref<Session> = ref({
    id: null,
    registration: '',
    start: null,
    taxi: null,
    takeoff: null,
    land: null,
    shutoff: null,
  });

  function startNewSession(): void {
    showActions.value = true;
  }

  function setStart(): void {
    session.value.start = dayjs();
  }

  function setTaxi(): void {
    session.value.taxi = dayjs();
  }

  function setTackOff(): void {
    session.value.takeoff = dayjs();
  }

  function setLand(): void {
    session.value.land = dayjs();
  }

  function setShutoff(): void {
    session.value.shutoff = dayjs();
  }

  function createSession(): void {
    store.create(session.value);
    resetSession();
    showSnackbar();
  }

  function resetSession(): void {
    showActions.value = false;
    session.value = {
      id: null,
      registration: '',
      start: null,
      taxi: null,
      takeoff: null,
      land: null,
      shutoff: null,
    };
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
      <div class="expanded flex column ion-justify-content-center ion-align-items-center">
        <ion-button
            size="large"
            v-if="!showActions"
            @click="startNewSession"
        >Start New Session
        </ion-button>

        <ion-list inset lines="full" class="w-full" v-else>
          <ion-item>
            <ion-input
                label="Registration No:"
                placeholder="ZX-XXX"
                v-maskito="registrationOptions"
                v-model="session.registration"
            ></ion-input>
          </ion-item>

          <ion-item>
            <ion-label>Engine Start</ion-label>
            <ion-button
                slot="end"
                v-if="session.start === null"
                @click="setStart"
            >Record
            </ion-button>
            <ion-label
                slot="end"
                v-else
            >{{ dayjs(session.start).format('hh:mm') }}
            </ion-label>
          </ion-item>

          <ion-item>
            <ion-label>Taxi Start</ion-label>
            <ion-button
                slot="end"
                :disabled="session.start === null"
                v-if="session.taxi === null"
                @click="setTaxi"
            >Record
            </ion-button>
            <ion-label
                slot="end"
                v-else
            >{{ dayjs(session.taxi).format('hh:mm') }}
            </ion-label>
          </ion-item>

          <ion-item>
            <ion-label>Takeoff</ion-label>
            <ion-button
                slot="end"
                :disabled="session.taxi === null"
                v-if="session.takeoff === null"
                @click="setTackOff"
            >Record
            </ion-button>
            <ion-label
                slot="end"
                v-else
            >{{ dayjs(session.takeoff).format('hh:mm') }}
            </ion-label>
          </ion-item>

          <ion-item>
            <ion-label>Landed</ion-label>
            <ion-button
                slot="end"
                :disabled="session.takeoff === null"
                v-if="session.land === null"
                @click="setLand"
            >Record
            </ion-button>
            <ion-label
                slot="end"
                v-else
            >{{ dayjs(session.land).format('hh:mm') }}
            </ion-label>
          </ion-item>

          <ion-item>
            <ion-label>Engine Shutoff</ion-label>
            <ion-button
                slot="end"
                :disabled="session.land === null"
                v-if="session.shutoff === null"
                @click="setShutoff"
            >Record
            </ion-button>
            <ion-label
                slot="end"
                v-else
            >{{ dayjs(session.shutoff).format('hh:mm') }}
            </ion-label>
          </ion-item>
        </ion-list>

        <ion-button class="w-full" v-show="session.shutoff !== null" @click="createSession">Save Session</ion-button>
      </div>
    </ion-content>

    <ion-toast
        message="Session successfully recorded"
        position="top"
        color="success"
        :is-open="snackbar"
        :duration="2000"
        @didDismiss="closeSnackbar()"
    ></ion-toast>
  </ion-page>
</template>