<template>
    <div class="text-xs-center">
        <v-dialog v-model="showCard" width="500">

            <template v-slot:activator="{ on }">
                <v-btn class="pa-0 ma-0" height="250" depressed block color="transparent transparent--text" v-on="on" @click="doorManager">Click Me</v-btn>
            </template>

            <v-card>
                <v-container>
                    <v-card-title class="headline blue lighten-4 pa-3" primary-title>
                        <template v-if="!editing">
                            {{deviceName}}
                        </template>
                        <v-text-field v-if="editing" v-model="newName" class="mb-0" counter maxlength="25" dense filled/>
                        <v-spacer></v-spacer>

                        <v-btn color="blue lighten-1" small @click="closeDoorCard">
                            <v-icon>mdi-close</v-icon>
                        </v-btn>
                    </v-card-title>

                    <v-card-actions>
                        <v-container>
                            <v-row align="center" justify="center">
                                    <v-btn 
                                        x-large
                                        color="blue lighten-1 white--text" 
                                        class="mr-6"
                                        :disabled="opened" 
                                        :loading="waitingForOpenConfirmation"
                                        @click="openDoor"
                                    >OPEN</v-btn>
                                    <v-btn 
                                        x-large
                                        color="blue lighten-1 white--text" 
                                        :disabled="closed"
                                        :loading="waitingForCloseConfirmation"
                                        @click="closeDoor"
                                    >CLOSE</v-btn>
                            </v-row>

                            <v-container></v-container>

                            <v-row align="center" justify="center">
                                <v-btn 
                                    large
                                    color="blue lighten-1 white--text" 
                                    class="mr-6" 
                                    :disabled="locked" 
                                    :loading="waitingForLockConfirmation"
                                    @click="lockDoor"
                                >LOCK</v-btn>
                                <v-btn 
                                    large
                                    color="blue lighten-1 white--text" 
                                    :disabled="unlocked" 
                                    :loading="waitingForUnlockConfirmation"
                                    @click="unlockDoor"
                                >UNLOCK</v-btn>
                            </v-row>

                            <v-row align="center" justify="center" class="mt-7">
                                <p>Current State: {{this.currentState}}</p>
                            </v-row>
                            <v-row align="center" justify="center">
                                <p>Current Lock State: {{this.lockState}}</p>
                            </v-row>

                            <v-container></v-container>

                            <v-row justify="center">
                                <deleteObject v-show="editing" :id="deviceId" :name="deviceName" :type="device"/>
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
        
            newDeviceName: "",

            currentState: "",
            lockState: "",
            
            closed: true,
            opened: false,

            locked: false,
            unlocked: true,

            timeout: 6000,    /////
            errorText: "",    // ERROR HANDLING
            snackbar: false,  /////

            waitingForCloseConfirmation: false,
            waitingForOpenConfirmation: false,
            waitingForLockConfirmation: false,
            waitingForUnlockConfirmation: false,

            editing: false,
            newName: this.deviceName,
        }
    },
    methods: {
        closeDoorCard(){
            this.showCard = false;
            this.editing = false;
        },
        doorManager(){
            const state = '/state';
            this.waitingForCloseConfirmation = true;
            this.waitingForOpenConfirmation = true;
            this.waitingForLockConfirmation = true;
            this.waitingForUnlockConfirmation = true;
            this.axios.get(this.$genericUrl + 'devices/' + this.deviceId + state)
            .then( (response) => {
                if(response.data.result.status != "undefined") {
                    this.currentState = response.data.result.status;
                    this.lockState = response.data.result.lock;
                    if(this.currentState === 'closed') {
                        this.closed = true;
                        this.opened = false;
                    } else if(this.currentState === 'opened') {
                        this.closed = false;
                        this.opened = true;
                    }
                    if(this.lockState === 'locked'){
                        this.locked = true;
                        this.unlocked = false;
                    } else if(this.lockState === 'unlocked'){
                        this.locked = false;
                        this.unlocked = true;
                    }
                    this.waitingForCloseConfirmation = false;
                    this.waitingForOpenConfirmation = false;
                    this.waitingForLockConfirmation = false;
                    this.waitingForUnlockConfirmation = false;
                } 
                else
                    this.throwErrorMessage("Could not get Device state. Try again later.", 0);
            })
            .catch( () => {
                this.throwErrorMessage("Could not get Device state. Try again later.", 0);
            })
        },
        openDoor() {
            this.waitingForOpenConfirmation = true;
            const open = '/open';
            this.axios.put(this.$genericUrl + 'devices/' + this.deviceId + open)
            .then( (response) => {
                if(response.data.result === true) {
                    this.opened = true;
                    this.closed = false;
                    this.currentState = 'opened';
                } else
                    this.throwErrorMessage("Could not open door. Try again later.", 6000);
                this.waitingForOpenConfirmation = false;
            })
            .catch( () => {
                this.throwErrorMessage("Could not open door. Try again later.", 6000);
                this.waitingForOpenConfirmation = false;
            })
        },
        closeDoor() {
            this.waitingForCloseConfirmation = true;
            const close = '/close';
            this.axios.put(this.$genericUrl + 'devices/' + this.deviceId + close)
            .then( (response) => {
                if(response.data.result === true) {
                    this.opened = false;
                    this.closed = true;
                    this.currentState = 'closed';
                } else
                    this.throwErrorMessage("Could not close door. Try again later.", 6000);
                this.waitingForCloseConfirmation = false;
            })
            .catch( () => {
                this.throwErrorMessage("Could not close door. Try again later.", 6000);
                this.waitingForCloseConfirmation = false;
            })
        },
        lockDoor() {
            this.waitingForLockConfirmation = true;
            const close = '/lock';
            this.axios.put(this.$genericUrl + 'devices/' + this.deviceId + close)
            .then( (response) => {
                if(response.data.result === true) {
                    this.locked = true;
                    this.unlocked = false;
                    this.lockState = 'locked';
                } else
                    this.throwErrorMessage("Could not lock door. Try again later.", 6000);
                this.waitingForLockConfirmation = false;
            })
            .catch( () => {
                this.throwErrorMessage("Could not lock door. Try again later.", 6000);
                this.waitingForLockConfirmation = false;
            })
        },
        unlockDoor() {
            this.waitingForUnlockConfirmation = true;
            const close = '/unlock';
            this.axios.put(this.$genericUrl + 'devices/' + this.deviceId + close)
            .then( (response) => {
                if(response.data.result === true) {
                    this.locked = false;
                    this.unlocked = true;
                    this.lockState = 'unlocked';
                } else
                    this.throwErrorMessage("Could not unlock door. Try again later.", 6000);
                this.waitingForUnlockConfirmation = false;
            })
            .catch( () => {
                this.throwErrorMessage("Could not unlock door. Try again later.", 6000);
                this.waitingForUnlockConfirmation = false;
            })
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
        },
        throwErrorMessage(message, duration) {
            this.snackbar = true;
            this.errorText = message;
            this.timeout = duration;
        },
    }
}
</script>

