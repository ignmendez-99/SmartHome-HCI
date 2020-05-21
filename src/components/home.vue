<template>
    <v-row>
    <p id="npnm" class="headline">{{name}}</p>
        <v-spacer></v-spacer>
        <v-btn small @click="editPressed" v-show="expand">{{editingText}}</v-btn>
        <v-btn small @click="expand = !expand">
            <v-icon>mdi-keyboard_arrow_down</v-icon>
        </v-btn>
        <v-col cols="12">
            <v-divider></v-divider>
        </v-col>
        <v-col cols="12" class="shrink">
            <v-expand-transition>
                <v-container v-show="expand">
                    <room v-for="room in rooms" :key="room" :name="room" :devices="devices[room]"/>
                    <p v-if="numberOfRooms">No queres agregar una room a esta casa?</p>
                </v-container>
            </v-expand-transition>
        </v-col>
    </v-row>
</template>

<script>
import room from "../components/room.vue"

export default {
    components: {
            'room': room
    },
    props: {
        name: String,
        rooms: Object,
        devices: Object
    },
    data() {
        return{
            expand: false,
            editing: false,
            editingText: "Edit",
            numberOfRooms: this.rooms.lenght
        }
    },
    methods: {
        editPressed() {
            this.editing = !this.editing
            if(this.editingText === "Edit")
                this.editingText = "Done"
            else
                this.editingText = "Edit"
        }
    }
}
</script>