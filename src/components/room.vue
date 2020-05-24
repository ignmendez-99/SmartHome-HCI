<template>
    <v-row class="mx-4">
        <p v-if="!editing" class="headline">{{roomName}}</p>
        
        <v-text-field v-if="editing" v-model="newName" dense filled/>

        <v-btn x-small @click="deleteRoom" class="red ml-4" fab v-show="editing">
            <v-icon>{{deleteIcon}}</v-icon>
        </v-btn>

        <v-spacer></v-spacer>

        <v-btn small @click="cancelPressed" v-show="editing">CANCEL</v-btn>
        <v-btn small @click="changeRoomName" class="mx-4 blue white--text" v-show="editing">DONE</v-btn>
        <v-btn small @click="editPressed" class="mr-4" v-show="!editing && expand">EDIT</v-btn>
        <v-btn small @click="expandPressed">
            <v-icon>{{arrow}}</v-icon>
        </v-btn>
        <v-col cols="12">
            <v-divider></v-divider>
        </v-col>
        <v-col cols="12" class="shrink">
            <v-expand-transition>
                <v-row v-show="expand" class="mx-4" align="center">
                    <device v-for="device in $deviceStore.data.devicesByRoom.get(roomId)" :key="device" :deviceName="device[nameString]" :deviceId="device[idString]" :deviceTypeId="device[typeString][idString]"/>
                    <v-col cols="3" align="center">
                        <addDevice :roomId="roomId"/>
                    </v-col>
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
            idString: "id",
            typeString: "type",
            expand: false,
            arrow: "mdi-arrow-down",
            deleteIcon: "mdi-delete",
            newName: this.roomName
        }
    },
    methods: {
        editPressed() {
            this.editing = true
        },
        cancelPressed() {
            this.newName = this.roomName
            this.editing = false
        },
        expandPressed() {
            this.expand = !this.expand
            if(this.arrow === "mdi-arrow-down")
                this.arrow = "mdi-arrow-up"
            else
                this.arrow = "mdi-arrow-down"
            this.editing = false
        },
        changeRoomName() {
            this.editing = false
            if (this.newName != this.roomName)
                this.$roomStore.data.renameRoom(this.roomId, this.newName)
        },
        deleteRoom() {
            this.editing = false
            // ACA DEBERIA PREGUNTAR CON UN POPUP O ALGO!!!!!!!!!!!!!
            this.$roomStore.data.deleteRoom(this.roomId)
        }
    }
}
</script>