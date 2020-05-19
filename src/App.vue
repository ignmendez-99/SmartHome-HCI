<template>
  <v-app id="app">
    <v-content>

      <!-- una vez importado el componente y puesto en la seccion de "components", se puede poner como un
      elemento de HTML nuevo -->
      <miBar/>

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
import navBar from './components/notLoggedInToolbar';
import footer from './components/footer';
export default {
  components: {
    'miBar': navBar,
    'miFooter': footer
  }
}
</script>