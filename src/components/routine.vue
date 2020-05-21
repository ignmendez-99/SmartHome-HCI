<template>
    <v-col cols="6">
        <v-card>
            <v-container>
                <v-row align="center">
                    <v-col cols="12" align="center" color="blue lighten-3">
                        <div class="blue lighten-3" outlined>
                            <v-icon size="80" class="pa-3 ma-3">mdi-home</v-icon>
                        </div>
                    </v-col>
                    <v-col cols="12" align="center">
                        <p class="ma-0 pa-0 title">{{name}}</p>
                    </v-col>
                </v-row>
            </v-container>
        </v-card>
    </v-col>
</template>

<script>
export default {
    props: {
        name: String
    }
    
}
</script>