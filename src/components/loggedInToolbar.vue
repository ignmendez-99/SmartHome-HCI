<template>
  <nav>
    <v-app-bar app short color="light-blue darken-1 white--text">
      <v-toolbar-title>
        <router-link to="/" style="text-decoration: none; color: inherit;">
          <v-btn depressed color="light-blue darken-1 white--text">UltraHome</v-btn>
        </router-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>

      <v-dialog scrollable max-width="400px">
        <template v-slot:activator="{ on }">
          <v-btn class="white--text" v-on="on" text>SETTINGS</v-btn>
        </template>
        <v-card>
          <v-card-title>Settings</v-card-title>
          <v-divider></v-divider>
          <v-row>
            <v-col cols="9">
              <p>Setting 1</p>
            </v-col>
            <v-col cols="3">
                            
            </v-col>
          </v-row>
          <v-divider></v-divider>
          <v-card-actions>
            <v-btn color="blue darken-1" text @click="dialog = false">Close</v-btn>
            <v-btn color="blue darken-1" text @click="dialog = false">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <router-link to="/" style="text-decoration: none; color: inherit;">
        <v-btn class="ma-2" outlined color="white">LOG OUT</v-btn>
      </router-link>
    </v-app-bar>
  </nav>
</template>

<script>
export default {
    
}
</script>