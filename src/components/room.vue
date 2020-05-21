<template>
    <v-row class="mx-4">
        <p id="npnm" class="subtitle-1">{{name}}</p>
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
                <v-row v-show="expand" class="mx-4">
                    <device v-for="device in devices" :key="device" :name="device"/>
                </v-row>
            </v-expand-transition>
        </v-col>
    </v-row>
</template>

<script>
import device from "../components/device.vue"

export default {
    components: {
        'device': device
    },
    props: {
        name: String,
        devices: Object
    },
    data() {
        return{
            editing: false,
            editingText: "Edit",
            expand: false
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