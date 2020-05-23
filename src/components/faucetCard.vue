<template>
    <div class="text-xs-center">
        <v-dialog v-model="showCard" width="500">

            <template v-slot:activator="{ on }">
                <v-btn color="red lighten-2"  dark  v-on="on" @click="faucetManager">Click Me</v-btn>
            </template>

            <v-card>
                <v-container>
                    <v-card-title class="headline blue lighten-4 pa-3" primary-title>
                        Grifo de Nacho
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
                                    :label="status"
                                    ></v-switch>
                                    <v-switch
                                    v-else
                                    inset
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
                                    v-show="!switchState"
                                >Set Dispense</v-btn>
                                <v-btn v-else loading color="blue lighten-1 white--text"></v-btn>
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
            status: "opened",
            switchState: true,
            
            quantity: 0,
            unit: "",
            dispensedQuantity: 0,  // [0 to 100]

            units: ["ml", "cl", "dl", "l", "dal", "hl", "kl"],
            quantityToDispense: 0,
            unitToDispense: "",
            waitingForResponse: false,
            waitingDispensing: false,
            secondsUpdater: 0
        }
    },
    methods: {
        closeFaucetCard() {
            this.showCard = false;
            clearInterval(this.secondsUpdater);
        },
        turnOnOffFaucet() {            
            if(this.switchState === false) {
                this.waitingForResponse = true;
                this.close();
            } else {
                this.waitingForResponse = true;
                this.open();
            }
        },
        faucetManager() {            
            const state = '/state';
            this.axios.get('http://127.0.0.1:8081/api/' + 'devices/' + 'ae30d6dea5a2a045' + state)
            .then( (response) => {
                this.status = response.data.result.status;
                if(this.status === 'closed')
                    this.switchState = false;
                else {
                    this.switchState = true;
                    if(typeof response.data.result.quantity != "undefined") {
                        this.getDispensedData(response.data.result);
                        this.getDispensedQuantity();
                    } else {
                        this.quantity = "NO LIMIT";
                        this.unit = "";
                        this.dispensedQuantity = 0;
                    }
                }
            })
            .catch( () => {
                console.log("No se pudo obtener el estado del faucet");
            })
        },
        open() {
            const open = '/open';
            this.axios.put('http://127.0.0.1:8081/api/' + 'devices/' + 'ae30d6dea5a2a045' + open)
            .then( () => {
                this.switchState = true;
                this.status = 'opened';
                this.axios.get('http://127.0.0.1:8081/api/' + 'devices/' + 'ae30d6dea5a2a045' + '/state')
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
                    console.log("No se pudo obtener el estado del faucet");
                })           
            })
            .catch( () => {
                console.log("No se pudo abrir el faucet");
            })
        },
        close() {
            const close = '/close';
            this.axios.put('http://127.0.0.1:8081/api/' + 'devices/' + 'ae30d6dea5a2a045' + close)
            .then( () => {
                this.switchState = false;                
                this.status = 'closed';
                this.waitingForResponse = false;
            })
            .catch( () => {
                console.log("No se pudo cerrar el faucet");
            })
        },
        getDispensedData(result) {            
            this.quantity = result.quantity;
            this.unit = result.unit;
            this.dispensedQuantity = Math.floor((result.dispensedQuantity * 100) / this.quantity);
        },
        setUnitToDispense(selectObj) {
            this.unitToDispense = selectObj;
        },
        setDispenseQuantity(selectObj) {
            this.quantityToDispense = selectObj;
        },
        getDispensedQuantity: function() {
            this.secondsUpdater = window.setInterval( () => {
                this.axios.get('http://127.0.0.1:8081/api/' + 'devices/' + 'ae30d6dea5a2a045' + '/state')
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
            }, 3000); 
        },
        startDispense() {
            const action = '/dispense';
            this.waitingDispensing = true;
            this.axios.put('http://127.0.0.1:8081/api/' + 'devices/' + 'ae30d6dea5a2a045' + action, 
                [this.quantityToDispense, this.unitToDispense.toString()] )
            .then( (response) => {
                if(response.data.result === true) {
                    this.switchState = true;
                    this.status = 'opened';
                    this.getDispensedQuantity();
                    this.quantity = this.quantityToDispense;
                    this.unit = this.unitToDispense;
                    this.dispensedQuantity = 0;
                    this.waitingDispensing = false;
                }
            })
            .catch( () => {
                console.log("No se logro setear el volumen a dispensar");
            })
        }
    }
}
</script>