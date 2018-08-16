<template>
  <div>
    <md-dialog :md-active.sync="showDialog" @md-closed="dialogClose()" >
      <md-progress-bar class="md-accent" md-mode="indeterminate" v-if="dialogLoaded"></md-progress-bar>
      <md-dialog-title>Reserve Trailer: {{ tid }} - {{ tname }}</md-dialog-title>
      <md-card>
        <md-card-header>
          <md-field>
            <label>Search for trucks</label>
            <md-input v-model="searchTruckInput"></md-input>
            <md-button class="md-icon-button" @click="searchTruck()" ><md-icon>search</md-icon></md-button>
          </md-field>
        </md-card-header>

      <md-card-content>
        <div class="md-layout md-gutter">
          <div class="md-layout-item">
            <md-content class="md-scrollbar">
              <md-radio v-for="truck in trucks" :key="truck" v-model="truckRadio" :value="truck.label" v-on:change="onRadioSelect(truck.id)" :disabled="!truck.isAvailable"  >{{ truck.label }}</md-radio>
            </md-content>
          </div>
          <div class="md-layout-item" v-if="showMap">
            <GmapMap
              :center="trailerLoc"
              :zoom="7"
              map-type-id="terrain"
              style="width: 300px; height: 300px"
            >
            <GmapMarker
              :key="index"
              v-for="(m, index) in pos"
              :position="m.position"
              :clickable="true"
              :draggable="true"
            />
            </GmapMap>
          </div>
        </div>
      </md-card-content>

    </md-card>

      <md-dialog-actions>
        <md-button class="md-primary" @click="showDialog = false">Close</md-button>
        <md-button class="md-primary" @click="addReserve()" v-if="!saveButton" >Reserve</md-button>
      </md-dialog-actions>
    </md-dialog>
    <md-progress-bar class="md-accent" md-mode="indeterminate" v-if="loaded"></md-progress-bar>
    <md-table v-model="searched" md-sort="name" md-sort-order="asc" md-card md-fixed-header @md-selected="onSelect">
      <md-table-toolbar>
        <div class="md-toolbar-section-start">
          <h1 class="md-title">Trailers</h1>
        </div>

        <md-field md-clearable class="md-toolbar-section-end">
          <md-input placeholder="Search by name..." v-model="search" @input="searchOnTable" />
        </md-field>
      </md-table-toolbar>

      <md-table-empty-state
        md-label="No data found"
        :md-description="`No trailer found for this '${search}' query. Try a different search term.`">
      </md-table-empty-state>

      <md-table-row slot="md-table-row" slot-scope="{ item }" md-selectable="single">
        <md-table-cell md-label="Status" md-sort-by="status" md-numeric><md-badge v-bind:style="tStatus(item.status)" class="md-square" v-bind:md-content="item.status" /></md-table-cell>
        <md-table-cell md-label="ID" md-sort-by="id" md-numeric>{{ item.id }}</md-table-cell>
        <md-table-cell md-label="Name" md-sort-by="name">{{ item.name }}</md-table-cell>
        <md-table-cell md-label="Serial" md-sort-by="serial">{{ item.serial }}</md-table-cell>
        <md-table-cell md-label="Address" md-sort-by="address">{{ item.address }}</md-table-cell>
        <md-table-cell md-label="City" md-sort-by="city">{{ item.city }}</md-table-cell>
        <md-table-cell md-label="State" md-sort-by="state">{{ item.state }}</md-table-cell>
        <md-table-cell md-label="Latitude" md-sort-by="lat">{{ item.lat }}</md-table-cell>
        <md-table-cell md-label="Longtitude" md-sort-by="lng">{{ item.lng }}</md-table-cell>
        <md-table-cell md-label="Zip" md-sort-by="zip">{{ item.zip }}</md-table-cell>
      </md-table-row>
    </md-table>
    <md-snackbar :md-active.sync="reserving">{{ msg }}</md-snackbar>
  </div>
</template>

<script>
import axios from 'axios'

const toLower = text => {
  return text.toString().toLowerCase()
}

const searchByName = (items, term) => {
  if (term) {
    return items.filter(item => toLower(item.name).includes(toLower(term)))
  }

  return items
}

export default {
  name: 'TableSearch',
  data: () => ({
    search: null,
    searchTruckInput: null,
    loaded: true,
    searched: [],
    trailers: null,
    trucks: null,
    showDialog: false,
    dialogLoaded: false,
    truckRadio: false,
    showMap: false,
    pos: null,
    saveButton: true,
    tid: '',
    tname: '',
    truckid: '',
    msg: '',
    trailerLoc: null,
    reserving: null
  }),
  methods: {
    searchOnTable () {
      this.searched = searchByName(this.trailers, this.search)
    },
    onSelect (item) {
      this.loaded = true
      this.tid = item.id
      this.tname = item.name
      axios.post('http://logistics-api.eu-4.evennode.com/graphql', {
        query: `mutation{ addTempTrailer(id:` + this.tid + `, user:"` + this.$session.get('creds').login + `"){ id user } }`
      }).then(response => {
        if (response.data.data && !response.data.errors) {
          this.trailerLoc = {'lat': parseFloat(item.lat), 'lng': parseFloat(item.lng)}
          this.showDialog = true
        } else {
          this.msg = 'Choosen trailer is now reserving by other dispatcher'
          this.reserving = true
        }
        this.loaded = false
      })
    },
    dialogClose () {
      axios.post('http://logistics-api.eu-4.evennode.com/graphql', {
        query: `mutation{ deleteTempTrailer(id:` + this.tid + `){ id user } }`
      })
      this.searchTruckInput = null
      this.showMap = false
      this.trucks = null
      this.truckRadio = null
      this.saveButton = true
      this.showDialog = false
    },
    searchTruck () {
      this.dialogLoaded = true
      axios.post('http://logistics-api.eu-4.evennode.com/graphql', {
        query: `{ truck(label:` + this.searchTruckInput + `){ id label isAvailable } }`
      }).then(response => {
        if (this.showDialog === false) {
          this.dialogLoaded = false
        } else {
          this.trucks = response.data.data.truck
          this.dialogLoaded = false
          this.pos = null
        }
      })
    },
    onRadioSelect (id) {
      this.dialogLoaded = true
      axios.post('http://logistics-api.eu-4.evennode.com/graphql', {
        query: `{ location(truckid:` + id + `){ lat:latitude lng:longitude } }`
      }).then(response => {
        this.truckid = id
        this.pos = null
        this.pos = [{position: response.data.data.location[0]}, {position: this.trailerLoc}]
        this.showMap = true
        this.dialogLoaded = false
        this.saveButton = false
      })
    },
    addReserve () {
      alert(this.tid)
      alert(JSON.stringify(this.trailerLoc))
      alert(this.truckid)
      axios.post('http://logistics-api.eu-4.evennode.com/graphql', {
        query: `mutation{ addReserve ( trailerid:` + this.tid + `, lat:"` + this.trailerLoc.lat + `", lng:"` + this.trailerLoc.lng + `", truckid:` + this.truckid + `, user:"` + this.$session.get('creds').login + `" ) { trailerid truckid time }}`
      }).then(response => {
        var res = response.data.data.addReserve
        if (res.trailerid === this.tid && res.truckid === this.truckid && res.time) {
          this.msg = 'Reserved!!!!'
          this.reserving = true
        }
      })
      this.showDialog = false
    },
    tStatus (st) {
      if (st === 'hooked') return 'background-color:red'
      if (st === 'reserved') return 'background-color:yellow; color:black'
      if (st === 'available') return 'background-color:green'
    }
  },
  created () {
    axios.post('http://logistics-api.eu-4.evennode.com/graphql', {
      query: `{ trailers{ address city state name serial id lat lng zip moving movingStartTime stopped stoppedStartTime status} }`
    }).then(response => {
      this.trailers = response.data.data.trailers
      this.searched = this.trailers
      this.loaded = false
    })
  }
}
</script>

<style lang="scss" scoped>
  .md-field {
    max-width: 300px;
  }
  .md-radio {
    display: flex;
  }
</style>
