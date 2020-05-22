<template>
    <div class="text-xs-center">
        <v-dialog v-model="addHome" width="500">

            <template v-slot:activator="{ on }">
                <v-btn v-on="on">ADD NEW HOME</v-btn>
            </template>

            <v-card>
                <v-container>
                    <v-card-title class="headline blue lighten-4 pa-3" primary-title>
                        Add new home
                        <v-spacer></v-spacer>
                        <v-btn small @click="closeCard">
                            <v-icon>mdi-close</v-icon>
                        </v-btn>
                    </v-card-title>

                    <v-text-field 
                        class="my-12 mx-6"
                        v-model="homeName"
                        label="Name of the new home"
                        :rules="[rules.required, rules.counter]"
                        counter
                        maxlength="25"/>

                    <v-row justify="center">
                        <v-btn @click="$homeStore.data.createHome(homeName); closeCard()">ADD</v-btn>
                    </v-row>
                </v-container>
            </v-card>

        </v-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            addHome: false,
            rules: {
                    required: value => !!value || 'Required.',
                    counter: value => value.length <= 25 || 'Max 25 characters'
                },
            homeName: ""
        }
    },
    methods: {
        closeCard() {
            this.addHome = false;
        }
    }
}
</script>