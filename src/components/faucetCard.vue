<template>
    <div class="text-xs-center">
        <v-dialog v-model="showCard" width="500">

            <template v-slot:activator="{ on }">
                <v-btn class="pa-0 ma-0" height="250" depressed block color="transparent transparent--text"  v-on="on" @click="faucetManager">Click Me</v-btn>
            </template>

            <v-card>
                <v-container>
                    <v-card-title class="headline blue lighten-4 pa-3" primary-title>
                        <template v-if="!editing">
                            {{deviceName}}
                        </template>
                        <v-text-field v-if="editing" v-model="newName" dense counter maxlength="25" filled/>
                        <v-spacer></v-spacer>
                        <v-btn color="blue lighten-1" small @click="closeFaucetCard">
                            <v-icon>mdi-close</v-icon>
                        </v-btn>
                    </v-card-title>

                    <v-card-actions>
                        <v-container>
                            <v-row align="center" justify="center" class="mb-12 pb-12">
                                <v-col cols="5">
                                    <v-switch
                                    loading="warning"
                                    v-if="waitingForResponse"
                                    inset
                                    v-model="switchState"
                                    :disabled="waitingForResponse || waitingDispensing"
                                    :label="status"
                                    ></v-switch>
                                    <v-switch
                                    v-else
                                    inset
                                    :disabled="waitingForResponse || waitingDispensing"
                                    v-model="switchState"
                                    :label="status"
                                    @change="turnOnOffFaucet"
                                    ></v-switch>
                                </v-col>
                                <v-col>
                                    <v-container>
                                        <v-row align="center">
                                            <p v-if="switchState">Quantity to dispense: {{this.quantity}} {{this.unit}}</p>
                                            <p v-else>Faucet Closed</p>
                                        </v-row>
                                        <v-row align="center">
                                            <p v-if="switchState">Percentage: {{this.dispensedQuantity}}%</p>
                                            <p v-else>Faucet Closed</p>
                                        </v-row>
                                    </v-container>
                                </v-col>
                            </v-row>
                            <v-row v-show="switchState" class="py-12"></v-row>

                            <v-row>
                                <v-col>
                                    <v-text-field
                                    v-show="!switchState"
                                    @change="setDispenseQuantity" 
                                    counter
                                    maxlength="3"
                                    label="Dispense Quantity"
                                    hint="Number between 1 and 100"
                                    persistent-hint
                                    >
                                    </v-text-field>
                                </v-col>
                                <v-col>
                                    <v-select
                                    :items="units"
                                    v-show="!switchState"
                                    label="Unit to Dispense"
                                    @change="setUnitToDispense"
                                    ></v-select>
                                </v-col>
                            </v-row>

                            <v-row align="center" justify="center">
                                <v-btn 
                                    v-if="!waitingDispensing"
                                    @click="startDispense" 
                                    color="blue lighten-1 white--text" 
                                    :disabled="!readyToDispense"
                                    v-show="!switchState"
                                >Set Dispense</v-btn>
                                <v-btn v-else loading color="blue lighten-1 white--text" :disabled="waitingForResponse"></v-btn>
                            </v-row>

                            <v-row justify="center" class="mt-8">
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
                        <v-btn flat @click.native="snackbar = false">Close</v-btn>
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
            status: "Please wait...",
            switchState: true,

            timeout: 6000,    /////
            errorText: "",    // ERROR HANDLING
            snackbar: false,  /////

            editing: false,
            newName: this.deviceName,
            
            quantity: 0,
            unit: "",
            dispensedQuantity: 0,  // [0 to 100]

            units: ["ml", "cl", "dl", "l", "dal", "hl", "kl"],
            quantityToDispense: 0,
            unitToDispense: "",
            readyToDispense: false,

            waitingForResponse: false,
            waitingDispensing: false,
            secondsUpdater: 0
        }
    },
    methods: {
        closeFaucetCard() {
            this.showCard = false;
            this.editing = false
            clearInterval(this.secondsUpdater);
        },
        turnOnOffFaucet() {     
            this.waitingForResponse = true;       
            if(this.switchState === false)
                this.close();
            else
                this.open();
        },
        faucetManager() {            
            const state = '/state';
            this.waitingDispensing = true;
            this.waitingForResponse = true;
            this.axios.get(this.$genericUrl + 'devices/' + this.deviceId + state)
            .then( (response) => {
                if(response.data.result.status != "undefined") {
                    this.status = response.data.result.status;
                    if(this.status === 'closed') {
                        this.switchState = false;
                        this.waitingDispensing = false;
                        this.waitingForResponse = false;
                    }
                    else if(this.status === 'opened'){
                        this.switchState = true;
                        if(typeof response.data.result.quantity != "undefined") {
                            this.getDispensedData(response.data.result);
                            this.startDispenseInterval();
                        } else {
                            this.quantity = "NO LIMIT";
                            this.unit = "";
                            this.dispensedQuantity = 0;
                        }
                        this.waitingDispensing = false;
                        this.waitingForResponse = false;
                    } else
                        this.throwErrorMessage("Could not load Device state. Try again later.", 0); 
                } else
                    this.throwErrorMessage("Could not load Device state. Try again later.", 0); 
            })
            .catch( () => {
                this.throwErrorMessage("Could not load Device state. Try again later.", 0);
            })
        },
        open() {
            const open = '/open';
            this.axios.put(this.$genericUrl + 'devices/' + this.deviceId + open)
            .then( () => {
                this.switchState = true;
                this.status = 'opened';
                this.axios.get(this.$genericUrl + 'devices/' + this.deviceId + '/state')
                .then( (response) => {
                    if(typeof response.data.result.quantity != "undefined") {
                        this.getDispensedData(response.data.result);
                    } else {
                        // in this case, the faucet is open indefinetely
                        this.quantity = "NO LIMIT";
                        this.unit = ""
                        this.dispensedQuantity = 0;
                    }
                    this.waitingForResponse = false;
                })
                .catch( () => {
                    this.throwErrorMessage("Could not load Device state. Try again later.", 0);
                    this.waitingForResponse = false;
                })           
            })
            .catch( () => {
                this.throwErrorMessage("Could not open the Faucet. Try again later.", 6000);
                this.waitingForResponse = false;
            })
        },
        close() {
            const close = '/close';
            this.axios.put(this.$genericUrl + 'devices/' + this.deviceId + close)
            .then( () => {
                this.switchState = false;                
                this.status = 'closed';
                this.waitingForResponse = false;
            })
            .catch( () => {
                this.throwErrorMessage("Could not open the Faucet. Try again later.", 6000);
                this.waitingForResponse = false;
            })
        },
        getDispensedData(result) {            
            this.quantity = result.quantity;
            this.unit = result.unit;
            this.dispensedQuantity = Math.floor((result.dispensedQuantity * 100) / this.quantity);
        },
        setUnitToDispense(selectObj) {
            this.unitToDispense = selectObj;
            if(this.unitToDispense != "" && this.quantityToDispense != 0)
                this.readyToDispense = true;
        },
        setDispenseQuantity(selectObj) {
            this.quantityToDispense = selectObj;
            if(this.unitToDispense != "" && this.quantityToDispense != 0)
                this.readyToDispense = true;
        },
        startDispenseInterval: function() {
            this.secondsUpdater = window.setInterval( () => {
                this.axios.get(this.$genericUrl + 'devices/' + this.deviceId + '/state')
                .then( (response) => {
                    if(typeof response.data.result.dispensedQuantity != "undefined")
                        this.dispensedQuantity = Math.floor((response.data.result.dispensedQuantity * 100) / this.quantity);
                    else {
                        this.switchState = false;                
                        this.status = 'closed';
                        this.waitingForResponse = false;
                        clearInterval(this.secondsUpdater);
                    }
                })
                .catch( () => {
                    this.throwErrorMessage("Could not get device status. Try again later.", 0);
                    this.switchState = false;
                    this.waitingForResponse = false;
                    this.waitingForResponse = true;
                    this.waitingDispensing = true;
                    clearInterval(this.secondsUpdater);
                })
            }, 3000); 
        },
        startDispense() {
            const action = '/dispense';
            this.waitingDispensing = true;
            this.axios.put(this.$genericUrl + 'devices/' + this.deviceId + action, 
                [this.quantityToDispense, this.unitToDispense.toString()] )
            .then( (response) => {
                if(response.data.result === true) {
                    this.switchState = true;
                    this.status = 'opened';
                    this.startDispenseInterval();
                    this.quantity = this.quantityToDispense;
                    this.unit = this.unitToDispense;
                    this.dispensedQuantity = 0;
                } else {
                    this.throwErrorMessage("Could not dispense. Try again later.", 6000);
                }
                this.waitingDispensing = false;
            })
            .catch( () => {
                this.throwErrorMessage("Could not dispense. Try again later.", 6000);
                this.waitingDispensing = false;
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