<template>
    <div>
      <md-progress-bar class="md-accent" md-mode="indeterminate" v-if="loaded"></md-progress-bar>
      <md-tabs class="md-accent" md-alignment="centered">
        <md-tab id="tab-home" md-label="Active">
          <md-table>
            <md-table-row>
              <md-table-head>Reserve ID</md-table-head>
              <md-table-head>Trailer ID</md-table-head>
              <md-table-head>Lat</md-table-head>
              <md-table-head>Lng</md-table-head>
              <md-table-head>Truck ID</md-table-head>
              <md-table-head>Reserved Time</md-table-head>
              <md-table-head>Reserve Expire Time</md-table-head>
              <md-table-head>Status</md-table-head>
              <md-table-head>Actions</md-table-head>
            </md-table-row>
            <md-table-row v-for="ac in activeRes" :key="ac">
              <md-table-cell>{{ ac._id }}</md-table-cell>
              <md-table-cell>{{ ac.trailerid }}</md-table-cell>
              <md-table-cell>{{ ac.lat }}</md-table-cell>
              <md-table-cell>{{ ac.long }}</md-table-cell>
              <md-table-cell>{{ ac.truckid }}</md-table-cell>
              <md-table-cell>{{ ac.reserved }}</md-table-cell>
              <md-table-cell>{{ ac.time }}</md-table-cell>
              <md-table-cell>{{ ac.status }}</md-table-cell>
              <md-table-cell style="width:15%">
              <md-button class="md-icon-button md-raised" @click="hookup(ac._id)">
                <md-icon>rv_hookup</md-icon>
              </md-button>
              <md-button class="md-icon-button md-raised" @click="release(ac._id,ac.trailerid,ac.truckid)">
                <md-icon>clear</md-icon>
              </md-button>
              </md-table-cell>
            </md-table-row>
          </md-table>
        </md-tab>
        <md-tab id="tab-pages" md-label="Hooked">
          <md-table>
            <md-table-row>
              <md-table-head>Reserve ID</md-table-head>
              <md-table-head>Trailer ID</md-table-head>
              <md-table-head>Lat</md-table-head>
              <md-table-head>Lng</md-table-head>
              <md-table-head>Truck ID</md-table-head>
              <md-table-head>Reserved Time</md-table-head>
              <md-table-head>Reserve Expire Time</md-table-head>
              <md-table-head>Status</md-table-head>
            </md-table-row>
            <md-table-row v-for="ac in hookedRes" :key="ac">
              <md-table-cell>{{ ac._id }}</md-table-cell>
              <md-table-cell>{{ ac.trailerid }}</md-table-cell>
              <md-table-cell>{{ ac.lat }}</md-table-cell>
              <md-table-cell>{{ ac.long }}</md-table-cell>
              <md-table-cell>{{ ac.truckid }}</md-table-cell>
              <md-table-cell>{{ ac.reserved }}</md-table-cell>
              <md-table-cell>{{ ac.time }}</md-table-cell>
              <md-table-cell>{{ ac.status }}</md-table-cell>
            </md-table-row>
          </md-table>
        </md-tab>
        <md-tab id="tab-posts" md-label="History"></md-tab>
      </md-tabs>
    </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Reserves',
  data: () => ({
    url: 'http://localhost:3000/graphql',
    activeRes: null,
    hookedRes: null,
    loaded: true
  }),
  methods: {
    hookup (id) {
      this.loaded = true
      axios.post(this.url, {
        query: `mutation{ hook(_id:"` + id + `"){ _id status }}`
      }).then(response => {
        alert(JSON.stringify(response.data))
        this.dataFetch()
      })
    },
    release (id, trailerid, truckid) {
      this.loaded = true
      alert(id)
      axios.post(this.url, {
        query: `mutation { freeReserve(_id:"` + id + `",trailerid:` + trailerid + `, truckid: ` + truckid + `){ _id } }`
      }).catch(e => {
        console.log(e)
      })
      this.dataFetch()
    },
    dataFetch () {
      this.activeRes = null
      this.hookedRes = null
      axios.post(this.url, {
        query: `{ userActiveReserves(user:"` + this.$session.get('creds').login + `"){ _id trailerid reserved lat long time truckid user status }}`
      }).then(response => {
        if (response.data.data.userActiveReserves.length > 0) {
          this.activeRes = response.data.data.userActiveReserves
        }
        axios.post(this.url, {
          query: `{ userHookedReserves(user:"` + this.$session.get('creds').login + `"){ _id trailerid reserved lat long time truckid user status }}`
        }).then(response => {
          if (response.data.data.userHookedReserves.length > 0) {
            this.hookedRes = response.data.data.userHookedReserves
          }
        })
        this.loaded = false
      })
    }
  },
  created () {
    this.dataFetch()
  }
}
</script>
