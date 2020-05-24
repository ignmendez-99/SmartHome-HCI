<template>
    <div class="text-xs-center">
        <v-dialog v-model="showCard" width="500">

            <template v-slot:activator="{ on }">
                <v-btn color="red lighten-2"  dark  v-on="on" @click="doorManager">Click Me</v-btn>
            </template>

            <v-card>
                <v-container>
                    <v-card-title class="headline blue lighten-4 pa-3" primary-title>
                        <div v-if="editing">
                            <v-text-field
                                v-model="newDeviceName"
                                maxlength="30"
                            ></v-text-field>
                        </div>
                        <div v-else>{{deviceName}}</div>
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

                            <v-row align="center" justify="center">
                                <v-btn class="mr-6" small color="red" v-show="editing">Delete</v-btn>
                                <v-btn class="mr-6" small @click="editPressed">{{buttonText}}</v-btn>
                            </v-row>
                        
                        </v-container>
                    </v-card-actions>

                </v-container>
            </v-card>
        </v-dialog>
    </div>
</template>


<script>
export default {
    data() {
        return {
            showCard: false,
        
            deviceName: "Puerta de franco",
            newDeviceName: "",

            currentState: "",
            lockState: "",
            
            closed: true,
            opened: false,

            locked: false,
            unlocked: true,

            waitingForCloseConfirmation: false,
            waitingForOpenConfirmation: false,
            waitingForLockConfirmation: false,
            waitingForUnlockConfirmation: false,

            editing: false,
            buttonText:"Edit",
        }
    },
    methods: {
        editPressed() {
            this.editing = !this.editing
            if(this.buttonText === "Edit"){
                this.buttonText = "Done"
            }else{
                if(this.deviceName != this.newDeviceName){
                    if(this.newDeviceName != ""){
                        this.deviceName=this.newDeviceName
                    }
                }
                this.buttonText = "Edit"
            }
        },
        
        closeDoorCard(){
            this.showCard = false;
            if(this.editing === true)
                this.editing = false;
        },
    
        doorManager(){
            const state = '/state';
            this.waitingForCloseConfirmation = true;
            this.waitingForOpenConfirmation = true;
            this.waitingForLockConfirmation = true;
            this.waitingForUnlockConfirmation = true;
            this.axios.get('http://127.0.0.1:8081/api/' + 'devices/' + '7b1ff49750e318b9' + state)
            .then( (response) => {
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
            })
            .catch( () => {
                console.log("No se pudo recuperar el estado al abrir el Popup")
            })
        },
        // getCurrentState() {
            // const state = '/state';
            // this.axios.get('http://127.0.0.1:8081/api/' + 'devices/' + '7b1ff49750e318b9' + state)
            // .then( (response) => {
            //     this.levelOfObscurity = response.data.result.level;
            //     this.currentLevel = response.data.result.currentLevel;
            //     this.currentState = response.data.result.status;
            //     if(this.currentState === 'closed') {
            //         this.closing = true;
            //         this.fullyOpenedOrClosed = true;
            //         this.opening = false;
            //     } else if(this.currentState === 'opened') {
            //         this.closing = false;
            //         this.fullyOpenedOrClosed = true;
            //         this.opening = true;
            //     }
            //     this.waitingForSetLevelConfirmation = false;
            //     this.readyToChangeObscurityLevel = false;
            // })
        // },
        openDoor() {
            this.waitingForOpenConfirmation = true;
            const open = '/open';
            this.axios.put('http://127.0.0.1:8081/api/' + 'devices/' + '7b1ff49750e318b9' + open)
            .then( (response) => {
                if(response.data.result === true) {
                    this.opened = true;
                    this.closed = false;
                    this.currentState = 'opened';

                    this.waitingForOpenConfirmation = false;
                }
            })
            .catch( () => {
                console.log("No se pudo abrir la puerta");
            })
        },
        closeDoor() {
            this.waitingForCloseConfirmation = true;
            const close = '/close';
            this.axios.put('http://127.0.0.1:8081/api/' + 'devices/' + '7b1ff49750e318b9' + close)
            .then( (response) => {
                if(response.data.result === true) {
                    this.opened = false;
                    this.closed = true;
                    this.currentState = 'closed';

                    this.waitingForCloseConfirmation = false;
                }
            })
            .catch( () => {
                console.log("No se pudo cerrar la puerta");
            })
        },
        lockDoor() {
            this.waitingForLockConfirmation = true;
            const close = '/lock';
            this.axios.put('http://127.0.0.1:8081/api/' + 'devices/' + '7b1ff49750e318b9' + close)
            .then( (response) => {
                if(response.data.result === true) {
                    this.locked = true;
                    this.unlocked = false;
                    this.lockState = 'locked';

                    this.waitingForLockConfirmation = false;
                }
            })
            .catch( () => {
                console.log("No se pudo trabar la puerta");
            })
        },
        unlockDoor() {
            this.waitingForUnlockConfirmation = true;
            const close = '/unlock';
            this.axios.put('http://127.0.0.1:8081/api/' + 'devices/' + '7b1ff49750e318b9' + close)
            .then( (response) => {
                if(response.data.result === true) {
                    this.locked = false;
                    this.unlocked = true;
                    this.lockState = 'unlocked';

                    this.waitingForUnlockConfirmation = false;
                }
            })
            .catch( () => {
                console.log("No se pudo destrabar la puerta");
            })
        }
    }
}
</script>

