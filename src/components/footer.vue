<template>
  <v-footer color="light-blue darken-1 white--text">
    <v-container>
      <v-layout row>
        <!-- MEDIDA PARA DISPOSITIVOS MEDIUM Y SMALL: PARA MI ASI QUEDA BIEN -->
        <v-flex md3 sm4>
          <p>CONTACT US</p>
          <!-- este margin-button-0 ayuda a que haya menos espacio azul, abajo de la toolbar -->
          <p class="mb-0">
            info@NOMBREAPP.com
            <br>
            +54 9 11-5043-5985
          </p>
        </v-flex>
        <!-- MEDIDA PARA DISPOSITIVOS MEDIUM Y SMALL: PARA MI ASI QUEDA BIEN -->
        <v-flex md2 sm3>
          <p>CAREERS</p>
          <!-- este margin-button-0 ayuda a que haya menos espacio azul, abajo de la toolbar -->
          <p class="mb-0">
            Come join us!
            <br>
          <a href="careers.html">Careers site</a>
          </p>
        </v-flex>
        <!-- MEDIDA PARA DISPOSITIVOS MEDIUM Y SMALL: PARA MI ASI QUEDA BIEN -->
        <v-flex md7 sm5></v-flex>
      </v-layout>
    </v-container>
  </v-footer>
</template>

<script>
export default {
    
}
</script>