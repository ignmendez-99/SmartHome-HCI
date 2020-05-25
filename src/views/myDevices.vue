<template>
    <div>
        <v-container fluid>
            <v-row>
                <v-col cols="4" class="blue lighten-5">
                    <v-card class="mb-4">
                        <v-row align="center">
                            <v-col cols="1"></v-col>

                            <v-col align="center">
                                <p class="pa-0 ma-0 headline">Routines</p>
                            </v-col>

                            <v-col cols="1"></v-col>
                        </v-row>
                    </v-card>

                    <div id="quick_actions">
                        <v-container>
                            <v-row align="center">
                                <routine v-for="routine in $routineStore.data.routines" :key="routine" :name="routine.name" :id="routine.id"/>
                                <v-col cols="1"/>
                                <v-col align="center" justify="center">
                                    <routineAddCard/>
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

        <v-snackbar v-model="snackbar">
            {{objectDeleted}} deleted.
            <v-btn color="blue" text @click="snackbar = false">
                Close
            </v-btn>
        </v-snackbar>
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
    import eventBus from '../eventBus'
    import routineAddCard from '../components/routineAddCard'

    export default {
        components: {
            'routine': routine,
            'home': home,
            'addHome': addHome,
            'routineAddCard': routineAddCard
        },
        data() {
            return{
                newHomeName: "PRUEBA 2",
                name: "name",
                id: "id",
                prueba: "CHAU",
                expand: false,
                editingRoutines: false,
                routinesEditButtonText: "Edit",
                snackbar: false,
                objectDeleted: "",
                routineUpdater: 0
            }
        },
        mounted () {
            eventBus.$on("deletedSomething", function (objectName) {
                this.objectDeleted = objectName
                this.snackbar = true
                console.log("se borro " + this.objectDeleted + ": " + this.snackbar)
            });

            eventBus.$on("routineAdded", function (updatedString) {
                this.$routineStore.data.getAllRoutines()
                console.log(updatedString)
            });
        }
    }
</script>
