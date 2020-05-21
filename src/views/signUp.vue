<template>
    <div>
        <v-container fluid class="pt-12 pb-0">
            <v-row>
                <v-col cols="1">
                    <!-- necesita tener un inline-style para sacarle el Underline que router le pone -->
                    <router-link to="/" style="text-decoration: none; color: inherit;">
                        <v-btn>
                            <v-icon x-large>mdi-keyboard-backspace</v-icon>
                        </v-btn>
                    </router-link>
                </v-col>
                <v-col cols="10" align="center">
                    <p class="display-3">Sign Up*</p>
                    <p class="title">Already have a Ultra Home account?
                        <router-link to="/logIn">Log In</router-link>
                    </p>
                </v-col>
                <v-col cols="1"></v-col>
            </v-row>
        </v-container>

        <v-container>
            <v-row>
                <v-spacer></v-spacer>
                <v-col cols="7" align="center">
                    <v-divider></v-divider>
                </v-col>
                <v-spacer></v-spacer>
            </v-row>
        </v-container>

        <v-container>
            <v-row>
                <v-col cols="3"></v-col>

                <v-col cols="6" align="center">
                    <v-text-field
                        label="First Name"
                        outlined
                    ></v-text-field>

                    <v-text-field
                        label="Email"
                        outlined
                    ></v-text-field>
                    <v-text-field
                        :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                        :type="show1 ? 'text' : 'password'"
                        name="input-10-1"
                        label="Password"
                        outlined
                        hint="At least 8 characters"
                        counter
                        @click:append="show1 = !show1"
                    ></v-text-field>

                    <v-text-field
                        :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
                        :type="show2 ? 'text' : 'password'"
                        name="input-10-1"
                        label="Confirm Password"
                        outlined
                        hint="At least 8 characters"
                        counter
                        @click:append="show2 = !show2"
                    ></v-text-field>

                    <router-link to="/tutorial" style="text-decoration: none; color: inherit;">
                        <v-btn large color="light-blue darken-1" dark>SIGN UP</v-btn>
                    </router-link>

                </v-col>

                <v-col cols="3"></v-col>
            </v-row>
            
        </v-container>

        <v-container>
            <v-row>
                <v-col align="center">
                    <p>By signing up, you agree to our <u>Terms of Use</u> and to <br> receive Ultra Home emails & updates and <br> acknowledge that you read our <u>Privacy Policy</u></p>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>
export default {
    data () {
        return {
            show1: false,
            show2: false
        }
    }
}
</script>