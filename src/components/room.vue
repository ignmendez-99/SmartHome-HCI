<template>
    <v-row class="mx-4">
        <p id="npnm" class="subtitle-1">{{name}}</p>
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
                    <device v-for="device in devices" :key="device" :name="device"/>

                    <v-col cols="3" v-show="editing">
                        <v-col cols="2"/>
                        <v-col>
                            <v-card>
                                <v-container>
                                    <v-row align="center">
                                        <!-- <v-col cols="2"/> -->
                                        <v-col align="center" color="blue lighten-3" class="pt-0 mt-0">
                                            <div class="blue darken-1 pa-0 ma-0">
                                                <v-icon size="60" class="pa-1 ma-1 white--text">mdi-plus</v-icon>
                                            </div>
                                        </v-col>
                                        <!-- <v-col cols="2"/> -->
                                        <v-col cols="12" align="center" class="pa-0 ma-0">
                                            <p class="ma-0 pa-0 title">Add</p>
                                            </v-col>
                                    </v-row>
                                </v-container>
                            </v-card>
                        </v-col>
                        <v-col cols="2"/>                        
                    </v-col>
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