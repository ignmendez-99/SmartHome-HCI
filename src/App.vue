<template>
  <v-app id="app">
    <v-content>
      <!-- una vez importado el componente y puesto en la seccion de "components", se puede poner como un
      elemento de HTML nuevo -->
      <loggedInToolbar v-if="loggedIn"/>
      <notLoggedInToolbar v-else/>
      <div id="nav">
        <!-- <router-link to="/">Home</router-link> |
        <router-link to="/about">About</router-link> -->
      </div>
      <router-view/>
    </v-content>
    <miFooter/>
  </v-app>
</template>

<script>
  import notLoggedInToolbar from './components/notLoggedInToolbar';
  import loggedInToolbar from './components/loggedInToolbar.vue';
  import footer from './components/footer';
  export default {
    data () {
      return {
        loggedIn: true
      }
    },
    components: {
      'notLoggedInToolbar': notLoggedInToolbar,
      'loggedInToolbar': loggedInToolbar,
      'miFooter': footer
    }
  }
</script>