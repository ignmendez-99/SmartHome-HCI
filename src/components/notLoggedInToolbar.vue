<template>
  <nav>
    <v-app-bar app short color="light-blue darken-1 white--text">
      <v-toolbar-title>UltraHome</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn class="white--text" text>HOME</v-btn>
      <v-btn class="white--text" text>ABOUT US</v-btn>
      <v-btn class="ma-2" outlined color="white">LOG IN</v-btn>
      <v-btn class="ma-2" outlined color="white" @click="signUp">SIGN UP</v-btn>
    </v-app-bar>
  </nav>
</template>

<script>
export default {
  
}
</script>