<template>
    <div class="text-xs-center">
        <v-dialog v-model="showCard" width="500">

            <template v-slot:activator="{ on }">
                <v-btn class="pa-0 ma-0" height="250" depressed block color="transparent transparent--text" v-on="on" @click="blindsManager">Click Me</v-btn>
            </template>

            <v-card min-height="400">
                <v-container>
                    <v-card-title class="headline blue lighten-4 pa-3" primary-title>
                        <template v-if="!editing">
                            {{deviceName}}
                        </template>
                        <v-text-field v-if="editing" v-model="newName" dense filled/>
                        <v-spacer></v-spacer>
                        <v-btn color="blue lighten-1" small @click="closeBlindsCard">
                            <v-icon>mdi-close</v-icon>
                        </v-btn>
                    </v-card-title>

                    <v-card-actions>
                        <v-container>
                            <v-row align="center" justify="center">
                                <v-btn 
                                    color="blue lighten-1 white--text" 
                                    class="mr-6" 
                                    :disabled="opening"
                                    :loading="waitingForOpenConfirmation"
                                    @click="openBlinds"
                                >OPEN</v-btn>
                                <v-btn 
                                    color="blue lighten-1 white--text" 
                                    :disabled="closing"
                                    :loading="waitingForCloseConfirmation"
                                    @click="closeBlinds"
                                >CLOSE</v-btn>
                            </v-row>
                            <v-row align="center" justify="center" class="mt-7">
                                <p class="my-2">Current State: {{this.currentState}}</p>
                            </v-row>
                            <v-row align="center" justify="center">
                                <p class="my-2">Level of obscurity set: {{this.levelOfObscurity}}</p>
                            </v-row>
                            <v-row align="center" justify="center">
                                <p class="my-2">Current level: {{this.currentLevel}}</p>
                            </v-row>
                            <v-row class="mt-8">
                                <v-slider
                                    class="mr-2"
                                    v-model="levelOfObscurity"
                                    v-show="fullyOpenedOrClosed"
                                    thumb-label="always"
                                    label="Obscurity Level" 
                                    min="0"
                                    max="100"
                                    @change="changeObscurityLevel"
                                >
                                    <template v-slot:thumb-label="{ value }">
                                        <v-icon color="white">{{ showObscurityLevelThumb(value) }}</v-icon>
                                    </template>
                                </v-slider>
                            </v-row>

                            <v-row justify="center">
                                <v-btn x-small @click="deleteDevice" class="red" fab v-show="editing">
                                    <v-icon>{{deleteIcon}}</v-icon>
                                </v-btn>
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
export default {
    props: {
        deviceId: String,
        deviceName: String
    },
    data() {
        return {
            showCard: false,
            levelOfObscurity: 0,  // [0-100]
            currentLevel: 0,  // [0-100]
            currentState: "",

            timeout: 6000,    /////
            errorText: "",    // ERROR HANDLING
            snackbar: false,  /////

            editing: false,
            deleteIcon: "mdi-delete",
            newName: this.deviceName,


            opening: false,
            closing: false,
            fullyOpenedOrClosed: false,

            waitingForCloseConfirmation: false,
            waitingForOpenConfirmation: false,
            waitingForSetLevelConfirmation: false,

            secondsUpdater: 0  // if zero, then no timer is executing
        }
    },
    methods: {
        closeBlindsCard() {
            this.showCard = false
            this.editing = false
            clearInterval(this.secondsUpdater)
        },
        blindsManager() {
            const state = '/state';
            this.waitingForCloseConfirmation = true;
            this.waitingForOpenConfirmation = true;
            this.waitingForSetLevelConfirmation = true; 
            this.axios.get('http://127.0.0.1:8081/api/' + 'devices/' + this.deviceId + state)
            .then( (response) => {
                if(response.data.result.level != "undefined") {
                    this.levelOfObscurity = response.data.result.level;
                    this.currentLevel = response.data.result.currentLevel;
                    this.currentState = response.data.result.status;
                    if(this.currentState === 'closing') {
                        this.startIntervalTimer();
                        this.closing = true;
                        this.opening = false;
                    } else if(this.currentState === 'opening') {
                        this.startIntervalTimer();
                        this.closing = false;
                        this.opening = true;
                    } else if(this.currentState === 'closed') {
                        this.closing = true;
                        this.opening = false;
                        this.fullyOpenedOrClosed = true;
                    } else if(this.currentState === 'opened') {
                        this.closing = false;
                        this.opening = true;
                        this.fullyOpenedOrClosed = true;
                    }
                    this.waitingForCloseConfirmation = false;
                    this.waitingForOpenConfirmation = false;
                    this.waitingForSetLevelConfirmation = false;
                } else
                    this.throwErrorMessage("Could not load Device state. Try again later.", 0);
            })
            .catch( () => {
                this.throwErrorMessage("Could not load Device state. Try again later.", 0);
            })
        },
        startIntervalTimer() {
            this.fullyOpenedOrClosed = false;
            this.secondsUpdater = window.setInterval( () => {
                this.axios.get('http://127.0.0.1:8081/api/' + 'devices/' + this.deviceId + '/state')
                .then( (response) => {
                    if(response.data.result.level != "undefined") {
                        this.levelOfObscurity = response.data.result.level;
                        this.currentLevel = response.data.result.currentLevel;
                        this.currentState = response.data.result.status;

                        if(this.currentState === 'opening')
                            this.opening = true;
                        else if(this.currentState === 'closing')
                            this.closing = true;
                        else if(this.currentState === 'closed' || this.currentState === 'opened') {
                            clearInterval(this.secondsUpdater);
                            this.fullyOpenedOrClosed = true;
                            this.getCurrentState();
                            this.secondsUpdater = 0;
                        }
                    } else {
                        this.throwErrorMessage("Could not load Device state. Try again later.", 0);
                        clearInterval(this.secondsUpdater);
                        this.waitingForCloseConfirmation = true;
                        this.waitingForOpenConfirmation = true;
                        this.waitingForSetLevelConfirmation = true;
                    }
                })
                .catch( () => {
                    this.throwErrorMessage("Could not load Device state. Try again later.", 0);
                    clearInterval(this.secondsUpdater);
                    this.waitingForCloseConfirmation = true;
                    this.waitingForOpenConfirmation = true;
                    this.waitingForSetLevelConfirmation = true;
                })
            }, 4000);
        },
        getCurrentState() {
            const state = '/state';
            this.axios.get('http://127.0.0.1:8081/api/' + 'devices/' + this.deviceId + state)
            .then( (response) => {
                if(response.data.result.level != "undefined") {
                    this.levelOfObscurity = response.data.result.level;
                    this.currentLevel = response.data.result.currentLevel;
                    this.currentState = response.data.result.status;
                    if(this.currentState === 'closed') {
                        this.closing = true;
                        this.fullyOpenedOrClosed = true;
                        this.opening = false;
                    } else if(this.currentState === 'opened') {
                        this.closing = false;
                        this.fullyOpenedOrClosed = true;
                        this.opening = true;
                    }
                    this.waitingForSetLevelConfirmation = false;
                } else {
                    this.throwErrorMessage("Could not load Device state. Try again later.", 0);
                    this.waitingForOpenConfirmation = true;
                    this.waitingForCloseConfirmation = true;
                }
            })
            .catch( () => {
                this.throwErrorMessage("Could not load Device state. Try again later.", 0);
                this.waitingForOpenConfirmation = true;
                this.waitingForCloseConfirmation = true;
            })
        },
        openBlinds() {
            this.waitingForOpenConfirmation = true;
            const open = '/open';
            this.axios.put('http://127.0.0.1:8081/api/' + 'devices/' + this.deviceId + open)
            .then( (response) => {
                if(response.data.result === true) {
                    this.opening = true;
                    this.closing = false;
                    this.currentState = 'opening';
                    if(this.secondsUpdater != 0)
                        clearInterval(this.secondsUpdater);
                    this.startIntervalTimer();
                } else {
                    this.throwErrorMessage("Could not open Blinds. Try again later.", 6000);
                }
                this.waitingForOpenConfirmation = false;
            })
            .catch( () => {
                this.throwErrorMessage("Could not open Blinds. Try again later.", 6000);
                this.waitingForOpenConfirmation = false;
            })
        },
        closeBlinds() {
            this.waitingForCloseConfirmation = true;
            const close = '/close';
            this.axios.put('http://127.0.0.1:8081/api/' + 'devices/' + this.deviceId + close)
            .then( (response) => {
                if(response.data.result === true) {
                    this.opening = false;
                    this.closing = true;
                    this.currentState = 'closing';
                    if(this.secondsUpdater != 0) {
                        console.log("Estoy terminado el TIMER anterior")
                        clearInterval(this.secondsUpdater);
                    }
                    this.startIntervalTimer();
                } else
                    this.throwErrorMessage("Could not close Blinds. Try again later.", 6000);
                this.waitingForCloseConfirmation = false;
            })
            .catch( () => {
                this.throwErrorMessage("Could not close Blinds. Try again later.", 6000);
                this.waitingForCloseConfirmation = false;
            })
        },
        changeObscurityLevel(selectObj) {
            const setLevel = '/setLevel';
            this.axios.put('http://127.0.0.1:8081/api/' + 'devices/' + this.deviceId + setLevel, [selectObj])
            .then( () => {
                this.getCurrentState();
            })
            .catch( () => {
                this.throwErrorMessage("Could not change obscurity level. Try again later.", 6000);
                this.waitingForSetLevelConfirmation = false;
            })
        },
        showObscurityLevelThumb(value) {
            if(value === 0)
                return "mdi-brightness-1";
            else if(value > 0 && value <= 50)
                return "mdi-brightness-2";
            else if(value > 50 && value < 100)
                return "mdi-brightness-3";
            else
                return "mdi-close";
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
        deleteDevice() {
            this.editing = false
            // ACA DEBERIA PREGUNTAR CON UN POPUP O ALGO!!!!!!!!!!!!!
            this.$deviceStore.data.deleteDevice(this.deviceId)
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