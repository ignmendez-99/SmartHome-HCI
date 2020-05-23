<template>
    <v-col cols="3">
        <v-card class="mx-auto">
            <v-img class="white--text align-end" height="80px" src="https://cdn.vuetifyjs.com/images/cards/docks.jpg">
                <v-card-title>{{deviceName}}</v-card-title>
            </v-img>
            <v-card-subtitle class="pb-0">Number 10</v-card-subtitle>
            <v-card-text class="text--primary">
                <div>{{status}}</div>
            </v-card-text>
            <!-- <v-card-actions>
                <v-btn class="blue--text" text>ON</v-btn>
                <v-btn class="blue--text" text>OFF</v-btn>
            </v-card-actions> -->
        </v-card>
    </v-col>
</template>

<script>
export default {
    props: {
        deviceName: String,
        deviceId: String
    },
    data() {
        return{
            expand: false,
            status: "",
            genericUrl: 'http://127.0.0.1:8081/api/'
        }
    },
    methods: {
        getState() {
            this.axios.get(this.genericUrl + this.deviceId + "/state", {})
            .then ( (response) => {
                this.state = response.data.result["status"]
            })
            .catch ( () => {
                console.log("FAILED TO GET DEVICE STATE")
            })
        }
    },
    mounted() {
        this.getState()
    }
    
}
</script>