<template>
  <div class="text-xs-center">
    <v-dialog v-model="showCard" width="500">

      <template v-slot:activator="{ on }">
        <v-btn class="pa-0 ma-0" height="250" depressed block color="transparent transparent--text"  v-on="on" @click="lightManager">Click Me</v-btn>
      </template>

      <v-card>
        <v-container class="pb-0">
          <v-card-title class="headline blue lighten-4 pa-3" primary-title>
            Lámpara de Nacho
            <v-spacer></v-spacer>
            <v-btn color="blue lighten-1" small @click="closeCard">
                <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>

          <v-card-actions class="pb-0">
            <v-container class="pb-0">
              <v-row align="center" justify="center" class="mb-5">

                <v-btn 
                  @click="turnOnLight"
                  color="blue lighten-1 white--text"
                  :loading="waitingTurnOn"
                  :disabled="lightIsOn"
                >ON</v-btn>

                <v-btn 
                  @click="turnOffLight"
                  color="blue lighten-1 white--text"
                  :loading="waitingTurnOff"
                  :disabled="lightIsOff"
                >OFF</v-btn>

              </v-row>
              <v-row align="center" justify="center">
                <v-progress-linear 
                height="25" 
                :value="lightBrightness" 
                color="amber" 
                :indeterminate="waitingForChangeBrightness"
                >
                  <strong>Brightness: {{ lightBrightness }}%</strong>
                </v-progress-linear>
              </v-row>

              <v-row align="center" justify="center">
                <v-col cols="7" class="pt-0">
                  <v-text-field
                    @change="setBrightnessToChange" 
                    counter
                    maxlength="3"
                    label="Set new brightness Level"
                    hint="Number between 1 and 100"
                    persistent-hint
                  ></v-text-field>
                </v-col>
                <v-col cols="5">
                  <v-btn 
                    @click="changeBrightness" 
                    color="blue lighten-1 white--text" 
                    :loading="waitingForChangeBrightness"
                    :disabled="!readyToChangeBrightness"
                  >CHANGE</v-btn>
                </v-col>
              </v-row>

              <v-row align="center" justify="center">
                <v-col cols="6">
                  <v-color-picker mode="hexa" hide-mode-switch  v-model="lightColor"></v-color-picker>
                </v-col>
                <v-col cols="6">
                  <v-btn 
                  color="blue lighten-1 white--text" 
                  @click="changeColor"
                  :loading="waitingForColorChange"
                  >CHANGE</v-btn>
                </v-col>
              </v-row>

            </v-container>
          </v-card-actions>

          <v-snackbar
            :timeout="timeout"
            left
            bottom
            multi-line
            v-model="snackbar"
            color="error"
          >
            <strong>{{ errorText }}</strong>
            <v-btn flat @click.native="snackbar = false">Close</v-btn>
          </v-snackbar>

        </v-container>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: {
    deviceId: String
  },
  data() {
    return {
      showCard: false,
      lightIsOn: false,
      lightIsOff: false,

      timeout: 6000,    /////
      errorText: "",    // ERROR HANDLING
      snackbar: false,  /////

      status: "",
      lightColor: "",
      lightBrightness: 0,  // [0-100]

      brightnessToChange: 0,  // [0-100]
      readyToChangeBrightness: false,

      waitingTurnOn: false,
      waitingTurnOff: false,
      waitingForChangeBrightness: false,
      waitingForColorChange: false
    }
  },
  methods: {
    turnOnLight() {
      this.waitingTurnOn = true;
      const turnOn = '/turnOn';
      if(this.lightIsOff) {
        this.axios.put('http://127.0.0.1:8081/api/' + 'devices/' + this.deviceId + turnOn)
        .then( (response) => {
          if(response.data.result === true) {
            this.lightIsOn = true;
            this.lightIsOff = false;
          } else 
              this.throwErrorMessage("Could not turn on lamp. Try again later.", 6000);
          this.waitingTurnOn = false;
        })
        .catch( () => {
          this.throwErrorMessage("Could not turn on lamp. Try again later.", 6000);
          this.waitingTurnOn = false;
        })
      } else {
        this.throwErrorMessage("Lamp is already ON !", 6000);
        this.waitingTurnOn = false;
      }
    },
    turnOffLight() {
      this.waitingTurnOff = true;
      const turnOff = '/turnOff';
      if(this.lightIsOn) {
        this.axios.put('http://127.0.0.1:8081/api/' + 'devices/' + this.deviceId + turnOff)
        .then( (response) => {
          if(response.data.result === true) {
            this.lightIsOn = false;
            this.lightIsOff = true;
          } else
              this.throwErrorMessage("Could not turn off lamp. Try again later.", 6000);
          this.waitingTurnOff = false;
        })
        .catch( () => {
          this.throwErrorMessage("Could not turn off lamp. Try again later.", 6000);
          this.waitingTurnOff = false;
        })
      } else {
        this.throwErrorMessage("Lamp is already OFF !", 6000);
        this.waitingTurnOff = false;
      }
    },
    lightManager() {
      this.showCard = true;
      this.waitingTurnOn = true;
      this.waitingTurnOff = true;
      this.waitingForChangeBrightness = true;
      this.waitingForColorChange = true;
      const state = '/state';
      this.axios.get('http://127.0.0.1:8081/api/' + 'devices/' + this.deviceId + state)
      .then( (response) => {
        this.lightColor = response.data.result.color;
        this.lightBrightness = response.data.result.brightness;
        this.status = response.data.result.status;
        if(this.status === 'off') {
          this.lightIsOff = true;
          this.lightIsOn = false;
        } else if(this.status === 'on') {
          this.lightIsOff = false;
          this.lightIsOn = true;
        }
        this.waitingTurnOn = false;
        this.waitingTurnOff = false;
        this.waitingForChangeBrightness = false;
        this.waitingForColorChange = false;
      })
      .catch( () => {
        this.throwErrorMessage("Could not recover the state of your device. Try again later.", 0);
      })
    },
    closeCard() {
      this.showCard = false;
    },
    changeBrightness() {
      this.waitingForChangeBrightness = true;
      const action = '/setBrightness';
      this.axios.put('http://127.0.0.1:8081/api/' + 'devices/' + this.deviceId + action, [this.brightnessToChange])
      .then( (response) => {
        if(response.data.result === this.lightBrightness)
          this.lightBrightness = this.brightnessToChange;
        else
          this.throwErrorMessage("Could not change brightness. Try again later.", 6000);
        this.waitingForChangeBrightness = false;
        this.readyToChangeBrightness = false;
      })
      .catch( () => {
        this.throwErrorMessage("Could not change brightness. Try again later.", 6000);
        this.waitingForChangeBrightness = false;
        this.readyToChangeBrightness = false;
      })
    },
    setBrightnessToChange(selectObj) {
      this.brightnessToChange = selectObj;
      this.readyToChangeBrightness = true;
    },
    changeColor() {
      this.waitingForColorChange = true;
      const action = '/setColor';
      const RGBcolor = this.lightColor.substring(1, 7);
      this.axios.put('http://127.0.0.1:8081/api/' + 'devices/' + this.deviceId + action, [RGBcolor])
      .then( () => {
        this.waitingForColorChange = false;
      })
      .catch( () => {
        this.throwErrorMessage("Could not change color. Try again later.", 6000);
        this.waitingForColorChange = false;
      })
    },
    throwErrorMessage(message, duration) {
      this.snackbar = true;
      this.errorText = message;
      this.timeout = duration;
    }
  }
}
</script>