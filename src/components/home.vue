<template>
    <v-row>
    <p id="npnm" class="headline">{{name}}</p>
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
                    <room v-for="room in myRooms" :key="room" :name="room[aux]" :id="room[aux2]" :devices="devices"/>
                    <v-btn @click="createRoom">ADD ROOM</v-btn>
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
        rooms: Array,
        devices: Array,
        id: String
    },
    data() {
        return{
            expand: false,
            aux: "name",
            aux2: "id",
            editing: false,
            editingText: "Edit",
            arrow: "mdi-arrow-down",
            numberOfRooms: this.rooms.lenght,
            genericUrl: 'http://127.0.0.1:8081/api/',
            myRooms: []
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
        },
        createRoom() {
            let roomId;

            this.axios.post(this.genericUrl + 'rooms', {
                name: "PRUEBA ROOM FINAL",
                meta: {}
            })
            .then( (response) => {
                roomId = response.data.result.id;
                this.axios.post(this.genericUrl + "homes/" + this.id + "/rooms/" + roomId, {})
                .then( () => {
                    console.log("LINKED HOME WITH ROOM");
                    this.axios.get(this.genericUrl + "rooms/" + roomId, {})
                    .then( (response) => {
                        this.myRooms.push(response.data.result);
                        console.log("SUCCESS");
                    })
                    .catch( () => {
                        console.log("FAILED TO GET THE NEW ROOM");
                    })
                })
                .catch( () => {
                    console.log("FAILED TO LINK ROOM WITH HOME");
                })
            })
            .catch( () =>{
                console.log("FAILED TO CREATE ROOM");
            })
        },
        parseRooms(room) {
            if(room["home"]["name"] === this.name)
                this.myRooms.push(room);
        }
    },
    mounted() {
        this.rooms.forEach(this.parseRooms);
    }
}
</script>