<template>
    <v-row align="center" justify="center" class="grey lighten-3 my-2 py-2">
        <v-col cols="1"/>

        <v-col cols="4" class="ma-0 pa-0" align="center" justify="center">
            <p class="headline ma-0 pa-0">{{deviceName}}</p>
        </v-col>

        
        <v-col cols="2" class="ma-0 pa-0" align="center" justify="center">
            <v-icon>{{arrow}}</v-icon>
        </v-col>

        <v-col cols="4" class="ma-0 pa-0" align="center" justify="center">
            <p class="headline ma-0 pa-0">{{actionName}}</p>
        </v-col>

        <v-col cols="1"/>
    </v-row>
</template>

<script>

export default {
    props: {
        deviceName: String,
        actionName: String
    },
    data() {
        return {
            arrow: "mdi-arrow-right"
        }
    }
}
</script>