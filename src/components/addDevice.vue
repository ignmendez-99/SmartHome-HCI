<template>
    <div class="text-xs-center">
        <v-dialog v-model="addDevice" width="500">

            <template v-slot:activator="{ on }">
                <v-btn small v-on="on">ADD NEW DEVICE</v-btn>
            </template>

            <v-card>
                <v-container>
                    <v-card-title class="headline blue lighten-4 pa-3" primary-title>
                        Add new device
                        <v-spacer></v-spacer>
                        <v-btn small @click="closeCard">
                            <v-icon>mdi-close</v-icon>
                        </v-btn>
                    </v-card-title>

                    <v-select
                        class="mt-12 mx-6"
                        :items="items"
                        item-text="name"
                        item-value="id"
                        return-object
                        label="Devices found ready to connect"
                        v-on:change="selectedDevice"
                    ></v-select>

                    <v-text-field 
                        class="my-8 mx-6"
                        v-model="deviceName"
                        label="Name of the new device"
                        :rules="[rules.required, rules.counter]"
                        counter
                        maxlength="25"/>

                    <v-row justify="center">
                        <v-btn class="mb-6" @click="$deviceStore.data.createDevice(deviceName, deviceId, roomId); closeCard()">ADD</v-btn>
                    </v-row>
                </v-container>
            </v-card>

        </v-dialog>
    </div>
</template>

<script>
export default {
    props: {
        roomId: String
    },
    data() {
        return {
            addDevice: false,
            deviceId: "",
            deviceName: "",
            items: [
                    {name:'JBL Speaker', id:'c89b94e8581855bc'}, 
                    {name:'Nava\'s Faucet', id:'dbrlsh7o5sn8ur4i'}, 
                    {name:'Soft blinds', id:'eu0v2xgprrhhg41g'}, 
                    {name:'Philips HUE lights', id:'go46xmbqeomjrsjr'}, 
                    {name:'Pentagono door', id:'lsf78ly0eqrjbz91'}, 
                    {name:'GE Vacuum 5000', id:'ofglvd9gqx8yfl3l'}, 
                    {name:'LG Fridge 7 million', id:'rnizejqr2di0okho'}
                    ],
            rules: {
                    required: value => !!value || 'Required.',
                    counter: value => value.length <= 25 || 'Max 25 characters'
                }
        }
    },
    methods: {
        closeCard() {
            this.addDevice = false;
        },
        selectedDevice(selectedDevice) {
            this.deviceId = selectedDevice.id;
            this.deviceName = selectedDevice.name;
        },
    }
}
</script>