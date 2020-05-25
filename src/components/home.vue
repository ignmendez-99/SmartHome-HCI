<template>
    <v-row>
        <p v-if="!editing" class="headline">{{homeName}}</p>
        
        <v-text-field v-if="editing" v-model="newName" dense counter maxlength="25" filled/>
        <!-- <v-btn x-small @click="deleteHome" class="red ml-4" fab v-show="editing">
            <v-icon>{{deleteIcon}}</v-icon>
        </v-btn> -->

        <deleteObject v-show="editing" class="ml-4" :id="homeId" :name="homeName" :type="home"/>

        <v-spacer></v-spacer>

        <v-btn small @click="cancelPressed" v-show="editing">CANCEL</v-btn>
        <v-btn small @click="changeHomeName" class="mx-4 blue white--text" v-show="editing">DONE</v-btn>
        <v-btn small @click="editPressed" class="mr-4" v-show="!editing && expand">EDIT</v-btn>
        <v-btn small @click="expandPressed">
            <v-icon>{{arrow}}</v-icon>
        </v-btn>
        <v-col cols="12">
            <v-divider></v-divider>
        </v-col>
        <v-col cols="12" class="shrink">
            <v-expand-transition>
                <v-container v-show="expand">
                    <room v-for="room in $roomStore.data.roomsByHome.get(homeId)" :key="room" :roomName="room[nameString]" :roomId="room[idString]"/>
                    <addRoom :homeId="homeId"/>
                </v-container>
            </v-expand-transition>
        </v-col>
    </v-row>
</template>

<script>
import room from "../components/room.vue"
import addRoom from "../components/addRoom.vue"
import deleteObject from "../components/deleteObject"

export default {
    components: {
        'room': room,
        'addRoom': addRoom,
        'deleteObject': deleteObject
    },
    props: {
        homeName: String,
        homeId: String
    },
    data() {
        return{
            home: "home",
            expand: false,
            nameString: "name",
            idString: "id",
            editing: false,
            editingText: "Edit",
            arrow: "mdi-arrow-down",
            deleteIcon: "mdi-delete",
            newName: this.homeName
        }
    },
    methods: {
        editPressed() {
            this.editing = true
        },
        cancelPressed() {
            this.newName = this.homeName
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
        changeHomeName() {
            this.editing = false
            if (this.newName != this.homeName)
                this.$homeStore.data.renameHome(this.homeId, this.newName)
        }
        // deleteHome() {
        //     this.editing = false
        //     // ACA DEBERIA PREGUNTAR CON UN POPUP O ALGO!!!!!!!!!!!!!
        //     this.$homeStore.data.deleteHome(this.homeId)
        // }
    }
}
</script>