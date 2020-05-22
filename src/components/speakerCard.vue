<template>
  <div class="text-xs-center">
    <v-dialog v-model="dialog" width="500">

      <template v-slot:activator="{ on }">
        <v-btn color="red lighten-2"  dark  v-on="on">Click Me</v-btn>
      </template>

      <v-card>
          <v-container>
                <v-card-title class="headline blue lighten-4 pa-3" primary-title>
                    Speaker de Nacho
                    <v-spacer></v-spacer>
                    <v-btn color="blue lighten-1" small @click="dialog = false">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-card-title>
                <v-card v-show="songInDisplay">
                    <v-card-title>{{songTitle}}</v-card-title>
                    <v-container class="pa-0">
                        <v-col>
                            <v-row justify="left">
                                <p class="subheading ml-5">Artist: {{songArtist}}</p>
                            </v-row>
                            <v-row justify="left">
                                <p class="subheading ml-5">Album: {{songAlbum}}</p>
                            </v-row>
                        </v-col>
                    </v-container>
                </v-card>
                
                <v-card-actions>
                    <v-container>
                        <v-row>
                            <p v-show="songInDisplay">{{songMinutesElapsed}}:{{songSecondsElapsed}}</p>
                            <v-progress-linear
                            v-show="songInDisplay"
                            v-model="songSecondsElapsed"
                            color="deep-purple accent-4"
                            rounded
                            ></v-progress-linear>
                            <p v-show="songInDisplay">{{songDuration}}</p>
                        </v-row>
                        <v-row justify="center">
                            <v-btn color="grey lighten-2" @click="previousSong">
                                <v-icon>mdi-arrow-collapse-left</v-icon>
                            </v-btn>
                            <v-btn color="grey lighten-2" v-if="!songPlaying" @click="playSong">
                                <v-icon>mdi-play</v-icon>
                            </v-btn>
                            <v-btn color="grey lighten-2" v-else @click="pauseSong">
                                <v-icon>mdi-pause</v-icon>
                            </v-btn>
                            <v-btn color="grey lighten-2" @click="stopSong">
                                <v-icon>mdi-stop</v-icon>
                            </v-btn>
                            <v-btn color="grey lighten-2" @click="nextSong">
                                <v-icon>mdi-arrow-collapse-right</v-icon>
                            </v-btn>
                        </v-row>
                        <v-row>
                            <v-btn color="grey lighten-2" @click="volumeDown">
                                <v-icon>mdi-volume-minus</v-icon>
                            </v-btn>
                            <p>{{volumeNumber}}</p>
                            <v-btn color="grey lighten-2" @click="volumeUp">
                                <v-icon>mdi-volume-plus</v-icon>
                            </v-btn>
                        </v-row>
                    </v-container>
                </v-card-actions>
          </v-container>
      </v-card>
      
    </v-dialog>
  </div>
</template>

<script>
export default {
    data () {
        return {
            dialog: false,
            songPlaying: false,
            songInDisplay: false,
            songTitle: "Beautiful Song",
            songArtist: "Myself",
            songAlbum: "COOL-ALBUM",
            songDuration: "0:00",
            songSecondsElapsed: 0,
            songMinutesElapsed: 0,
            volumeNumber: 5 // default volume when speaker is created
        }
    },
    methods: {
        playOrResumeSong: function() {
            // let action;
            // if(this.songInDisplay) {
            //     // we have to resume the song
            //     action = '/resume';
            // } else {
            //     // we have to play the song
            //     action = '/play';
            // }
            
            // this.axios.put('http://127.0.0.1:8081/api/' + 'devices/' + deviceId + action)
            // .then( (response) => {
            //     if(response.data.result === true) {
            //         if(this.songInDisplay)
            //             this.songPlaying = true;
            //         this.songInDisplay = true;
            //     }
            // })
            // .catch( () => {
            //     console.log("No se pudo poner play a la cancion");
            // })
        },
        pauseSong: function() {
            // const pauseAction = '/pause';
            // this.axios.put('http://127.0.0.1:8081/api/' + 'devices/' + deviceId + pauseAction)
            // .then( (response) => {
            //     if(response.data.result === true) {
            //         this.songPlaying = false;
            //     }
            // })
            // .catch( () => {
            //     console.log("No se pudo poner pausa a la cancion");
            // })
        },
        stopSong: function() {
            // const stopAction = '/stop';
            // this.axios.put('http://127.0.0.1:8081/api/' + 'devices/' + deviceId + stopAction)
            // .then( (response) => {
            //     if(response.data.result === true) {
            //         this.songPlaying = false;
            //         this.songInDisplay = false;
            //     }
            // })
            // .catch( () => {
            //     console.log("No se pudo parar a la cancion");
            // })
        },
        setVolume: function(/*newVolumeNumber*/) {
            // const action = '/setVolume';
            // this.axios.put('http://127.0.0.1:8081/api/' + 'devices/' + deviceId + action, [newVolumeNumber])
            // .then( (response) => {
            //     if(response.data.result === true) {
            //         this.volumeNumber = newVolumeNumber
            //     }
            // })
            // .catch( () => {
            //     console.log("No se pudo cambiar el volumen");
            // })
        },
        volumeDown: function() {
            // if(this.volumeNumber > 0) 
            //     setVolume(this.volumeNumber - 1 + ""); // lo paso en formato String
        },
        volumeUp: function() {
            // if(this.volumeNumber < 10) 
            //     setVolume(this.volumeNumber + 1 + ""); // lo paso en formato String
        },
        previousSong: function() {
            //const action = '/previousSong';
            
        }
    }
}
</script>

<style>
  #albumImage {
    width: 100%;
  }
</style>