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
                    <p class="display-3">Log In*</p>
                    <p class="title">New to Ultra Home? 
                        <router-link to="/signUp">Sign Up</router-link>
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
                        label="Email"
                        outlined
                    ></v-text-field>
                    <v-text-field
                        type="password"
                        label="Password"
                        outlined
                        clearable
                    ></v-text-field>

                    <v-row>
                        <v-col cols="5">
                            <v-checkbox class="npnm" label="Remember me" hide-details></v-checkbox>
                        </v-col>
                        <v-spacer></v-spacer>
                        <v-col align="end" cols="5">
                            <p class="npnm">Forgot password?</p>         
                        </v-col>
                    </v-row>
    
                    <router-link to="/devices" style="text-decoration: none; color: inherit;">
                        <v-btn large color="light-blue darken-1" dark>LOG IN</v-btn>
                    </router-link>
                </v-col>

                <v-col cols="3"></v-col>
            </v-row>
            
        </v-container>

        <v-container>
            <v-row>
                <v-col align="center">
                    <p>By loging in, you agree to our <u>Terms of Use</u> and to <br> receive Ultra Home emails & updates and <br> acknowledge that you read our <u>Privacy Policy</u></p>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>
export default {
    
}
</script>