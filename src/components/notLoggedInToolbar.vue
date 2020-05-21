<template>
  <nav>
    <v-app-bar app short color="light-blue darken-1 white--text">
      <v-toolbar-title>UltraHome</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn class="white--text" text>HOME</v-btn>
      <v-btn class="white--text" text>ABOUT US</v-btn>
      <router-link to="/logIn" style="text-decoration: none; color: inherit;">
        <v-btn class="ma-2" outlined color="white">LOG IN</v-btn>
      </router-link>
      <router-link to="/signUp" style="text-decoration: none; color: inherit;">
       <v-btn class="ma-2" outlined color="white" @click="signUp">SIGN UP</v-btn>
      </router-link>
    </v-app-bar>
  </nav>
</template>

<script>
export default {
  
}
</script>