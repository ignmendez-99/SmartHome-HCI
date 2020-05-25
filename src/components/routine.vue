<template>
    <v-col cols="6">
        <v-card @click="execute">
            <v-container>
                <v-row align="center">
                    <v-col cols="12" align="center" color="blue lighten-3">
                        <div class="blue" outlined>
                            <p class="ma-0 py-4 title white--text">{{name}}</p>
                        </div>
                    </v-col>
                </v-row>
                <v-divider :v-if="editing"/>
                <v-row justify="center">
                    <deleteObject class="mt-2" :id="id" :name="name" :type="routine"/>
                </v-row>
            </v-container>
        </v-card>
    </v-col>
</template>

<script>

import deleteObject from './deleteObject'

export default {
    props: {
        name: String,
        id: String
    },
    components: {
        'deleteObject': deleteObject
    },
    data () {
        return {
            editing: false,
            routine: "routine"
        }
    },
    methods: {
        execute() {
            this.$routineStore.data.executeRoutine(this.id)
        }
    }
    
}
</script>