<template>
  <v-container>
    <v-layout align-center justify-center fill-height>
      <v-flex xs12 sm8 md6 lg5 xl4>
        <v-card>
          <v-card-title></v-card-title>
          <v-card-text>
            <v-form v-model="valid">
              <v-layout justify-space-between wrap>
                <v-flex xs6>
                  <v-text-field :label="$t('login.server')" :placeholder="$t('login.hostPlaceholder')" v-model="form.host" :rules="[rules.required]"></v-text-field>
                </v-flex>
                <v-flex xs2>
                  <v-text-field :label="$t('login.port')" type="number" v-model="form.queryport" :rules="[rules.required]"></v-text-field>
                </v-flex>
                <v-flex xs3>
                  <v-checkbox v-model="form.ssh" label="SSH">
                    <template #append>
                      <v-tooltip bottom>
                        <template #activator="{ on }">
                          <v-icon v-on="on">mdi-help-circle-outline</v-icon>
                        </template>
                        <span>{{ $t("login.sshHelp") }}</span>
                      </v-tooltip>
                    </template>
                  </v-checkbox>
                </v-flex>
                <v-flex xs12>
                  <v-text-field
                    :label="$t('login.username')"
                    v-model="form.username"
                    :rules="[rules.required]"
                    :placeholder="$t('login.usernamePlaceholder')"
                    name="username"
                    autocomplete="username"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field :label="$t('common.password')" type="password" v-model="form.password" :rules="[rules.required]" name="password" autocomplete="current-password"></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-checkbox :label="$t('login.rememberMe')" v-model="rememberLogin"></v-checkbox>
                </v-flex>
              </v-layout>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text color="primary" :disabled="!valid" @click="connect" :loading="loading">
              <v-icon>arrow_forward</v-icon>{{ $t("common.connect") }}
              <template #loader>
                <span>{{ $t("common.connecting") }}</span>
              </template>
            </v-btn>
          </v-card-actions>
          <span :style="{ color: '#BDBDBD', marginLeft: '5px' }">{{ $t("login.version") }} {{ appVersion }}</span>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { version } from "../../../../package.json";

export default {
  beforeRouteEnter(to, from, next) {
    next(async (vm) => {
      let token = vm.$store.state.query.token;

      vm.$store.commit("isLoggedOut", true);

      if (!token) return;

      vm.$socket.emit("autofillform", token, (response) => {
        if (response.host) {
          vm.form.host = response.host;
          vm.form.queryport = response.queryport;
          vm.form.ssh = response.protocol === "ssh" ? true : false;
          vm.form.username = response.username;
          vm.form.password = response.password;
        } else {
          vm.$store.dispatch("removeToken");

          vm.$toast.error(response);
        }
      });
    });
  },
  data() {
    return {
      panel: [true],
      valid: false,
      loading: false,
      rules: {
        required: (value) => !!value || this.$t("common.required"),
      },
      form: {
        host: "",
        queryport: 10022,
        ssh: true,
        username: "",
        password: "",
      },
      appVersion: version,
    };
  },
  computed: {
    rememberLogin: {
      set(value) {
        this.$store.commit("setRememberLogin", value);
      },
      get() {
        return this.$store.state.settings.rememberLogin;
      },
    },
  },
  methods: {
    connectTeamSpeak(credentials) {
      return this.$TeamSpeak.connect(credentials);
    },
    async connect() {
      this.loading = true;

      try {
        let { token } = await this.connectTeamSpeak({
          host: this.form.host,
          queryport: this.form.queryport,
          protocol: this.form.ssh ? "ssh" : "raw",
          username: this.form.username,
          password: this.form.password,
        });

        this.$store.dispatch("saveToken", token);
        this.$store.commit("isConnected", true);
        this.$store.commit("isLoggedOut", false);

        this.$router.push({ name: "servers" });
      } catch (err) {
        this.$toast.error(err.message);
      }

      this.loading = false;
    },
  },
  watch: {
    "form.ssh"(ssh) {
      ssh ? (this.form.queryport = 10022) : (this.form.queryport = 10011);
    },
  },
};
</script>

<style>
.v-expansion-panel__header {
  padding: 0 !important;
}
</style>
