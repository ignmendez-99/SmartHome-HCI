<template>
    <div class="text-xs-center">
        <v-dialog v-model="addRoom" width="500">

            <template v-slot:activator="{ on }">
                <v-btn small v-on="on">ADD NEW ROOM</v-btn>
            </template>

            <v-card>
                <v-container>
                    <v-card-title class="headline blue lighten-4 pa-3" primary-title>
                        Add new room
                        <v-spacer></v-spacer>
                        <v-btn small @click="closeCard">
                            <v-icon>mdi-close</v-icon>
                        </v-btn>
                    </v-card-title>

                    <v-text-field 
                        class="my-12 mx-6"
                        v-model="roomName"
                        label="Name of the new room"
                        :rules="[rules.required, rules.counter]"
                        counter
                        maxlength="25"/>

                    <v-row justify="center">
                        <v-btn @click="$roomStore.data.createRoom(roomName, homeId); closeCard()">ADD</v-btn>
                    </v-row>
                </v-container>
            </v-card>

        </v-dialog>
    </div>
</template>

<script>
export default {
    props: {
        homeId: String
    },
    data() {
        return {
            addRoom: false,
            rules: {
                    required: value => !!value || 'Required.',
                    counter: value => value.length <= 25 || 'Max 25 characters'
                },
            roomName: ""
        }
    },
    methods: {
        closeCard() {
            this.addRoom = false;
        }
    }
}
</script>