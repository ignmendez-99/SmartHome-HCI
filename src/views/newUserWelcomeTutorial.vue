<template>
    <div>

        <v-container>
            <v-row class="my-5">
                <v-col align="center">
                    <p class="display-3">Welcome to UltraHome, Juan!</p>
                </v-col>
            </v-row>
            <v-row>
                <v-col align="center">
                    <template>
                        <v-stepper :value=currentStep>
                        <v-stepper-header>
                            <v-stepper-step step="1">Step 1: create a new home</v-stepper-step>
                            <v-divider></v-divider>
                            <v-stepper-step step="2">Step 2: Create a new room</v-stepper-step>
                            <v-divider></v-divider>
                            <v-stepper-step step="3">Step 3: add your first device</v-stepper-step>
                        </v-stepper-header>
                        </v-stepper>
                    </template>
                </v-col>
            </v-row>
        </v-container>

    

        <v-container class="mb-12 pt-0">
            <v-row>
                <v-col cols="4" align="center">
                    <v-text-field
                        v-show="currentStep === 1"
                        id="newHomeName"
                        v-model="homeName"
                        label="Name of the new home"
                        :rules="[rules.required, rules.counter]"
                        counter
                        maxlength="25"
                    ></v-text-field>
                    <v-btn class="my-0" v-bind:disabled="homeName === ''" color="light-blue darken-1 white--text" @click="currentStep++" v-show="currentStep === 1">Add home</v-btn>

                    <v-card color="light-blue darken-1" v-show="currentStep !== 1">
                        <v-icon class="my-2" large>mdi-check</v-icon>
                    </v-card>
                    <v-card v-show="currentStep !== 1" align="center">
                        <v-card-title class="justify-center">{{homeName}} added!</v-card-title>
                    </v-card>
                </v-col>

                <v-col cols="4" align="center">
                    <v-text-field
                        v-show="currentStep === 2"
                        v-model="roomName"
                        label="Name of the new room"
                        :rules="[rules.required, rules.counter]"
                        counter
                        maxlength="25"
                    ></v-text-field>
                        <v-btn class="my-0" outlined color="light-blue darken-1" v-show="currentStep === 2" @click="currentStep--">Go back</v-btn>
                        <v-btn class="my-0" v-bind:disabled="roomName === ''" color="light-blue darken-1 white--text" @click="currentStep++" v-show="currentStep === 2">Add room</v-btn>
                    <v-card color="light-blue darken-1" v-show="currentStep === 3 || currentStep === 4">
                        <v-icon class="my-2" large>mdi-check</v-icon>
                    </v-card>
                    <v-card v-show="currentStep === 3 || currentStep === 4">
                        <v-card-title class="justify-center">{{roomName}} added!</v-card-title>
                    </v-card>
                </v-col>

                <v-col cols="4" align="center">
                    <v-select
                    v-show="currentStep === 3"
                    :items="items"
                    item-text="name"
                    item-value="id"
                    return-object
                    label="Devices found ready to connect"
                    dense
                    v-on:change="selectedDevice"
                    ></v-select>
                
                    <v-text-field
                        v-show="currentStep === 3"
                        v-model="deviceName"
                        label="Device name"
                        :rules="[rules.required, rules.counter]"
                        counter
                        maxlength="30"
                    ></v-text-field>
                        <v-btn class="my-0" outlined color="light-blue darken-1" @click="currentStep--" v-show="currentStep === 3">Go back</v-btn>
                        <v-btn class="my-0" v-bind:disabled="deviceName === ''" color="light-blue darken-1 white--text" @click="finishSteps" v-show="currentStep === 3">Add device</v-btn>
                    <v-card color="light-blue darken-1" v-show="currentStep === 4">
                        <v-icon class="my-2" large>mdi-check</v-icon>
                    </v-card>
                    <v-card v-show="currentStep === 4">
                        <v-card-title class="justify-center">{{deviceName}} added!</v-card-title>
                    </v-card>
                </v-col>
            </v-row>

          <!-- only used for making some white space at the bottom before first step is completed -->
          <!-- todo: NO SE CUANDO PONERLO (tipo si al principio/final/siempre) -->
          <v-row class="my-12" v-show="true"></v-row>

          <!-- only shown when all 3 steps have been completed -->
            <v-row align="center" v-show="currentStep === 4">      
                <v-col align="center" cols="12">
                    All set up! Now you can start controlling your devices.
                </v-col>
                <v-col align="center" cols="12">
                    <router-link to="/devices" style="text-decoration: none; color: inherit;">
                        <v-btn color="light-blue darken-1 white--text">Start</v-btn>
                    </router-link>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>
    export default {
        data() {
            return{
                items: [
                    {name:'JBL Speaker', id:'c89b94e8581855bc'}, 
                    {name:'Nava\'s Faucet', id:'dbrlsh7o5sn8ur4i'}, 
                    {name:'Soft blinds', id:'eu0v2xgprrhhg41g'}, 
                    {name:'Philips HUE lights', id:'go46xmbqeomjrsjr'}, 
                    {name:'Pentagono door', id:'lsf78ly0eqrjbz91'}, 
                    {name:'GE Vacuum 5000', id:'ofglvd9gqx8yfl3l'}, 
                    {name:'LG Fridge 7 million', id:'rnizejqr2di0okho'}
                    ],
                currentStep: 1,
                dialog: false,
                rules: {
                    required: value => !!value || 'Required.',
                    counter: value => value.length <= 25 || 'Max 25 characters'
                },
                homeName: "",
                roomName: "",
                deviceName: "",
                deviceSelectedId: "",
                genericUrl: 'http://127.0.0.1:8081/api/'
            }
        },
        methods: {
            finishSteps: function() {
                /* aumentamos al paso 4, para mostrar que los 3 pasos ya estan completados */
                this.currentStep ++;
                this.firstTimeRegistration(this.homeName, this.roomName, this.deviceName, this.deviceSelectedId);
            },
            selectedDevice(selectObj) {
                this.deviceSelectedId = selectObj.id;
            },
            firstTimeRegistration: function(newHomeName, newRoomName, newDeviceName, selectedId) {
                // Esto nos permite poder poner "axios" en vez de "this.axios" cada vez que querramos hacer un request
                // lo hicimos porque 2 niveles mas abajo el "this.axios" explotaba
                const axios = require('axios');  
                const genericUrl = this.genericUrl;
                // estas 3 cosas solo van a tener alcance de ACA PRA ADENTRO
                // ¿como hacemos entonces para mandarle estas 3 cosas a myDevices.vue ?
                var homeID;
                var roomID;
                var deviceID;
                
                axios.post(genericUrl + 'homes', {
                    name: newHomeName,
                    meta: {}
                })
                .then((response) => {
                    homeID = response.data.result.id;
                    console.log("1. El id de la home creada es: " + homeID);
                    axios.post(genericUrl + 'rooms', {
                        name: newRoomName,
                        meta: {}
                    })
                    .then( (response) => {
                        roomID = response.data.result.id;
                        console.log("2. El id de la room creada es: " + roomID);
                        axios.post(genericUrl + 'devices', {
                            type: {
                                id: selectedId //"go46xmbqeomjrsjr" // HARDCODEADO  (ES SIEMPRE UN DEVICE TIPO LAMPARA!!!)
                            },
                            name: newDeviceName,
                            meta: {}
                        })
                        .then( (response) => {
                            deviceID = response.data.result.id;
                            console.log("3. El id del device creado es: " + deviceID);
                            axios.post(genericUrl + 'homes/' + homeID + "/rooms/" + roomID, {})
                            .then( () => {
                                console.log("4. Se incluyó la room " + roomID + " en la home " + homeID);
                                axios.post(genericUrl + 'rooms/' + roomID + "/devices/" + deviceID, {})
                                .then( () => {
                                    console.log("5. Se incluyó el device " + deviceID + " en la room " + roomID);
                                })
                                .catch(function () {
                                    console.log("Fallo agregar el device a la room");
                                    // MOSTRAR UN POPUP DICIENDO QUE FALLO LA OPERACION
                                });
                            })
                            .catch(function () {
                                console.log("Fallo agregar la room a la home");
                                // MOSTRAR UN POPUP DICIENDO QUE FALLO LA OPERACION
                            });
                        })
                        .catch(function () {
                            console.log("No se pudo crear un device");
                            // MOSTRAR AL USUARIO UN POPUP DICIENDO QUE NO SE PUDO CREAR UN DEVICE !!
                        });
                    })
                    .catch(function () {
                        console.log("No se pudo crear una Room");
                        //MOSTRAR AL USUARIO UN POPUP DICIENDO QUE NO SE PUDO CREAR UNA ROOM !!
                    });
                })
                .catch(function () {
                    console.log("La casa no pudo ser añadida");
                    // MOSTRAR POPUP AL USUARIO DICIENDO QUE LA CASA NO PUDO SER AÑADIDA!!!
                });   
            }
        }   
    }
</script>