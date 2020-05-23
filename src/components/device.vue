<template>
    <v-col cols="3">
        <v-card class="mx-auto" min-height="240">
            <v-container class="mt-0 pt-0">
                <v-row class="blue py-5" justify="center">
                    <v-icon size="50">{{icon}}</v-icon>
                </v-row>
                <v-card-title>{{deviceName}}</v-card-title>

                <v-container class="ma-0 pa-0">
                    <v-card-subtitle class="my-0 py-0">{{status1}}</v-card-subtitle>
                    <v-card-subtitle class="my-0 py-0">{{status2}}</v-card-subtitle>
                    <v-card-subtitle class="my-0 py-0">{{status3}}</v-card-subtitle>
                </v-container>
                
            </v-container>
        </v-card>
    </v-col>
</template>

<script>
export default {
    props: {
        deviceName: String,
        deviceId: String,
        deviceTypeId: String
    },
    data() {
        return{
            expand: false,
            status1: " ",
            status2: " ",
            status3: " ",
            repeater: 0,
            genericUrl: 'http://127.0.0.1:8081/api/',
            icon: ""
        }
    },
    methods: {
        getStateAndIcon() {
            this.axios.get(this.genericUrl + "devices/" + this.deviceId + "/state", {})
            .then ( (response) => {
                switch(this.deviceTypeId) {
                    case "c89b94e8581855bc":    // speaker
                        this.icon = "mdi-speaker"
                        this.status1 = response.data.result["status"].toUpperCase()
                        this.status2 = "VOLUME: " + response.data.result["volume"]
                        this.status3 = "GENRE: " + response.data.result["genre"].toUpperCase()
                        break
                    case "dbrlsh7o5sn8ur4i":    // faucet
                        this.status1 = response.data.result["status"].toUpperCase()
                        this.icon = "mdi-water-pump"
                        break
                    case "eu0v2xgprrhhg41g":    // blinds
                        this.icon = "mdi-blinds"
                        var aux = 100 - response.data.result["currentLevel"]
                        this.status1 = response.data.result["status"].toUpperCase() + " - " + aux + "%"
                        break
                    case "go46xmbqeomjrsjr":    // lamp
                        this.status1 = response.data.result["status"].toUpperCase()
                        this.status2 = "INTENSITY: " + response.data.result["brightness"] + "%"
                        this.icon = "mdi-lightbulb-outline"
                        break
                    case "im77xxyulpegfmv8":    // oven
                        this.icon = "mdi-stove"
                        break
                    case "li6cbv5sdlatti0j":    // ac
                        this.icon = "mdi-air-conditioner"
                        break
                    case "lsf78ly0eqrjbz91":    // door
                        this.status1 = response.data.result["status"].toUpperCase()
                        this.status2 = response.data.result["lock"].toUpperCase()
                        this.icon = "mdi-door"
                        break
                    case "mxztsyjzsrq7iaqc":    // alarm
                        this.icon = "mdi-alarm-light-outline"
                        break
                    case "ofglvd9gqx8yfl3l":    // vacuum
                        this.status1 = response.data.result["status"].toUpperCase()
                        this.status2 = "MODE: " + response.data.result["mode"].toUpperCase()
                        this.status3 = "BATTERY: " + response.data.result["batteryLevel"] + "%"
                        this.icon = "mdi-robot-vacuum"
                        break
                    case "rnizejqr2di0okho":    // refrigerator
                        this.status1 = "MODE: " + response.data.result["mode"].toUpperCase()
                        this.status2 = "FRIDGE: " + response.data.result["temperature"] + "°C"
                        this.status3 = "FREEZER: " + response.data.result["freezerTemperature"] + "°C"
                        this.icon = "mdi-fridge-outline"
                        break
                }
            })
            .catch ( (response) => {
                console.log("FAILED TO GET DEVICE STATE")
                console.log(response)
            })
        }
    },
    mounted() {
        this.getStateAndIcon();
        this.repeater = window.setInterval( () => {
            this.getStateAndIcon();
        }, 5000)
        
    }
    
}
</script>