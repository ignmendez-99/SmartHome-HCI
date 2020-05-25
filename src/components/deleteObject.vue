<template>
    <div>
        <v-dialog v-model="dialog" persistent max-width="290">
            <template v-slot:activator="{ on }">
                <v-btn x-small class="red" fab v-on="on" >
                    <v-icon>mdi-delete</v-icon>
                </v-btn>
            </template>

            <v-card>
                <v-card-title class="headline">Are you sure?</v-card-title>
                <v-card-text>Deleting {{name}} cannot be undone. Do you still want to delete it?</v-card-text>
                <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="red lighten-1" text @click="deleteObject">Delete</v-btn>
                <v-btn color="blue" text @click="dialog = false">Cancel</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>

import eventBus from '../eventBus';

export default {
    props: {
        id: String,
        name: String,
        type: String
    },
    data () {
        return {
            dialog: false
        }
    },
    methods: {
        deleteObject() {
            eventBus.$emit("deletedSomething", this.name);
            switch (this.type) {
                case "home": 
                    this.$homeStore.data.deleteHome(this.id)
                    break
                case "room":
                    this.$roomStore.data.deleteRoom(this.id)
                    break
                case "device":
                    this.$deviceStore.data.deleteDevice(this.id)
                    break
            }
        }
    }
}
</script>