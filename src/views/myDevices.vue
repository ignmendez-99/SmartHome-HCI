<template>
    <div>
        <v-container fluid>
           <v-row>
                <v-col cols="4" class="blue lighten-5">
                    <v-card class="mb-4">
                        <v-row align="center">
                            <v-col cols="1"></v-col>

                            <v-col align="center">
                                <p class="pa-0 ma-0 headline">Quick actions / Routines</p>
                            </v-col>

                            <v-col cols="2">
                                <v-btn @click="editRoutinesPressed" small>{{routinesEditButtonText}}</v-btn>
                            </v-col>

                            <v-col cols="1"></v-col>
                        </v-row>
                    </v-card>

                    <div id="quick_actions">
                        <v-container>
                            <v-row align="center">
                                <routine v-for="routine in routines" :key="routine" :name="routine"/>
                                <v-col cols="1"/>
                                <v-col v-show="editingRoutines">
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
                                <v-col cols="1"/>
                            </v-row>
                        </v-container>
                    </div>
                </v-col>

                <v-col cols="8">
                    <div id="my_devices">
                        <v-container fluid>
                            <home v-for="home in $homeStore.data.homes" :key="home" :homeName="home[name]" :homeId="home[id]"/>
                            <addHome/>
                        </v-container>
                    </div>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<style>
    #quick_actions {
        padding-top: 10px;
        height: 640px;
        overflow: scroll;
    }

    #my_devices {
        height: 700px;
        overflow: scroll;
    }


</style>

<script>
    import routine from "../components/routine.vue"
    import home from "../components/home.vue"
    import addHome from "../components/addHome.vue"

    export default {
        components: {
            'routine': routine,
            'home': home,
            'addHome': addHome
        },
        data() {
            return{
                newHomeName: "PRUEBA 2",
                name: "name",
                id: "id",
                prueba: "CHAU",
                routines: ["hola", "chau", "que tal", "todo bien", "FRANCO NAVARRO"],
                expand: false,
                editingRoutines: false,
                routinesEditButtonText: "Edit",
            }
        },
        methods: {
            editRoutinesPressed() {
                this.editingRoutines = !this.editingRoutines
                if(this.routinesEditButtonText === "Edit")
                    this.routinesEditButtonText = "Done"
                else
                    this.routinesEditButtonText = "Edit"
            }
        }
    }
</script>
