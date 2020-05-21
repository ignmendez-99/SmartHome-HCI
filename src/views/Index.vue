<template>
  <v-container fluid>

    <!-- dejamos un pequeños espacio entre la toolbar y el titulo de la pagina -->
    <v-layout class="my-9"/>

    <v-layout row wrap justify-center>
      <v-flex class="mb-8">
        <p id="HomeTitle" text-align="center" class="display-3">Smart Home. Made Simple.</p>
        <p id="HomeSubtitle" class="title">Get useful insights about your devices usage. Control them with ease.</p>
      </v-flex>
    </v-layout>

    <v-layout row wrap justify-center class="mb-8">
      <!-- MEDIDAS DE XS SM y MD para que en todos los tamaños ambos botones tengan un tamaño correcto (1 columna) -->
      <v-btn md1 sm1 xs1 class="mr-4" large outlined color="light-blue darken-1">SIGN UP</v-btn>
      <v-btn md1 sm1 xs1 class="ml-4" large color="light-blue darken-1" dark>LOG IN</v-btn>
    </v-layout>
    
    <v-layout row wrap class="mx-12 px-6">  <!-- tiene un Margin y Padding grandes en el eje X -->
      <v-flex md6 align-self-center="true">
        <p class="headline">Simple</p>
        <p class="body-1">Easy and clean desing to keep only <strong>the things that matter</strong> close to you.</p>
        <p class="headline">Fast</p>
        <p class="body-1">Just Add a new device, and after a <strong>few clicks</strong> you will be in control.</p>
        <p class="headline">Smart</p>
        <p class="body-1">With UltraHome, you have the <strong>power to reach</strong> and configure every Smart device around you.</p>
      </v-flex>

      <!-- la imagen, cuando la pantalla es SM o XS, se va hacia abajo del texto
      para mi dejemoslo asi, porque si esta siempre a la derecha del texto, en dispositivos muy chicos queda mal -->
      <v-flex md6 align-self-center="true">
        <img id="index_image" src="../assets/sh.jpg" alt="Smart Home. Made Simple.">
      </v-flex>
    </v-layout>

  </v-container>
</template>

<!-- PEQUEÑO CSS, tuve que ponerlo para la propiedad de la imagen (sino la imagen es gigante)
 y tambien para poder centrar el texto (intente hacerlo en el tag de HTML con "align=center" y cosas asi, pero no pude) -->
<style>
  #index_image {
    width: 100%;
  }
  #HomeTitle, #HomeSubtitle {
    text-align: center;
  }
</style>
