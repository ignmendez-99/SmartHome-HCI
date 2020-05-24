<template>
    <div class="text-xs-center">
        <v-dialog v-model="showCard" width="500">

            <template v-slot:activator="{ on }">
                <v-btn color="red lighten-2"  dark  v-on="on" @click="refrigeratorManager">Click Me</v-btn>
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
                                    <v-btn v-show="!settingFreezerTemp" @click="settingFreezerTemp=true" small>Set</v-btn> 
                                    <v-slider
                                        v-model="freezerTemperature"
                                        v-show="settingFreezerTemp"
                                        value="freezerTemperature"
                                        thumb-label
                                        label="Temp Freezer" 
                                        min="-20"
                                        max="-8"
                                        @change="setFreezerTemperature"
                                    ></v-slider>
                            </v-row>

                            <v-row align="center" justify="center">
                                <v-btn v-show="settingFreezerTemp" @click="settingFreezerTemp=false" small>Done</v-btn>
                            </v-row>

                            <v-row align="center" justify="center" class="mt-7">
                                <p>Current Fridge Temperature: {{this.fridgeTemperature}}</p>
                            </v-row>
                             <v-row align="center" justify="center" >
                                    <v-btn v-show="!settingFridgeTemp" @click="settingFridgeTemp=true" small>Set</v-btn> 
                                    <v-slider
                                        v-model="fridgeTemperature"
                                        v-show="settingFridgeTemp"
                                        thumb-label
                                        label="Temp Heladera"
                                        min="2"
                                        max="8"
                                        @change="setTemperature"
                                    ></v-slider>
                            </v-row>
                            <v-row align="center" justify="center">
                                <v-btn v-show="settingFridgeTemp" @click="settingFridgeTemp=false" small>Done</v-btn>
                            </v-row>
                            <v-row align="center" justify="center" class="mt-7">
                                <p>Current Mode: {{this.mode}}</p>
                            </v-row>
                             <v-row align="center" justify="center" >
                                <v-col cols=6 align="center">
                                    <v-btn v-show="!settingMode" small @click="settingMode=true">Set</v-btn> 
                                    <v-select
                                        :items="modes"
                                        v-show="settingMode"
                                        label="Seleccionar Modo"
                                        dense
                                        @change="setMode"
                                    ></v-select>
                                </v-col>
                            </v-row>

                            <v-container></v-container>

                            <v-row align="center" justify="center">
                                <v-btn small>Delete</v-btn>
                                <v-btn small @click="editPressed">{{buttonText}}</v-btn>
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
        
            modes: ["default", "vacation", "party"],

            deviceName: "Heladera de franco",
            newDeviceName: "",

            slider: "",
            
            waitingForSetFreezerTempConfirmation: false,
            waitingForSetTempConfirmation: false,
            waitingForSetModeConfirmation: false,

            freezerTemperature: "",
            fridgeTemperature: "",
            mode: "",

            settingFreezerTemp: false,
            settingFridgeTemp: false,
            settingMode: false,

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
        
        closeRefrigeratorCard(){
            this.showCard = false;
            if(this.editing === true)
                this.editing = false;
        },
        getCurrentState() {
            const state = '/state';
            this.axios.get('http://127.0.0.1:8081/api/' + 'devices/' + 'ecfabc2a5eb42aeb' + state)
            .then( (response) => {
                this.freezerTemperature = response.data.result.freezerTemperature;
                this.fridgeTemperature = response.data.result.temperature;
                this.mode = response.data.result.mode;
            })
        },
        refrigeratorManager(){
            const state = '/state';
            this.waitingForSetFreezerTempConfirmation = true;
            this.waitingForSetTempConfirmation = true;
            this.waitingForSetModeConfirmation = true;
            this.axios.get('http://127.0.0.1:8081/api/' + 'devices/' + 'ecfabc2a5eb42aeb' + state)
            .then( (response) => {
                this.freezerTemperature = response.data.result.freezerTemperature;
                this.fridgeTemperature = response.data.result.temperature;
                this.mode = response.data.result.mode;
        //         if(this.currentState === 'closed') {
        //             this.closed = true;
        //             this.opened = false;
        //         } else if(this.currentState === 'opened') {
        //             this.closed = false;
        //             this.opened = true;
        //         }
        //         if(this.lockState === 'locked'){
        //             this.locked = true;
        //             this.unlocked = false;
        //         } else if(this.lockState === 'unlocked'){
        //             this.locked = false;
        //             this.unlocked = true;
            this.waitingForSetFreezerTempConfirmation = false;
            this.waitingForSetTempConfirmation = false;
            this.waitingForSetModeConfirmation = false;
            })
            .catch( () => {
                console.log("No se pudo recuperar el estado al abrir el Popup")
            })
        },
        // setFreezerTemperature(newFreezerTemperature) {
        
        // },
        setFreezerTemperature(selectObj) {
            this.waitingForSetFreezerTempConfirmation=true;
            console.log(selectObj);
            const action = '/setFreezerTemperature';
            this.axios.put('http://127.0.0.1:8081/api/' + 'devices/' + 'ecfabc2a5eb42aeb' + action, [selectObj])
            .then( () => {
                this.getCurrentState();
            })
            .catch( () => {
                console.log("No se pudo cambiar la temperatura del freezer");
            })
            this.waitingForSetFreezerTempConfirmation=false;
        },
        setTemperature(selectObj) {
            this.waitingForSetTempConfirmation=true;
            console.log(selectObj);
            const action = '/setTemperature';
            this.axios.put('http://127.0.0.1:8081/api/' + 'devices/' + 'ecfabc2a5eb42aeb' + action, [selectObj])
            .then( () => {
                this.getCurrentState();
            })
            .catch( () => {
                console.log("No se pudo cambiar la temperatura");
            })
            this.waitingForSetTempConfirmation=false;
        },
        setMode(selectObj) {
            this.waitingForSetModeConfirmation=true;
            console.log(selectObj);
            const action = '/setMode';
            this.axios.put('http://127.0.0.1:8081/api/' + 'devices/' + 'ecfabc2a5eb42aeb' + action, [selectObj])
            .then( () => {
                this.getCurrentState();
            })
            .catch( () => {
                console.log("No se pudo cambiar el modo");
            })
            this.settingMode=false;
            this.waitingForSetModeConfirmation=false;
        }
    }
}
</script>

