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
                            <home v-for="home in homes" :key="home" :name="home[name]" :id="home[id]" :rooms="rooms" :devices="devices"/>
                            <v-btn @click="createHome">Add new home</v-btn>
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

    export default {
        components: {
            'routine': routine,
            'home': home
        },
        data() {
            return{
                name: "name",
                id: "id",
                prueba: "CHAU",
                routines: ["hola", "chau", "que tal", "todo bien", "FRANCO NAVARRO"],
                homes: [
                    {
                        "id": "cf077bae749e07f5",
                        "name": "Buenos Aires house",
                        "meta": {}
                    },
                    {
                        "id": "cf077bae749e07f6",
                        "name": "Pilar house",
                        "meta": {}
                    },
                    {
                        "id": "cf077bae749e07f7",
                        "name": "Casa de FRANCO NAVARRO",
                        "meta": {}
                    }
                ],
                rooms: [
                    {
                        "id": "de4ef543e2014f83",
                        "name": "Living",
                        "home": {
                            "id": "cf077bae749e07f5",
                            "name": "Buenos Aires house"
                        },
                        "meta": {}
                    },
                    {
                        "id": "de4ef543e2014f84",
                        "name": "Kitchen",
                        "home": {
                            "id": "cf077bae749e07f5",
                            "name": "Buenos Aires house"
                        },
                        "meta": {}
                    },
                    {
                        "id": "de4ef543e2014f85",
                        "name": "Nacho Mendez's room",
                        "home": {
                            "id": "cf077bae749e07f5",
                            "name": "Buenos Aires house"
                        },
                        "meta": {}
                    },
                    {
                        "id": "de4ef543e2014f84",
                        "name": "Dining room",
                        "home": {
                            "id": "cf077bae749e07f6",
                            "name": "Pilar house"
                        },
                        "meta": {}
                    },
                    {
                        "id": "de4ef543e2014f85",
                        "name": "Garden",
                        "home": {
                            "id": "cf077bae749e07f6",
                            "name": "Pilar house"
                        },
                        "meta": {}
                    },
                ],
                // devices: {
                //     "Living": ["Samsung TV"],
                //     "Kitchen": ["OVEN 5.000.000"],
                //     "Nacho Mendez's room": ["JBL Speaker", "Android TV", "BGH A/C", "another device", "even another device"],
                //     "Dining room": [],
                //     "Garden": ["ULTRA ASPERSOR"]
                // },
                devices: [
                    {
                        "id": "3d634b6f1326eaaf",
                        "name": "table lamp",
                        "type": {
                            "id": "go46xmbqeomjrsjr",
                            "name": "lamp",
                            "powerUsage": 15
                        },
                        "state": {
                            "status": "off",
                            "color": "FFFFFF",
                            "brightness": 100
                        },
                        "room": {
                            "id": "8fbbd7ab9d3b657f",
                            "name": "Living",
                            "home": {
                                "id": "02e93a94fad34dac",
                                "name": "Buenos Aires house"
                            }
                        },
                        "meta": {}
                    }
                ],
                expand: false,
                editingRoutines: false,
                routinesEditButtonText: "Edit",
                genericUrl: 'http://127.0.0.1:8081/api/'
            }
        },
        methods: {
            editRoutinesPressed() {
                this.editingRoutines = !this.editingRoutines
                if(this.routinesEditButtonText === "Edit")
                    this.routinesEditButtonText = "Done"
                else
                    this.routinesEditButtonText = "Edit"
            },
            createHome() {
                this.axios.post(this.genericUrl + 'homes', {
                    name: "PRUEBA HOME FINAL",
                    meta: {}
                })
                .then( (response) => {
                    this.homes.push(response.data.result);
                })
                .catch( () =>{
                    console.log("FAILED TO CREATE HOME");
                })
            },
            
        }
    
    }
</script>
