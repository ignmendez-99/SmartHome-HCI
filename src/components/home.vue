<template>
    <v-row>
    <p id="npnm" class="headline">{{homeName}}</p>
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

export default {
    components: {
        'room': room,
        'addRoom': addRoom
    },
    props: {
        homeName: String,
        homeId: String
    },
    data() {
        return{
            expand: false,
            nameString: "name",
            idString: "id",
            editing: false,
            editingText: "Edit",
            arrow: "mdi-arrow-down",
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