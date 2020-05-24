import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify';
import axios from 'axios'
import VueAxios from 'vue-axios'

Vue.use(VueAxios, axios);

Vue.config.productionTip = false

//////////////////////////////////////

const genericUrl = 'http://127.0.0.1:8081/api/'

const homeStore = Vue.observable({
  data: {
    homes: [],
      getAllHomes() {
        this.homes = []
        axios.get(genericUrl + "homes", {})
        .then( (response) => {
          this.homes = response.data.result
        })
        .catch( () => {
          console.log("FAILED TO GET ALL HOMES")
        })
      },
  
      createHome(name) {
          axios.post(genericUrl + 'homes', {
              name: name,
              meta: {}
          })
          .then( (response) => {
              this.homes.push(response.data.result)
          })
          .catch( () =>{
              console.log("FAILED TO CREATE HOME " + name)
          })
      },

      renameHome(homeId, newName) {
        axios.put(genericUrl + "homes/" + homeId, {
          name: newName,
          meta: {}
        })
        .then( () => {
          getAll()
        })
        .catch( () => {
            console.log("FAILED TO RENAME HOME " + homeId + " with new name " + newName)
        })
      },

      deleteHome(homeId) {
        axios.delete(genericUrl + "homes/" + homeId, {})
        .then( () => {
          getAll()
        })
        .catch( () => {
            console.log("FAILED TO DELETE HOME " + homeId)
        })
      }
  }
})

const roomStore = Vue.observable({
  data: {
    rooms: [],
    roomsByHome: new Map(),

    getAllRooms() {
      this.rooms = []
      this.roomsByHome.clear()
      axios.get(genericUrl + "rooms", {})
      .then( (response) => {
        this.rooms = response.data.result
      })
      .catch( () => {
        console.log("FAILED TO GET ALL ROOMS")
      })
    },

    parseRoom(room) {
      var aux

      if(!roomStore.data.roomsByHome.has(room["home"]["id"])) {
        aux = []
      } else {
        aux = roomStore.data.roomsByHome.get(room["home"]["id"])
      }
      aux.push(room)
      roomStore.data.roomsByHome.set(room["home"]["id"], aux)
    },

    divideRoomsByHome() {
      this.rooms.forEach(this.parseRoom);
    },

    createRoom(name, homeId) {
      var roomId
      var aux = []

      axios.post(genericUrl + 'rooms', {
        name: name,
        meta: {}
      })
      .then( (response) => {
        console.log("ROOM CREATED");
        roomId = response.data.result.id;
        axios.post(genericUrl + "homes/" + homeId + "/rooms/" + roomId, {})
        .then( () => {
          console.log("ROOM LINKED WITH HOME");
            axios.get(genericUrl + "rooms/" + roomId, {})
            .then( (response) => {
              if(!roomStore.data.roomsByHome.has(homeId)) {
                aux = []
              } else {
                aux = roomStore.data.roomsByHome.get(homeId)
              }
              aux.push(response.data.result)
              roomStore.data.roomsByHome.set(homeId, aux)
              console.log("SUCCESS")
            })
            .catch( () => {
              console.log("FAILED TO GET THE NEW ROOM THAT WAS ALREADY LINKED TO PUT IN ARRAY")
            })
        })
        .catch( () => {
          console.log("FAILED TO LINK ROOM WITH HOME")
        })
      })
      .catch( () => {
        console.log("FAILED TO CREATE ROOM")
      })
    },

    renameRoom(roomId, newName) {
      axios.put(genericUrl + "rooms/" + roomId, {
        name: newName,
        meta: {}
      })
      .then( () => {
        getAll()
      })
      .catch( () => {
          console.log("FAILED TO RENAME ROOM " + roomId + " with new name " + newName)
      })
    },

    deleteRoom(roomId) {
      axios.delete(genericUrl + "rooms/" + roomId, {})
      .then( () => {
        getAll()
      })
      .catch( () => {
          console.log("FAILED TO DELETE ROOM " + roomId)
      })
    }
  }
})

const deviceStore = Vue.observable({
  data: {
    devices: [],
    devicesByRoom: new Map(),

    getAllDevices() {
      this.devices = []
      this.devicesByRoom.clear()
      axios.get(genericUrl + "devices", {})
      .then( (response) => {
        this.devices = response.data.result
      })
      .catch( () => {
        console.log("FAILED TO GET ALL DEVICES");
      })
    },

    createDevice(name, type, roomId) {
      var deviceId
      var aux

      axios.post(genericUrl + 'devices', {
        "type": {
          "id": type
        },
        "name": name,
        "meta": {}
      })
      .then( (response) => {
        console.log("DEVICE CREATED")
        deviceId = response.data.result.id
        axios.post(genericUrl + "rooms/" + roomId + "/devices/" + deviceId, {})
        .then( () => {
          console.log("LINKED ROOM WITH DEVICE")
          axios.get(genericUrl + "devices/" + deviceId, {})
          .then( (response) => {
            if(!deviceStore.data.devicesByRoom.has(roomId)) {
              aux = []
            } else {
              aux = deviceStore.data.devicesByRoom.get(roomId)
            }
            aux.push(response.data.result)
            deviceStore.data.devicesByRoom.set(roomId, aux)
            console.log("SUCCESS")
            })
          .catch( () => {
            console.log("FAILED TO GET THE NEW DEVICE")
          })
        })
        .catch( () => {
          console.log("FAILED TO LINK DEVICE WITH ROOM")
        })
      })
      .catch( () => {
        console.log("FAILED TO CREATE DEVICE")
      })
    },

    parseDevice(device) {
      var aux
      if(!deviceStore.data.devicesByRoom.has(device["room"]["id"])) {
        aux = []
      } else {
        aux = deviceStore.data.devicesByRoom.get(device["room"]["id"])
      }
      aux.push(device)
      deviceStore.data.devicesByRoom.set(device["room"]["id"], aux)
    },

    divideDevicesByRoom() {
      this.devices.forEach(this.parseDevice)
    },

    renameDevice(deviceId, newName) {
      axios.put(genericUrl + "devices/" + deviceId, {
        name: newName,
        meta: {}
      })
      .then( () => {
        getAll()
      })
      .catch( () => {
          console.log("FAILED TO RENAME DEVICE " + deviceId + " with new name " + newName)
      })
    },

    deleteDevice(deviceId) {
      axios.delete(genericUrl + "devices/" + deviceId, {})
      .then( () => {
        getAll()
      })
      .catch( () => {
          console.log("FAILED TO DELETE DEVICE " + deviceId)
      })
    }
  }
})

Vue.prototype.$homeStore = homeStore
Vue.prototype.$roomStore = roomStore
Vue.prototype.$deviceStore = deviceStore

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function getAll() {
  homeStore.data.getAllHomes()
  console.log("TRAJO LAS HOMES")
  // await sleep(2000);
  // console.log(homeStore.data.homes)
  
  
  roomStore.data.getAllRooms()
  console.log("TRAJO LAS ROOMS")
  // await sleep(2000);
  // console.log(roomStore.data.rooms)
  
  deviceStore.data.getAllDevices()
  console.log("TRAJO LOS DEVICES")
  await sleep(2000);
  // console.log(deviceStore.data.devices)

  roomStore.data.divideRoomsByHome()
  console.log("LINKEO LAS ROOMS CON LAS HOMES")
  await sleep(2000);
  // console.log(roomStore.data.roomsByHome)
  
  deviceStore.data.divideDevicesByRoom()
  console.log("LINKEO LOS DEVICES CON LAS ROOMS")
  // await sleep(2000);
  // console.log(deviceStore.data.devicesByRoom)
}

getAll()

//////////////////////////////////////

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
