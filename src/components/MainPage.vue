<template>
  <div class="page-container md-layout-column" style="height:100vh !important min-height:100%">
    <md-toolbar class="md-primary">
      <md-button class="md-icon-button" @click="showNavigation = true">
        <md-icon>menu</md-icon>
      </md-button>
      <span class="md-title">My Title</span>
      <div class="md-toolbar-section-end">
        <md-button @click="showSidepanel = true" class="md-icon-button md-dense md-accent">
          <md-icon class="md-size-2x">account_circle</md-icon>
        </md-button>
      </div>
    </md-toolbar>
      <md-drawer :md-active.sync="showNavigation">
      <md-toolbar class="md-transparent" md-elevation="0">
        <span class="md-title">My App name</span>
      </md-toolbar>

      <md-list>
        <md-list-item to="/page">
          <md-icon>dashboard</md-icon>
          <span class="md-list-item-text">Dashboard</span>
        </md-list-item>

        <md-list-item>
          <md-icon>payment</md-icon>
          <span class="md-list-item-text">Payments</span>
        </md-list-item>

        <md-list-item>
          <md-icon>history</md-icon>
          <span class="md-list-item-text">Payments History</span>
        </md-list-item>

        <md-list-item>
          <md-icon>money</md-icon>
          <span class="md-list-item-text">Deposits</span>
        </md-list-item>

        <md-list-item>
          <md-icon>attach_money</md-icon>
          <span class="md-list-item-text">Currency</span>
        </md-list-item>
      </md-list>
    </md-drawer>
        <md-drawer class="md-right" :md-active.sync="showSidepanel">
      <md-card>
      <md-card-media>
        <md-icon class="md-size-2x">account_circle</md-icon>
      </md-card-media>

      <md-card-header>
        <div class="md-title">User name</div>
        <div class="md-subhead">@User_id</div>
      </md-card-header>
      <md-card-area>
      <md-list>
        <md-list-item to="/phone">Change phone number</md-list-item>
        <md-list-item to="/password">Change password</md-list-item>
        <md-list-item @click="logout">
          Exit
          <md-icon class="color:red">exit_to_app</md-icon>
        </md-list-item>
      </md-list>
      </md-card-area>
    </md-card>
    </md-drawer>
      <first v-if="page == '/page'"></first>
      <phone v-if="page == '/phone'"></phone>
      <password v-if="page == '/password'"></password>
  </div>
</template>

<script>
import First from './views/First.vue'
// import Phone from './views/Phone.vue'
// import Password from './views/Password.vue'

export default {
  name: 'Temporary',
  data: () => ({
    showNavigation: false,
    showSidepanel: false,
    page: '/page'
  }),
  beforeCreate: function () {
    if (!this.$session.exists()) {
      this.$router.push('/')
    }
  },
  watch: {
    $route (to, from, next) {
      this.page = to.path
      this.showNavigation = false
      this.showSidepanel = false
    }
  },
  methods: {
    logout: function () {
      this.$session.destroy()
      this.$router.push('/')
    }
  },
  components: {
    First
    // Phone,
    // Password
  }
}
</script>

<style lang="scss" scoped>
  .page-container {
    min-height: 300px;
    overflow: hidden;
    position: relative;
    border: 1px solid rgba(#000, .12);
  }

   // Demo purposes only
  .md-drawer {
    width: 230px;
    max-width: calc(100vw - 125px);
  }

  .md-content {
    padding: 16px;
  }
  .md-list {
    width: 320px;
    max-width: 100%;
    display: inline-block;
    vertical-align: top;
    border: 1px solid rgba(#000, .12);
  }
</style>
