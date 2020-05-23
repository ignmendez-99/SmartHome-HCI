<template>
    <div class="text-xs-center">
        <v-dialog v-model="showCard" width="500">

            <template v-slot:activator="{ on }">
                <v-btn color="red lighten-2"  dark  v-on="on" @click="blindsManager">Click Me</v-btn>
            </template>

            <v-card>
                <v-container>
                    <v-card-title class="headline blue lighten-4 pa-3" primary-title>
                        Cortina de Nacho
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
                                <p>Current State: {{this.currentState}}</p>
                            </v-row>
                            <v-row align="center" justify="center">
                                <p>Level of obscurity set: {{this.levelOfObscurity}}</p>
                            </v-row>
                            <v-row align="center" justify="center">
                                <p>Current level: {{this.currentLevel}}</p>
                            </v-row>
                            <v-row align="center" justify="center">
                                <v-text-field
                                    v-show="fullyOpenedOrClosed"
                                    @change="setObscurityLevelToChange" 
                                    counter
                                    maxlength="3"
                                    label="Obscurity Level"
                                    hint="Number between 1 and 100"
                                    persistent-hint
                                ></v-text-field>
                                <v-btn
                                    color="blue lighten-1 white--text"
                                    v-show="fullyOpenedOrClosed"
                                    :disabled="!readyToChangeObscurityLevel"
                                    :loading="waitingForSetLevelConfirmation"
                                    @click="changeObscurityLevel"
                                >Change Obscurity Level</v-btn>
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
            levelOfObscurity: 0,  // [0-100]
            currentLevel: 0,  // [0-100]
            currentState: "",

            obscurityLevelToChange: 0,
            readyToChangeObscurityLevel: true,

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
            this.showCard = false;
            clearInterval(this.secondsUpdater);
        },
    
        blindsManager() {
            const state = '/state';
            this.waitingForCloseConfirmation = true;
            this.waitingForOpenConfirmation = true;
            this.waitingForSetLevelConfirmation = true; 
            this.axios.get('http://127.0.0.1:8081/api/' + 'devices/' + '809a7de0ee0a2a6b' + state)
            .then( (response) => {
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
                this.readyToChangeObscurityLevel = false;
            })
            .catch( () => {
                console.log("No se pudo recuperar el estado al abrir el Popup")
            })
        },
        startIntervalTimer() {
            this.fullyOpenedOrClosed = false;
            this.secondsUpdater = window.setInterval( () => {
                this.axios.get('http://127.0.0.1:8081/api/' + 'devices/' + '809a7de0ee0a2a6b' + '/state')
                .then( (response) => {
                    this.levelOfObscurity = response.data.result.level;
                    this.currentLevel = response.data.result.currentLevel;
                    this.currentState = response.data.result.status;

                    if(this.currentState === 'opening')
                        this.opening = true;
                    else if(this.currentState === 'closing')
                        this.closing = true;
                    
                    if(this.currentState === 'closed' || this.currentState === 'opened') {
                        clearInterval(this.secondsUpdater);
                        this.fullyOpenedOrClosed = true;
                        this.getCurrentState();
                        this.secondsUpdater = 0;
                    }
                })
                .catch( () => {
                    console.log("No se pudo recuperar el estado al abrir el Popup")
                })
            }, 4000);
        },
        getCurrentState() {
            const state = '/state';
            this.axios.get('http://127.0.0.1:8081/api/' + 'devices/' + '809a7de0ee0a2a6b' + state)
            .then( (response) => {
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
                this.readyToChangeObscurityLevel = false;
            })
        },
        openBlinds() {
            this.waitingForOpenConfirmation = true;
            const open = '/open';
            this.axios.put('http://127.0.0.1:8081/api/' + 'devices/' + '809a7de0ee0a2a6b' + open)
            .then( (response) => {
                if(response.data.result === true) {
                    this.opening = true;
                    this.closing = false;
                    this.currentState = 'opening';

                    if(this.secondsUpdater != 0)
                        clearInterval(this.secondsUpdater);
                    this.startIntervalTimer();

                    this.waitingForOpenConfirmation = false;
                }
            })
            .catch( () => {
                console.log("No se pudo abrir las blinds");
            })
        },
        closeBlinds() {
            this.waitingForCloseConfirmation = true;
            const close = '/close';
            this.axios.put('http://127.0.0.1:8081/api/' + 'devices/' + '809a7de0ee0a2a6b' + close)
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

                    this.waitingForCloseConfirmation = false;
                }
            })
            .catch( () => {
                console.log("No se pudo cerrar las blinds");
            })
        },
        setObscurityLevelToChange(selectObj) {
            this.obscurityLevelToChange = selectObj;
            this.readyToChangeObscurityLevel = true;
        },
        changeObscurityLevel() {
            if( (this.currentState === 'closing' && this.obscurityLevelToChange <= this.currentLevel) ||
                 (this.currentState === 'opening' && this.obscurityLevelToChange >= this.currentLevel) ) 
            {
                console.log("No se puede cambiar el nivel de obscuridad de esa manera!!!")
            } else {
                this.waitingForSetLevelConfirmation = true;
                const setLevel = '/setLevel';
                this.axios.put('http://127.0.0.1:8081/api/' + 'devices/' + '809a7de0ee0a2a6b' + setLevel, [this.obscurityLevelToChange])
                .then( (response) => {
                    if(response.data.result === this.levelOfObscurity.toString())
                        this.getCurrentState();
                    //this.waitingForSetLevelConfirmation = false;
                })
                .catch( () => {
                    console.log("No se pudo cambiar el nivel de obscurity");
                })
            }
        }
    }
}
</script>