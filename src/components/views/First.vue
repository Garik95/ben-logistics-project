<template>
  <div>
    <md-dialog :md-active.sync="showDialog">
      <md-dialog-title>Reserve Trailer: {{ tid }} - {{ tname }}</md-dialog-title>

      <md-tabs md-dynamic-height>
      </md-tabs>

      <md-dialog-actions>
        <md-button class="md-primary" @click="showDialog = false">Close</md-button>
        <md-button class="md-primary" @click="showDialog = false">Save</md-button>
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
        <md-table-cell md-label="Status" md-sort-by="status" md-numeric><md-avatar class="md-avatar-icon md-small" style="color:green">A</md-avatar></md-table-cell>
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
    loaded: true,
    searched: [],
    trailers: null,
    showDialog: false,
    tid: '',
    tname: ''
    // selectedTrailer: null
  }),
  methods: {
    searchOnTable () {
      this.searched = searchByName(this.trailers, this.search)
    },
    onSelect (item) {
      this.showDialog = true
      this.tid = item.id
      this.tname = item.name
      // alert(item.id)
      // this.selected = item
    }
  },
  created () {
    axios.post('http://logistics-api.eu-4.evennode.com/graphql', {
      query: `{ trailers{ address city state name serial id lat lng zip moving movingStartTime stopped stoppedStartTime } }`
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
</style>
