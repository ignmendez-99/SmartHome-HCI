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
                                <v-stepper-step step="2">Step 2: Select Actions</v-stepper-step>
                                <v-divider></v-divider>
                                <v-stepper-step step="3">Step 3: Choose Name</v-stepper-step>
                            </v-stepper-header>
                            </v-stepper>
                        </template>

                        <v-row align="start" justify="start" class="mt-2">
                            <v-btn 
                            color="blue lighten-1" 
                            v-show="currentStep != 1 && currentStep != 4" 
                            @click="goBack"
                            >
                                <v-icon color="white">mdi-arrow-left</v-icon>
                            </v-btn>
                        </v-row>

                        <v-row align="center" justify="center">
                            <p class="title" v-show="currentStep === 1">Select your devices that will be added to the Routine</p>
                            <p class="title" v-show="currentStep === 2">Select the actions that this routine will execute</p>
                            <p class="title" v-show="currentStep === 3">Select a name for your routine</p>
                        </v-row>
                        
                        <!-- only shown in STEP 1 -->
                        <v-row align="center" justify="center" v-show="currentStep === 1">
                                <v-checkbox 
                                    class="mx-6" v-model="selectedDevices" 
                                    v-for="device in $deviceStore.data.devices" :key="device" 
                                    :label="device.name" :value="device"></v-checkbox>
                        </v-row>

                        <!-- only shown in STEP 1 -->
                        <v-row class="mt-12" align="center" justify="center" v-show="currentStep === 1">
                            <v-btn 
                                @click="currentStep = 2" color="blue lighten-1 white--text" 
                                :loading="waitingForStepOneConfirmation"
                            >NEXT</v-btn>
                        </v-row>

                        
                        <!-- only shown in STEP 2 -->
                        <v-row align="center" justify="center" v-show="currentStep === 2">
                            <!-- <v-col cols="3"></v-col>
                            <div v-for="(deviceName) in devicesNamesSelected" v-bind:key="deviceName">
                                <v-container>
                                    <v-row>
                                        Select action for {{deviceName}}
                                        <v-select label="Select action"></v-select>
                                    </v-row>
                                </v-container>
                            </div> -->
                            <v-select 
                                v-for="device in selectedDevices" 
                                :key="device" 
                                :label="selectText + device.name"
                                :items="$actionStore.data.actionsByDeviceType.get(device.type.id)"
                            ></v-select>
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
            selectedDevices: [],
            selectText: "Actions for ",

            currentStep: 1,

            waitingForStepOneConfirmation: false,
            waitingForStepTwoConfirmation: false,
            waitingForStepThreeConfirmation: false,

        }
    },
    methods: {
        routineManager() {
            this.showCard = true;
            this.axios.get(this.$genericUrl + 'devices')
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
            let size = this.devicesNamesSelected.length;
            if(size == 0 || this.devicesNamesSelected.find( (element) => element === selectObj)) {
                console.log("Estoy en el primero");
                console.log("Size = " + size);
                this.devicesNamesSelected.push(selectObj);
                this.myDevices.forEach( (device) => {
                    if(device.name === selectObj)
                        this.myDevicesSelected.push(device);
                })
            } else {
                console.log("Estoy en el segundo");
                this.devicesNamesSelected.pop(selectObj);
                this.myDevices.forEach( (device) => {
                    if(device.name === selectObj)
                        this.myDevicesSelected.pop(device);
                })
            }
        },
        // goToStepTwo() {
        //     // this.axios.get(this.$genericUrl + 'devicetypes')
        //     // .then( (response) => {
        //     //     response.data.result.forEach( (deviceType) => {
        //     //         this.deviceTypes.push(deviceType);
        //     //     });

        //     //     this.myDevicesSelected.forEach( (deviceSelected, index) => {
        //     //         this.deviceTypes.some( (deviceType) => {
        //     //             if(deviceType.id === deviceSelected.type.id) {
        //     //                 deviceType.actions.forEach( (action) => {
        //     //                     this.myDevicesSelected[index].actions.push(action);
        //     //                 })
        //     //                 return true;
        //     //             }
        //     //         })
        //     //     })

        //         // this.currentStep = 2;
        //     })
        // },
        goBack() {
            if(this.currentStep === 2)
                this.currentStep = 1;
            else if(this.currentStep === 3)
                this.currentStep = 2;
        }
    }
}
</script>