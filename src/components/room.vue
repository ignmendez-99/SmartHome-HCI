<template>
    <v-row class="mx-4">
        <p id="npnm" class="subtitle-1">{{roomName}}</p>
        <v-spacer></v-spacer>
        <v-btn small @click="editPressed" v-show="expand">{{editingText}}</v-btn>
        <v-btn small @click="expandPressed">
            <v-icon>{{arrow}}</v-icon>
        </v-btn>
        <v-col cols="12">
            <v-divider></v-divider>
        </v-col>
        <v-col cols="12" class="shrink">
            <v-expand-transition>
                <v-row v-show="expand" class="mx-4" align="center">
                    <device v-for="device in $deviceStore.data.devicesByRoom.get(roomId)" :key="device" :deviceName="device[nameString]"/>
                    <addDevice :roomId="roomId"/>
                </v-row>
            </v-expand-transition>
        </v-col>
    </v-row>
</template>

<script>
import device from "../components/device.vue"
import addDevice from "../components/addDevice.vue"

export default {
    components: {
        'device': device,
        'addDevice': addDevice
    },
    props: {
        roomName: String,
        roomId: String,
    },
    data() {
        return{
            editing: false,
            nameString: "name",
            editingText: "Edit",
            expand: false,
            arrow: "mdi-arrow-down"
        }
    },
    methods: {
        editPressed() {
            this.editing = !this.editing
            if(this.editingText === "Edit")
                this.editingText = "Done"
            else
                this.editingText = "Edit"
        },
        expandPressed() {
            this.expand = !this.expand
            if(this.arrow === "mdi-arrow-down")
                this.arrow = "mdi-arrow-up"
            else
                this.arrow = "mdi-arrow-down"
        }
    }
}
</script>