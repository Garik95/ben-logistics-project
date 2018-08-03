<template>
  <div>
    <img src="../assets/logo.png">
    <form novalidate class="md-layout md-alignment-space-between-center " @submit.prevent="validateUser">
      <md-card class="md-layout-item md-size-25 md-small-size-100">
        <md-card-header>
          <div class="md-title">Enter</div>
        </md-card-header>

        <md-card-content>
          <div class="md-layout md-gutter">
            <div class="md-layout-item md-small-size-100">
              <md-field :class="getValidationClass('firstName')">
                <label for="first-name">First Name</label>
                <md-input name="first-name" id="first-name" autocomplete="given-name" v-model="form.firstName" :disabled="sending" />
                <span class="md-error" v-if="!$v.form.firstName.required">The first name is required</span>
                <span class="md-error" v-else-if="!$v.form.firstName.minlength">Invalid first name</span>
              </md-field>
            </div>
          </div>
          <div class="md-layout md-gutter">
            <div class="md-layout-item md-small-size-100">
              <md-field :class="getValidationClass('password')" :md-toggle-password="true">
                <label for="password">Password</label>
                <md-input type="password" v-model="form.password" :disabled="sending"></md-input>
                <span class="md-error" v-if="!$v.form.password.required">The password is required</span>
                <span class="md-error" v-else-if="!$v.form.password.minlength">Password length error</span>
              </md-field>
            </div>
          </div>
        </md-card-content>

        <md-progress-bar md-mode="indeterminate" v-if="sending" />

        <md-card-actions>
          <md-button type="submit" class="md-raised md-primary" :disabled="sending">Login</md-button>
        </md-card-actions>
      </md-card>

      <md-snackbar :md-active.sync="userSaved">{{ msg }}</md-snackbar>
    </form>
  </div>
</template>

<script>
import { validationMixin } from 'vuelidate'
import router from '../router'

import {
  required,
  minLength
} from 'vuelidate/lib/validators'
import axios from 'axios'

export default {
  name: 'FormValidation',
  mixins: [validationMixin],
  data: () => ({
    form: {
      firstName: null,
      password: null
    },
    userSaved: false,
    sending: false,
    lastUser: null,
    msg: null
  }),
  validations: {
    form: {
      firstName: {
        required,
        minLength: minLength(3)
      },
      password: {
        required,
        minLength: minLength(3)
      }
    }
  },
  beforeCreate: function () {
    if (this.$session.exists()) {
      this.$router.push('/page')
    }
  },
  methods: {
    getValidationClass (fieldName) {
      const field = this.$v.form[fieldName]
      if (field) {
        return {
          'md-invalid': field.$invalid && field.$dirty
        }
      }
    },
    clearForm () {
      this.$v.$reset()
      this.form.firstName = null
      this.form.password = null
    },
    saveUser () {
      this.sending = true
      // Instead of this timeout, here you can call your API

      axios.post(`http://logistics-api.eu-4.evennode.com/graphql`,
        {
          query: `{user(login:"` + this.form.firstName + `",password:"` + this.form.password + `"){first_name last_name login}}`
        }).then(response => {
        if (response.data.data.user.length > 0 && response.data.data.user[0].login === this.form.firstName) {
          this.msg = `Authenticating...`
          this.$session.start()
          // this.$session.set('jwt', response.body.token)
          // Vue.http.headers.common['Authorization'] = 'Bearer ' + response.body.token
          this.userSaved = true
          this.sending = false
          router.push('/page')
        } else {
          this.msg = `The user was not found`
          this.userSaved = true
          this.sending = false
          this.clearForm()
        }
      })
    },
    validateUser () {
      this.$v.$touch()
      if (!this.$v.$invalid) {
        this.saveUser()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .md-progress-bar {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
  }
</style>
