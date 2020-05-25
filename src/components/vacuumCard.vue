<template>
    <div class="text-xs-center">
        <v-dialog v-model="showCard" width="500">

            <template v-slot:activator="{ on }">
                <v-btn class="pa-0 ma-0" height="250" depressed block color="transparent transparent--text" v-on="on" @click="vacuumManager">Click Me</v-btn>
            </template>

            <v-card>
                <v-container>
                    <v-card-title class="headline blue lighten-4 pa-3" primary-title>
                        <template v-if="!editing">
                            {{deviceName}}
                        </template>
                        <v-text-field v-if="editing" v-model="newName" dense counter maxlength="25" filled/>
                        <v-spacer></v-spacer>

                        <v-btn color="blue lighten-1" small @click="closeVacuumCard">
                            <v-icon>mdi-close</v-icon>
                        </v-btn>
                    </v-card-title>

                    <v-card-actions>
                        <v-container>
                            <v-row align="center" justify="center">
                                    <v-btn 
                                        normal
                                        color="blue lighten-1 white--text" 
                                        class="mr-6"
                                        :disabled="on" 
                                        :loading="waitingForStartConfirmation"
                                        @click="start"
                                    >On</v-btn>
                                    <v-btn 
                                        normal
                                        class="mr-6"
                                        color="blue lighten-1 white--text" 
                                        :disabled="docking"
                                        :loading="waitingForDockConfirmation"
                                        @click="dock"
                                    >CHARGE</v-btn>
                                    <v-btn 
                                        normal
                                        class="mr-6"
                                        color="blue lighten-1 white--text" 
                                        :disabled="off"
                                        :loading="waitingForPauseConfirmation"
                                        @click="pause"
                                    >Off</v-btn>
                            </v-row>

                            <v-row align="center" justify="center" class="mt-5">
                                <p>Current State: {{this.currentState}}</p>
                            </v-row>

                            <v-row align="center" justify="center" >
                                <v-col cols=6 align="center">
                                    <v-select
                                        v-model="currentMode"
                                        :items="modes"
                                        label="Select mode"
                                        dense
                                        @change="setMode"
                                    ></v-select>
                                </v-col>
                            </v-row>

                            <v-row align="center" justify="center" class="mt-9">
                                <p>Current Mode: {{this.currentMode}}</p>
                            </v-row>

                            <v-slider
                                v-model="currentBatteryLevel"
                                thumb-label="always"
                                :thumb-size="18"
                                label="Battery Level"
                                readonly
                                min="0"
                                max="100"
                            ></v-slider>

                            <v-row v-show="on" align="center" justify="center" >
                                <v-col cols=6 align="center">
                                    <v-select
                                        :items="rooms"
                                        item-text="name"
                                        item-value="id"
                                        label="Select room"
                                        dense
                                        @change="setLocation"
                                    ></v-select>
                                </v-col>
                            </v-row>

                            <v-row align="center" justify="center" class="mt-5">
                                <p>Current Location: {{this.currentLocation}}</p>
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
            showCard: false,
            home: "",
            device: "device",

            waitingForStartConfirmation: false,
            waitingForPauseConfirmation: false,
            waitingForDockConfirmation: false,
            waitingForSetLocationConfirmation: false,
            waitingForSetModeConfirmation: false,

            currentState: "",
            currentMode: "",
            currentBatteryLevel: "",
            currentLocation: "",

            editing: false,
            newName: this.deviceName,

            rooms: [],

            on: false,
            off: false,
            docking: false,

            modes: ["vacuum", "mop"],

            readyToUse: false,

            secondsUpdater: 0,


        }
    },
    methods: {
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
        
        closeVacuumCard(){
            this.showCard = false;
            this.editing = false
            clearInterval(this.secondsUpdater)
            if(this.editing === true)
                this.editing = false;
        },
        getCurrentState() {
            const state = '/state';
            this.axios.get('http://127.0.0.1:8081/api/' + 'devices/' + this.deviceId + state)
            .then( (response) => {
                this.currentState = response.data.result.status;
                this.currentMode = response.data.result.mode;
                this.currentBatteryLevel = response.data.result.batteryLevel;
                if(response.data.result.location === null)
                    this.currentLocation="not set yet"
                else
                    this.currentLocation = response.data.result.location.name;
                 if(this.currentBatteryLevel <=5 ){
                    this.readyToUse=false;
                }else{
                    this.readyToUse=true;
                }
                if(this.currentState === 'active'){
                    this.on=true;
                    this.off=false;
                    this.docking=false;
                }else if(this.currentState === 'inactive'){
                    this.on=false;
                    this.off=true;
                    this.docking=false;
                }
                else if(this.currentState === 'docked'){
                    this.on=false;
                    this.off=false;
                    this.docking=true;
                }
            })
        },
        vacuumManager(){
            const state = '/state';
            this.waitingForStartConfirmation= true;
            this.waitingForPauseConfirmation= true;
            this.waitingForDockConfirmation=true;
            this.waitingForSetLocationConfirmation= true;
            this.waitingForSetModeConfirmation= true;
            this.axios.get('http://127.0.0.1:8081/api/' + 'devices/' + this.deviceId)
            .then( (response) => {
                this.home = response.data.result.room.home.id
                this.rooms=this.$roomStore.data.roomsByHome.get(this.home);

                this.axios.get('http://127.0.0.1:8081/api/' + 'devices/' + this.deviceId + state)
                .then( (response) => {
                    this.currentState = response.data.result.status;
                    this.currentMode = response.data.result.mode;
                    this.currentBatteryLevel = response.data.result.batteryLevel;
                    if(response.data.result.location === null)
                        this.currentLocation="not set yet"
                    else
                        this.currentLocation = response.data.result.location.name;
                    if(this.currentBatteryLevel <=5 ){
                        this.readyToUse=false;
                    }else{
                        this.readyToUse=true;
                    }
                    if(this.currentState === 'active'){
                        this.on=true;
                        this.off=false;
                        this.docking=false;
                        this.startRefreshingInterval();
                    }else if(this.currentState === 'inactive'){
                        this.on=false;
                        this.off=true;
                        this.docking=false;
                    }
                    else if(this.currentState === 'docked'){
                        this.on=false;
                        this.off=false;
                        this.docking=true;
                        this.startRefreshingInterval();
                    }
                    this.waitingForStartConfirmation=false;
                    this.waitingForPauseConfirmation=false;
                    this.waitingForDockConfirmation=false;
                    this.waitingForSetLocationConfirmation=false;
                    this.waitingForSetModeConfirmation=false;
                })
                .catch( (response) => {
                    console.log("No se pudo recuperar el estado al abrir el Popup")
                    console.log(response)
                })
            })
            .catch ( () => {
                
            }) 
            
        },
        start() {
            this.waitingForStartConfirmation = true;
            const start = '/start';
            this.axios.put('http://127.0.0.1:8081/api/' + 'devices/' + this.deviceId + start)
            .then( (response) => {
                if(response.data.result === true) {
                    this.startRefreshingInterval();
                }
                else{
                    if(this.currentBatteryLevel<=5){
                        console.log("Bateria insuficiente, poner a cargar");
                    }
                }
                this.waitingForStartConfirmation = false;
            })
            .catch( () => {
                console.log("No se pudo encender");
            })
        },
        pause() {
            this.waitingForPauseConfirmation = true;
            const pause = '/pause';
            this.axios.put('http://127.0.0.1:8081/api/' + 'devices/' + this.deviceId + pause)
            .then( (response) => {
                if(response.data.result === true) {
                    clearInterval(this.secondsUpdater)
                    this.getCurrentState();
                }
                this.waitingForPauseConfirmation = false;
            })
            .catch( () => {
                console.log("No se pudo poner en pausa");
            })
        },
        dock() {
            this.waitingForDockConfirmation = true;
            const dock = '/dock';
            this.axios.put('http://127.0.0.1:8081/api/' + 'devices/' + this.deviceId + dock)
            .then( (response) => {
                if(response.data.result === true) {
                    this.startRefreshingInterval();
                }
                this.waitingForDockConfirmation = false;
            })
            .catch( () => {
                console.log("No se pudo poner a cargar");
            })
        },
        setMode(selectObj) {
            this.waitingForSetModeConfirmation=true;
            console.log("New mode: " + selectObj);
            const action = '/setMode';
            this.axios.put('http://127.0.0.1:8081/api/' + 'devices/' + this.deviceId + action, [selectObj])
            .then( () => {
                this.getCurrentState();
            })
            .catch( () => {
                console.log("No se pudo cambiar el modo");
            })
            this.waitingForSetModeConfirmation=false;
        },
        setLocation(selectObj) {
            this.waitingForSetLocationConfirmation=true;
            console.log("New location: " + selectObj);
            const action = '/setLocation';
            this.axios.put('http://127.0.0.1:8081/api/' + 'devices/' + this.deviceId + action, [selectObj])
            .then( () => {
                this.getCurrentState();
            })
            .catch( () => {
                console.log("No se pudo cambiar la ubicacion del dock");
            })
            this.waitingForSetLocationConfirmation=false;
        },
        startRefreshingInterval() {
            this.secondsUpdater = window.setInterval( () => {
                    this.getCurrentState();
                    if(this.currentBatteryLevel>=4){
                        this.readyToUse=true;
                    }
            }, 1000); 
        }
    }
}
</script>

