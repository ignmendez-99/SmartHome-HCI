<template>
    <div class="text-xs-center">
        <v-dialog v-model="dialog" width="500">
            <!-- dialog DEBERIA REEMPLAZARSE POR $dialogStore.data.dialogs.get(deviceId). deviceId lo recibe como prop. -->

            <template v-slot:activator="{ on }">
                <v-btn color="red lighten-2"  dark  v-on="on" @click="speakerManager">Click Me</v-btn>
            </template>

            <v-card>
                <v-container>
                    <v-card-title class="headline blue lighten-4 pa-3" primary-title>
                        Speaker de Nacho
                        <v-spacer></v-spacer>
                        <v-btn color="blue lighten-1" small @click="closeCard">
                            <v-icon>mdi-close</v-icon>
                        </v-btn>
                    </v-card-title>
                    <v-card v-show="songInDisplay">
                        <v-card-title>{{songTitle}}</v-card-title>
                        <v-container class="pa-0">
                            <v-col>
                                <v-row>
                                    <p class="subheading ml-5">Artist: {{songArtist}}</p>
                                </v-row>
                                <v-row>
                                    <p class="subheading ml-5">Album: {{songAlbum}}</p>
                                </v-row>
                            </v-col>
                        </v-container>
                    </v-card>
                    
                    <v-card-actions>
                        <v-container>
                            <v-row>
                                <v-col cols="2" class="pb-0">
                                    <p v-show="songInDisplay">{{songTimeElapsed}}</p>
                                </v-col>
                                <v-col cols="8" class="pb-0">
                                    <v-progress-linear
                                    v-show="songInDisplay"
                                    v-model="progressBarLoadingNumber"
                                    color="deep-purple accent-4"
                                    rounded
                                    ></v-progress-linear>
                                </v-col>
                                <v-col cols="2" class="pb-0">
                                    <p v-show="songInDisplay">{{songDuration}}</p>
                                </v-col>
                            </v-row>
                            <v-row justify="center" class="mb-4">
                                <v-btn color="grey lighten-2 mr-1" v-show="songPlaying" @click="previousSong">
                                    <v-icon>mdi-arrow-collapse-left</v-icon>
                                </v-btn>
                                <v-btn color="grey lighten-2 mx-1" v-if="!songPlaying" @click="playOrResumeSong">
                                    <v-icon>mdi-play</v-icon>
                                </v-btn>
                                <v-btn color="grey lighten-2 mx-1" v-else @click="pauseSong">
                                    <v-icon>mdi-pause</v-icon>
                                </v-btn>
                                <v-btn color="grey lighten-2 mx-1" @click="stopSong">
                                    <v-icon>mdi-stop</v-icon>
                                </v-btn>
                                <v-btn color="grey lighten-2 ml-1" v-show="songPlaying" @click="nextSong">
                                    <v-icon>mdi-arrow-collapse-right</v-icon>
                                </v-btn>
                            </v-row>
                            <v-row justify="center" class="mb-3">
                                <v-btn color="grey lighten-2" @click="volumeDown">
                                    <v-icon>mdi-volume-minus</v-icon>
                                </v-btn>
                                <p class="title mx-4 my-1">{{ this.volumeNumber }}</p>
                                <v-btn color="grey lighten-2" @click="volumeUp">
                                    <v-icon>mdi-volume-plus</v-icon>
                                </v-btn>
                            </v-row>
                            <v-select
                                :items="genres"
                                v-show="!songInDisplay"
                                label="Género de música"
                                dense
                                @change="changeGenre"
                            ></v-select>
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

            songTitle: "",
            songArtist: "",
            songAlbum: "",
            songDuration: "",
            songDurationInSeconds: 0,

            genres: ["pop", "rock", "classical", "country", "dance", "latina"],

            songTimeElapsed: "",  // will be something like 1:34
            secondsElapsed: 0,    // will be 94 in the example above
            secondsUpdater: 0,    // ID of the interval that will execute every second
            progressBarLoadingNumber: 0,  //  [0, 100]

            volumeNumber: 5
        }
    },
    methods: {
        playOrResumeSong: function() {
            let action;
            if(!this.songPlaying) {
                if(this.songInDisplay)
                    action = '/resume';
                else 
                    action = '/play';
                
                this.axios.put('http://127.0.0.1:8081/api/' + 'devices/' + '54d1a767268e67d4' + action)
                .then( (response) => {
                    if(response.data.result === true) {
                        if(!this.songInDisplay) {
                            this.getStateOfCurrentSong();
                            this.songInDisplay = true;
                        }
                        this.songPlaying = true;
                    }
                    this.startCountOfSeconds();
                })
                .catch( () => {
                    console.log("No se pudo poner play a la cancion");
                })
            }
        },
        pauseSong: function() {
            const pauseAction = '/pause';
            if(this.songPlaying === true) {
                this.axios.put('http://127.0.0.1:8081/api/' + 'devices/' + '54d1a767268e67d4' + pauseAction)
                .then( () => {
                    this.songPlaying = false;
                    clearInterval(this.secondsUpdater);
                })
                .catch( () => {
                    console.log("No se pudo poner pausa a la cancion");
                })
            }
        },
        stopSong: function() {
            const stopAction = '/stop';
            if(this.songInDisplay === true) {
                this.axios.put('http://127.0.0.1:8081/api/' + 'devices/' + '54d1a767268e67d4' + stopAction)
                .then( () => {
                    this.songPlaying = false;
                    this.songInDisplay = false;
                    this.secondsElapsed = 0;
                    clearInterval(this.secondsUpdater);
                })
                .catch( () => {
                    console.log("No se pudo parar a la cancion");
                })
            }
        },
        setVolume: function(newVolumeNumber) {
            const action = '/setVolume';
            this.axios.put('http://127.0.0.1:8081/api/' + 'devices/' + '54d1a767268e67d4' + action, [newVolumeNumber])
            .then( () => {
                this.axios.get('http://127.0.0.1:8081/api/' + 'devices/' + '54d1a767268e67d4' + '/state')
                .then( (response) => {
                    this.volumeNumber = response.data.result.volume;
                })
                .catch( () => {
                    console.log("No se pudo obtener el estado del dispositivo")
                })
            })
            .catch( () => {
                console.log("No se pudo cambiar el volumen");
            })
        },
        volumeDown: function() {
            if(this.volumeNumber > 0) {
                const aux = this.volumeNumber - 1;
                this.setVolume(aux.toString()); // lo paso en formato String
            }
        },
        volumeUp: function() {
            if(this.volumeNumber < 10) {
                const aux = parseInt(this.volumeNumber) + parseInt(1);
                this.setVolume(aux.toString()); // lo paso en formato String
            }
        },
        previousSong: function() {
            const action = '/previousSong';
            this.axios.put('http://127.0.0.1:8081/api/' + 'devices/' + '54d1a767268e67d4' + action)
            .then( (response) => {
                if(response.data.result === true) {
                    this.getStateOfCurrentSong();
                    this.secondsElapsed = 0;
                }
            })
            .catch( () => {
                console.log("No se pudo cambiar a la cancion anterior");
            })
        },
        nextSong: function() {
            const action = '/nextSong';
            this.axios.put('http://127.0.0.1:8081/api/' + 'devices/' + '54d1a767268e67d4' + action)
            .then( (response) => {
                if(response.data.result === true) {
                    this.getStateOfCurrentSong();
                    this.secondsElapsed = 0;
                }
            })
            .catch( () => {
                console.log("No se pudo cambiar a la cancion anterior");
            })
        },
        speakerManager: function() {  // executed each time the SpeakerPopup is opened
            const state = '/state';
            this.axios.get('http://127.0.0.1:8081/api/' + 'devices/' + '54d1a767268e67d4' + state)
            .then( (response) => {
                if(response.data.result.status === 'playing' || response.data.result.status === 'paused') {
                    this.songInDisplay = true
                    this.songTitle = response.data.result.song.title;
                    this.songAlbum = response.data.result.song.album;
                    this.songArtist = response.data.result.song.artist;
                    this.songDuration = response.data.result.song.duration;
                    this.songTimeElapsed = response.data.result.song.progress;
                    this.volumeNumber = response.data.result.volume;
                    if(response.data.result.status === 'playing')
                        this.songPlaying = true;
                    else
                        this.songPlaying = false;
                    
                    this.secondsElapsed = parseInt( this.songTimeElapsed.charAt(0) * 60 )
                                            + parseInt( this.songTimeElapsed.charAt(2) * 10 )
                                            + parseInt( this.songTimeElapsed.charAt(3) );
                    
                    this.songDurationInSeconds = parseInt( this.songDuration.charAt(0) * 60 )
                                            + parseInt( this.songDuration.charAt(2) * 10 )
                                            + parseInt( this.songDuration.charAt(3) );
                    
                    this.updateProgressBar();

                    if(response.data.result.status === 'playing')
                        this.startCountOfSeconds();
                }
            })
            .catch( () => {
                console.log("Algo fallo al obtener el estado del parlante");
            })
        },
        getStateOfCurrentSong: function() {
            this.axios.get('http://127.0.0.1:8081/api/' + 'devices/' + '54d1a767268e67d4' + '/state')
            .then( (response) => {
                this.songTitle = response.data.result.song.title;
                this.songArtist = response.data.result.song.artist;
                this.songAlbum = response.data.result.song.album;
                this.songDuration = response.data.result.song.duration;
                this.songTimeElapsed = response.data.result.song.progress;
            })
            .catch( () => {
                console.log("No se pudo obtener el estado del dispositivo")
            })
        },
        startCountOfSeconds: function() {
            this.secondsUpdater = window.setInterval( () => {
                this.secondsElapsed ++ ;
                this.updateSongTimeElapsed();
                if(this.secondsElapsed === this.songDurationInSeconds) {
                    this.getStateOfCurrentSong();
                    this.secondsElapsed = 0;
                    this.progressBarLoadingNumber = 0;
                }
            }, 1000); 
        },
        updateSongTimeElapsed: function() {
            let aux = this.secondsElapsed;
            this.songTimeElapsed = "";

            let minutes = Math.floor(aux / 60);
            this.songTimeElapsed += minutes.toString();
            aux -= (minutes * 60);

            this.songTimeElapsed += ":";

            let tensOfSeconds = Math.floor(aux / 10);
            this.songTimeElapsed += tensOfSeconds.toString();
            aux -= (tensOfSeconds * 10);

            this.songTimeElapsed += aux.toString();

            this.updateProgressBar();
        },
        updateProgressBar: function() {
            this.progressBarLoadingNumber = Math.floor( (100 * this.secondsElapsed) / this.songDurationInSeconds );
        },
        changeGenre(selectObj) {
            console.log(selectObj);
            const action = '/setGenre'
            this.axios.put('http://127.0.0.1:8081/api/' + 'devices/' + '54d1a767268e67d4' + action, [selectObj])
            .then( () => {
                this.getStateOfCurrentSong();
            })
            .catch( () => {
                console.log("No se pudo cambiar el genero de musica");
            })
        },
        closeCard: function() {
            this.dialog = false; 
            clearInterval(this.secondsUpdater)
        }  
    }
}
</script>