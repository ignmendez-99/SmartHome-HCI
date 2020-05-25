<template>
    <div class="text-xs-center">
        <v-dialog v-model="dialog" width="650">

            <template v-slot:activator="{ on }">
                <v-btn class="pa-0 ma-0" height="250" depressed block color="transparent transparent--text" v-on="on" @click="speakerManager">Click Me</v-btn>
            </template>

            <v-card min-height="550">
                <v-container>
                    <v-card-title class="headline blue lighten-4 pa-3" primary-title>
                        <template v-if="!editing">
                            {{deviceName}}
                        </template>
                        <v-text-field v-if="editing" v-model="newName" dense counter maxlength="25" filled/>
                        <v-spacer></v-spacer>
                        <v-btn color="blue lighten-1" small @click="closeCard">
                            <v-icon>mdi-close</v-icon>
                        </v-btn>
                    </v-card-title>
                    
                    <v-card-actions class="pb-0">
                        <v-container class="pb-0">
                            <v-row justify="center" class="mb-4">
                                <v-btn color="grey lighten-2 mr-1" v-show="songPlaying" @click="previousSong" :loading="waitingForPreviousSong">
                                    <v-icon>mdi-skip-backward</v-icon>
                                </v-btn>
                                <v-btn color="grey lighten-2 mx-1" v-if="!songPlaying" @click="playOrResumeSong" :loading="waitingForPlaySong">
                                    <v-icon>mdi-play</v-icon>
                                </v-btn>
                                <v-btn color="grey lighten-2 mx-1" v-else @click="pauseSong" :loading="waitingForPauseSong">
                                    <v-icon>mdi-pause</v-icon>
                                </v-btn>
                                <v-btn color="grey lighten-2 mx-1" @click="stopSong" :loading="waitingForStopSong">
                                    <v-icon>mdi-stop</v-icon>
                                </v-btn>
                                <v-btn color="grey lighten-2 ml-1" v-show="songPlaying" @click="nextSong" :loading="waitingForNextSong">
                                    <v-icon>mdi-skip-forward</v-icon>
                                </v-btn>
                            </v-row>
                            <v-row justify="center" class="mb-3 mt-10">
                                <v-slider
                                    v-model="volumeNumber"
                                    min="0"
                                    max="10"
                                    thumb-label="always"
                                    tick-size="5"
                                    ticks="always"
                                    @change="setVolume"
                                    prepend-icon="mdi-volume-minus"
                                    append-icon="mdi-volume-plus"
                                ></v-slider>
                            </v-row>
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

                            <v-select
                                :items="genres"
                                v-show="!songInDisplay"
                                label="Music Genre"
                                dense
                                @change="changeGenre"
                            ></v-select>


                        </v-container>
                    </v-card-actions>

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

                    <v-row justify="center" class="mt-8 mb-6">
                        <deleteObject v-show="editing" :id="deviceId" :name="deviceName" :type="device"/>
                        <v-btn small @click="cancelPressed" class="mx-4" v-show="editing">CANCEL</v-btn>
                        <v-btn small @click="changeDeviceName" class="blue white--text" v-show="editing">DONE</v-btn>
                        <v-btn small @click="editPressed" v-show="!editing">EDIT</v-btn>
                    </v-row>

                    <v-snackbar
                        :timeout="timeout"
                        left
                        bottom
                        multi-line
                        v-model="snackbar"
                        color="error"
                    >
                        <strong>{{ errorText }}</strong>
                        <v-btn @click.native="snackbar = false">Close</v-btn>
                    </v-snackbar>

                    

                </v-container>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>

import deleteObject from './deleteObject'

export default {
    props: {
        deviceId: String,
        deviceName: String
    },
    components: {
        'deleteObject': deleteObject
    },
    data () {
        return {
            device: "device",
            dialog: false,
            songPlaying: false,
            songInDisplay: false,

            songTitle: "",
            songArtist: "",
            songAlbum: "",
            songDuration: "",
            songDurationInSeconds: 0,

            timeout: 6000,    /////
            errorText: "",    // ERROR HANDLING
            snackbar: false,  /////

            editing: false,
            newName: this.deviceName,

            waitingForPreviousSong: false,
            waitingForPlaySong: false,
            waitingForPauseSong: false,
            waitingForStopSong: false,
            waitingForNextSong: false,

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
            this.waitingForPlaySong = true;
            if(!this.songPlaying) {
                if(this.songInDisplay)
                    action = '/resume';
                else 
                    action = '/play';
                
                this.axios.put(this.$genericUrl + 'devices/' + this.deviceId + action)
                .then( (response) => {
                    if(response.data.result === true) {
                        if(!this.songInDisplay) {
                            this.getStateOfCurrentSong();
                            this.songInDisplay = true;
                        }
                        this.songPlaying = true;
                        this.startCountOfSeconds();
                    } else {
                        this.throwErrorMessage("Could not play song. Try again later.", 6000);
                        this.waitingForPlaySong = false;
                    }
                })
                .catch( () => {
                    this.throwErrorMessage("Could not play song. Try again later.", 6000);
                    this.waitingForPlaySong = false;
                })
            } else {
                this.throwErrorMessage("Could not play song. Try again later.", 6000);
                this.waitingForPlaySong = false;
            }
        },
        pauseSong: function() {
            this.waitingForPauseSong = true;
            const pauseAction = '/pause';
            if(this.songPlaying === true) {
                this.axios.put(this.$genericUrl + 'devices/' + this.deviceId + pauseAction)
                .then( (response) => {
                    if(response.data.result === true) {
                        this.songPlaying = false;
                        clearInterval(this.secondsUpdater);
                    } else
                        this.throwErrorMessage("Could not pause song. Try again later.", 6000);
                    this.waitingForPauseSong = false;
                })
                .catch( () => {
                    this.throwErrorMessage("Could not pause song. Try again later.", 6000);
                    this.waitingForPauseSong = false;
                })
            } else {
                this.throwErrorMessage("Could not pause song. Try again later.", 6000);
                this.waitingForPauseSong = false;
            }
        },
        stopSong: function() {
            this.waitingForStopSong = true;
            const stopAction = '/stop';
            if(this.songInDisplay === true) {
                this.axios.put(this.$genericUrl + 'devices/' + this.deviceId + stopAction)
                .then( (response) => {
                    if(response.data.result === true) {
                        this.songPlaying = false;
                        this.songInDisplay = false;
                        this.secondsElapsed = 0;
                        clearInterval(this.secondsUpdater);
                        this.waitingForStopSong = false;
                    } else {
                        this.throwErrorMessage("Could not stop song. Try again later.", 6000);
                        this.waitingForStopSong = false;
                    }
                })
                .catch( () => {
                    this.throwErrorMessage("Could not stop song. Try again later.", 6000);
                    this.waitingForStopSong = false;
                })
            } else {
                this.throwErrorMessage("Could not stop song. Try again later.", 6000);
                this.waitingForStopSong = false;
            }
        },
        setVolume: function() {
            const action = '/setVolume';
            this.axios.put(this.$genericUrl + 'devices/' + this.deviceId + action, [this.volumeNumber])
            .catch( () => {
                this.throwErrorMessage("Could not set volume. Try again later.", 6000);
            })
        },
        previousSong: function() {
            this.waitingForPreviousSong = true;
            const action = '/previousSong';
            this.axios.put(this.$genericUrl + 'devices/' + this.deviceId + action)
            .then( (response) => {
                if(response.data.result === true) {
                    this.getStateOfCurrentSong();
                    this.secondsElapsed = 0;
                } else
                    this.throwErrorMessage("Could not go to previous song. Try again later.", 6000);
                this.waitingForPreviousSong = false;
            })
            .catch( () => {
                this.throwErrorMessage("Could not go to previous song. Try again later.", 6000);
                this.waitingForPreviousSong = false;
            })
        },
        nextSong: function() {
            this.waitingForNextSong = true;
            const action = '/nextSong';
            this.axios.put(this.$genericUrl + 'devices/' + this.deviceId + action)
            .then( (response) => {
                if(response.data.result === true) {
                    this.getStateOfCurrentSong();
                    this.secondsElapsed = 0;
                } else
                    this.throwErrorMessage("Could not go to next song. Try again later.", 6000);
                this.waitingForNextSong = false;
            })
            .catch( () => {
                this.throwErrorMessage("Could not go to next song. Try again later.", 6000);
                this.waitingForNextSong = false;
            })
        },
        speakerManager: function() {  // executed each time the SpeakerPopup is opened
            const state = '/state';

            this.waitingForPreviousSong = true;
            this.waitingForPlaySong = true;
            this.waitingForPauseSong = true;
            this.waitingForStopSong = true;
            this.waitingForNextSong = true;

            this.axios.get(this.$genericUrl + 'devices/' + this.deviceId + state)
            .then( (response) => {
                if(response.data.result.status != "undefined") {
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
                    this.waitingForPreviousSong = false;
                    this.waitingForPlaySong = false;
                    this.waitingForPauseSong = false;
                    this.waitingForStopSong = false;
                    this.waitingForNextSong = false;
                } 
                else
                    this.throwErrorMessage("Could not load Device state. Try again later.", 0);
            })
            .catch( () => {
                this.throwErrorMessage("Could not load Device state. Try again later.", 0);
            })
        },
        getStateOfCurrentSong: function() {
            this.axios.get(this.$genericUrl + 'devices/' + this.deviceId + '/state')
            .then( (response) => {
                if(response.data.result.song != "undefined") {
                    this.songTitle = response.data.result.song.title;
                    this.songArtist = response.data.result.song.artist;
                    this.songAlbum = response.data.result.song.album;
                    this.songDuration = response.data.result.song.duration;
                    this.songTimeElapsed = response.data.result.song.progress;
                }
                else
                    this.throwErrorMessage("Could not get Device state. Try again later.", 6000);
            })
            .catch( () => {
                this.throwErrorMessage("Could not get Device state. Try again later.", 6000);
            })
        },
        startCountOfSeconds: function() {

            this.waitingForPlaySong = false;

            this.secondsUpdater = window.setInterval( () => {
                this.secondsElapsed ++ ;
                this.updateSongTimeElapsed();
                if(this.secondsElapsed >= this.songDurationInSeconds) {
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
            const action = '/setGenre'
            this.axios.put(this.$genericUrl + 'devices/' + this.deviceId + action, [selectObj])
            .catch( () => {
                this.throwErrorMessage("Could not change music genre. Try again later.", 6000);
            })
        },
        closeCard: function() {
            this.dialog = false;
            this.editing = false
            clearInterval(this.secondsUpdater)
        },
        throwErrorMessage(message, duration) {
            this.snackbar = true;
            this.errorText = message;
            this.timeout = duration;
        },
        changeDeviceName() {
            this.editing = false
            if (this.newName != this.deviceName)
                this.$deviceStore.data.renameDevice(this.deviceId, this.newName)
        },
        editPressed() {
            this.editing = true
        },
        cancelPressed() {
            this.newName = this.deviceName
            this.editing = false
        }
    }
}
</script>