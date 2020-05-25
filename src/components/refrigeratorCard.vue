<template>
    <div class="text-xs-center">
        <v-dialog v-model="showCard" width="500">

            <template v-slot:activator="{ on }">
                <v-btn class="pa-0 ma-0" height="250" depressed block color="transparent transparent--text" v-on="on" @click="refrigeratorManager">Click Me</v-btn>
            </template>

            <v-card>
                <v-container>
                    <v-card-title class="headline blue lighten-4 pa-3" primary-title>
                        <template v-if="!editing">
                            {{deviceName}}
                        </template>
                        <v-text-field v-if="editing" v-model="newName" dense counter maxlength="25" filled/>
                        <v-spacer></v-spacer>

                        <v-btn color="blue lighten-1" small @click="closeRefrigeratorCard">
                            <v-icon>mdi-close</v-icon>
                        </v-btn>
                    </v-card-title>

                    <v-card-actions>
                        <v-container>
                            <v-row align="center" justify="center" class="mt-7">
                                    <p>Current Freezer Temperature: {{this.freezerTemperature}}</p>
                            </v-row>
                            <v-row align="center" justify="center" >
                                    <v-slider
                                        v-model="freezerTemperature"
                                        value="freezerTemperature"
                                        thumb-label
                                        label="Temp Freezer" 
                                        min="-20"
                                        max="-8"
                                        @change="setFreezerTemperature"
                                    ></v-slider>
                            </v-row>

                            <v-row align="center" justify="center" class="mt-7">
                                <p>Current Fridge Temperature: {{this.fridgeTemperature}}</p>
                            </v-row>
                             <v-row align="center" justify="center" >
                                    <v-slider
                                        v-model="fridgeTemperature"
                                        thumb-label
                                        label="Temp Heladera"
                                        min="2"
                                        max="8"
                                        @change="setTemperature"
                                    ></v-slider>
                            </v-row>
                            <v-row align="center" justify="center" class="mt-7">
                                <p>Current Mode: {{this.mode}}</p>
                            </v-row>
                             <v-row align="center" justify="center" >
                                <v-col cols=6 align="center">
                                    <v-select
                                        :items="modes"
                                        label="Seleccionar Modo"
                                        dense
                                        @change="setMode"
                                    ></v-select>
                                </v-col>
                            </v-row>

                            <v-container></v-container>

                            <v-row justify="center">
                                <deleteObject v-show="editing" :id="deviceId" :name="deviceName"  :type="device"/>
                                <v-btn small @click="cancelPressed" class="mx-4" v-show="editing">CANCEL</v-btn>
                                <v-btn small @click="changeDeviceName" class="blue white--text" v-show="editing">DONE</v-btn>
                                <v-btn small @click="editPressed" v-show="!editing">EDIT</v-btn>
                            </v-row>
                        
                        </v-container>
                    </v-card-actions>

                    <v-snackbar
                        :timeout="timeout"
                        left
                        bottom
                        multi-line
                        v-model="snackbar"
                        color="error"
                    >
                        <strong>{{ errorText }}</strong>
                        <v-btn @click.native="snackbar = false">Close</v-btn>
                    </v-snackbar>

                </v-container>
            </v-card>
        </v-dialog>
    </div>
</template>


<script>

import deleteObject from './deleteObject'

export default {
    props: {
        deviceId: String,
        deviceName: String
    },
    components: {
        'deleteObject': deleteObject
    },
    data() {
        return {
            device: "device",
            showCard: false,
        
            modes: ["default", "vacation", "party"],

            newDeviceName: "",

            slider: "",
            
            waitingForSetFreezerTempConfirmation: false,
            waitingForSetTempConfirmation: false,
            waitingForSetModeConfirmation: false,

            timeout: 6000,    /////
            errorText: "",    // ERROR HANDLING
            snackbar: false,  /////

            freezerTemperature: "",
            fridgeTemperature: "",
            mode: "",

            editing: false,
            newName: this.deviceName,
        }
    },
    methods: {
        closeRefrigeratorCard(){
            this.showCard = false;
            this.editing = false;
        },
        getCurrentState() {
            const state = '/state';
            this.axios.get('http://127.0.0.1:8081/api/' + 'devices/' + this.deviceId + state)
            .then( (response) => {
                if(response.data.result.temperature != "undefined") {
                    this.freezerTemperature = response.data.result.freezerTemperature;
                    this.fridgeTemperature = response.data.result.temperature;
                    this.mode = response.data.result.mode;
                } else
                    this.throwErrorMessage("Could not get Device state. Try again later.", 0);
            })
            .catch( () => {
                this.throwErrorMessage("Could not get Device state. Try again later.", 0);
            })
        },
        refrigeratorManager(){
            const state = '/state';
            this.waitingForSetFreezerTempConfirmation = true;
            this.waitingForSetTempConfirmation = true;
            this.waitingForSetModeConfirmation = true;
            this.axios.get('http://127.0.0.1:8081/api/' + 'devices/' + this.deviceId + state)
            .then( (response) => {
                if(response.data.result.temperature != "undefined") {
                    this.freezerTemperature = response.data.result.freezerTemperature;
                    this.fridgeTemperature = response.data.result.temperature;
                    this.mode = response.data.result.mode;
                    this.waitingForSetFreezerTempConfirmation = false;
                    this.waitingForSetTempConfirmation = false;
                    this.waitingForSetModeConfirmation = false;
                } else
                    this.throwErrorMessage("Could not get Device state. Try again later.", 0);
            })
            .catch( () => {
                this.throwErrorMessage("Could not get Device state. Try again later.", 0);
            })
        },
        setFreezerTemperature(selectObj) {
            this.waitingForSetFreezerTempConfirmation=true;
            const action = '/setFreezerTemperature';
            this.axios.put('http://127.0.0.1:8081/api/' + 'devices/' + this.deviceId + action, [selectObj])
            .then( () => {
                this.getCurrentState();
                this.waitingForSetFreezerTempConfirmation=false;
            })
            .catch( () => {
                this.throwErrorMessage("Could not set freezer temperature. Try again later.", 6000);
                this.waitingForSetFreezerTempConfirmation=false;
            })
        },
        setTemperature(selectObj) {
            this.waitingForSetTempConfirmation=true;
            const action = '/setTemperature';
            this.axios.put('http://127.0.0.1:8081/api/' + 'devices/' + this.deviceId + action, [selectObj])
            .then( () => {
                this.getCurrentState();
                this.waitingForSetTempConfirmation=false;
            })
            .catch( () => {
                this.throwErrorMessage("Could not set temperature. Try again later.", 6000);
                this.waitingForSetTempConfirmation=false;
            })
        },
        setMode(selectObj) {
            this.waitingForSetModeConfirmation=true;
            const action = '/setMode';
            this.axios.put('http://127.0.0.1:8081/api/' + 'devices/' + this.deviceId + action, [selectObj])
            .then( () => {
                this.getCurrentState();
                this.waitingForSetModeConfirmation=false;
            })
            .catch( () => {
                this.throwErrorMessage("Could not set mode. Try again later.", 6000);
                this.waitingForSetModeConfirmation=false;
            })
        },
        throwErrorMessage(message, duration) {
            this.snackbar = true;
            this.errorText = message;
            this.timeout = duration;
        },
        changeDeviceName() {
            this.editing = false
            if (this.newName != this.deviceName)
                this.$deviceStore.data.renameDevice(this.deviceId, this.newName)
        },
        editPressed() {
            this.editing = true
        },
        cancelPressed() {
            this.newName = this.deviceName
            this.editing = false
        }
    }
}
</script>

