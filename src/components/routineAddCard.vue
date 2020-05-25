<template>
    <div>
        <v-dialog v-model="showCard" width="800">

            <template v-slot:activator="{ on }">
                <v-btn small v-on="on">ADD ROUTINE</v-btn>
            </template>
        
            <v-card min-height="600">
                <v-card-title class="headline blue lighten-4 pa-3" primary-title>
                    Add New Routine
                    <v-spacer></v-spacer>
                    <v-btn color="blue lighten-1" small @click="showCard = false">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-card-title>

                <v-card-actions>
                    <v-container>
                        
                        <actionToAdd v-for="action in actionsToAdd" :key="action" :deviceName="action.name" :actionName="action.action"/>                    
                        

                        <v-row justify="center">
                            <v-col cols="5">
                                <v-text-field placeholder="Name of the new routine" counter maxlength="25" v-model="routineName"/>   
                            </v-col>
                        </v-row>
                
                        <v-row justify="center" class="mt-8">
                            <v-btn @click="cancel = false">CANCEL</v-btn>
                            <v-btn @click="showAddAction = true" color="blue lighten-1 white--text" class="mx-4">ADD ACTION</v-btn>
                            <v-btn @click="finish" color="blue lighten-1 white--text" :disabled="actionsToAdd.length === 0 || routineName.length === 0">DONE</v-btn>
                        </v-row>
                        
                    </v-container>
                </v-card-actions>

            </v-card>

        </v-dialog>
        
        <v-dialog v-model="showAddAction" width="400">
            <v-card min-height="300">
                <v-card-title class="headline blue lighten-4 pa-3" primary-title>
                    Select device and action
                    <v-spacer></v-spacer>
                    <v-btn color="blue lighten-1" small @click="showAddAction = false">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-card-title>

                <v-card-actions>
                    <v-container>
                        
                        <v-row justify="center">
                            <v-col cols="8">
                                <v-select
                                    :items="$deviceStore.data.devices"
                                    item-text="name"
                                    item-value="id"
                                    @change="updateId"
                                ></v-select>
                            </v-col>
                        </v-row>

                        <v-row justify="center">
                            <v-col cols="8">
                                <v-select
                                    :items="$actionStore.data.actionsByDeviceType.get(this.deviceTypeIdSelected)"
                                    :disabled="secondSelectDisabled"
                                    @change="actionSelected"
                                ></v-select>
                            </v-col>
                        </v-row>

                        <v-row justify="center">
                            <v-btn @click="addActionPressed" :disabled="buttonDisabled" color="blue lighten-1 white--text">ADD</v-btn>
                        </v-row>
                        
                    </v-container>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import actionToAdd from '../components/actionToAdd.vue'
import eventBus from '../eventBus'

export default {
    components: {
        'actionToAdd' : actionToAdd
    },
    data() {
        return {
            deviceIdSelected: "",
            deviceTypeIdSelected: "",
            deviceActionSelected: "",
            deviceNameSelected: "",
            
            routineName: "",

            secondSelectDisabled: true,
            buttonDisabled: true,
            showCard: false,
            showAddAction: false,

            actionsToAdd: []
        }
    },
    methods: {
        updateId(id) {
            this.deviceIdSelected = id
            this.axios.get(this.$genericUrl + "devices/" + id)
            .then( (response) => {
                this.deviceTypeIdSelected = response.data.result.type.id
                this.deviceNameSelected = response.data.result.name
                this.secondSelectDisabled = false
            })
            .catch ( () => {
                console.log("ERROR AL OBTENER EL TIPO DE DISPOSITIVO")
            })
        },
        actionSelected(action) {
            this.buttonDisabled = false
            this.deviceActionSelected = action
        },
        addActionPressed() {
            console.log("ID DEL DISPOSITIVO: " + this.deviceIdSelected)
            console.log("ID DEL TIPO DEL DISPOSITIVO: " + this.deviceTypeIdSelected)
            console.log("ACCION: " + this.deviceActionSelected)
            this.actionsToAdd.push({
                name: this.deviceNameSelected,
                id: this.deviceIdSelected,
                action: this.deviceActionSelected
            })
            console.log(this.actionsToAdd)
            this.showAddAction = false
        },
        cancel() {
            this.actionToAdd = []
            this.showCard = false
        },
        finish() {
            var actionsFinal = {
                "name": this.routineName,
                "actions": []
            }

            for (var i = 0; i < this.actionsToAdd.length; i++) {
                actionsFinal.actions.push({
                    "device": {
                        "id": this.actionsToAdd[i].id
                    },
                    "actionName": this.actionsToAdd[i].action,
                    "params": [],
                    "meta": {}
                })
            }
            
            this.axios.post(this.$genericUrl + "routines", actionsFinal)
            .then ( () => {
                console.log("RUTINA CREADA CON EXITO")
            })
            .catch ( () => {
                console.log("ERROR AL CREAR LA RUTINA")
            })
            eventBus.$emit("routineAdded", "ROUTINE ADDED")
            this.showCard = false


            
        }  
    }
}
</script>