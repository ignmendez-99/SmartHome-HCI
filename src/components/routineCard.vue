<template>
    <div class="text-xs-center">
        <v-dialog v-model="showCard" width="900">

            <template v-slot:activator="{ on }">
                <v-btn color="red lighten-2"  dark  v-on="on" @click="routineManager">Añadir Rutina</v-btn>
            </template>

            <v-card min-height="600">
                <v-card-title class="headline blue lighten-4 pa-3" primary-title>
                    Speaker de Nacho
                    <v-spacer></v-spacer>
                    <v-btn color="blue lighten-1" small @click="closeCard">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-card-title>

                <v-card-actions>
                    <v-container>

                        <template>
                            <v-stepper :value=currentStep>
                            <v-stepper-header>
                                <v-stepper-step step="1">Step 1: Select Devices</v-stepper-step>
                                <v-divider></v-divider>
                                <v-stepper-step step="2">Step 2: Select Action</v-stepper-step>
                                <v-divider></v-divider>
                                <v-stepper-step step="3">Step 3: Choose Name</v-stepper-step>
                            </v-stepper-header>
                            </v-stepper>
                        </template>

                        <v-row align="center" justify="center" class="mt-7">
                            <p class="title" v-show="currentStep === 1">Select your devices that will be added to the Routine</p>
                            <p class="title" v-show="currentStep === 2">Select the actions that this routine will execute</p>
                            <p class="title" v-show="currentStep === 3">Select a name for your routine</p>
                        </v-row>
                        <v-row align="center" justify="center" v-show="currentStep === 1">
                            <v-col cols="3"></v-col>
                            <v-col cols="6">
                                <v-select
                                    :items="myDevicesNames"
                                    label="Your Devices"
                                    v-show="currentStep === 1"
                                    chips
                                    multiple
                                    attach
                                    @change="addDeviceToRoutine"
                                ></v-select>
                            </v-col>
                            <v-col cols="3">
                                <v-btn
                                    @click="goToStepTwo" 
                                    color="blue lighten-1 white--text" 
                                    :loading="waitingForStepOneConfirmation"
                                >NEXT</v-btn>
                            </v-col>
                        </v-row>
                        <v-row align="center" justify="center" v-show="currentStep === 2">
                            <v-col cols="3"></v-col>
                            <div v-for="deviceName in devicesNamesSelected" v-bind:key="deviceName">
                                <v-container>
                                    <v-row>
                                        Select action for {{deviceName}}
                                        
                                    </v-row>
                                </v-container>
                                
                            </div>
                        </v-row>
                    </v-container>
                </v-card-actions>

            </v-card>
        </v-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            showCard: false,
            routinesToExecute: [],

            currentStep: 1,

            waitingForStepOneConfirmation: false,
            waitingForStepTwoConfirmation: false,
            waitingForStepThreeConfirmation: false,


            myDevices: [],
            deviceTypes: [],
            devicesNamesSelected: [],

        }
    },
    methods: {
        routineManager() {
            this.showCard = true;
            this.axios.get('http://127.0.0.1:8081/api/' + 'devices')

            .then( (response) => {
                this.myDevices = response.data.result;
                this.myDevices.forEach( (device) => {
                    this.myDevicesNames.push(device.name);
                })
            })
            .catch( () => {
                console.log("No se ha podido obtener los datos de todos los dispositivos");
            })
        },
        closeCard() {
            this.showCard = false;
        },
        addDeviceToRoutine(selectObj) {
            this.devicesNamesSelected.push(selectObj);
        },
        goToStepTwo() {
            this.axios.get('http://127.0.0.1:8081/api/' + 'devicetypes')
            .then( (response) => {
                response.data.result.forEach( (deviceType) => {
                    this.deviceTypes.push(deviceType);
                });
                this.currentStep = 2;
            })
        }
    }
}
</script>