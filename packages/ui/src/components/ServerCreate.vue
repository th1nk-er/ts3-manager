<template>
  <v-container>
    <v-layout justify-center>
      <v-flex lg6 md8 sm8 xs12>
        <v-card>
          <v-card-title>{{ $t("common.create") }} {{ $t("entity.server") }}</v-card-title>
          <v-card-text>
            <v-form v-model="valid">
              <v-layout justify-space-between wrap>
                <v-flex xs12>
                  <v-text-field v-model="serverName" :label="$t('common.name')" :disabled="$store.state.query.loading" :rules="[rules.required]"></v-text-field>
                </v-flex>
                <v-flex xs12 md4>
                  <v-text-field v-model="serverPort" :label="$t('login.port')" type="number" :disabled="$store.state.query.loading" :rules="[rules.required]"></v-text-field>
                </v-flex>
                <v-flex xs12 md4>
                  <v-text-field v-model="maxClients" :label="$t('createServer.maxClients')" type="number" :disabled="$store.state.query.loading" :rules="[rules.required]"></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <key-text-field v-model="token" :label="$t('createServer.generatedToken')"></key-text-field>
                </v-flex>
              </v-layout>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="createServer" :disabled="!valid" color="primary">{{ $t("common.create") }}</v-btn>
            <v-btn text @click="$router.go(-1)" color="primary">{{ $t("common.close") }}</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  components: {
    KeyTextField: () => import("@/components/KeyTextField"),
  },
  data() {
    return {
      valid: false,
      servers: [],
      serverName: "",
      serverPort: undefined,
      maxClients: 32,
      rules: {
        required: (value) => !!value || this.$t("common.required"),
      },
      token: "",
    };
  },
  methods: {
    getServerList() {
      return this.$TeamSpeak.execute("serverlist");
    },
    getAvailablePort() {
      return Math.max(...this.servers.map((server) => server.virtualserverPort)) + 1;
    },
    async createServer() {
      try {
        let [response] = await this.$TeamSpeak.execute("servercreate", {
          virtualserverName: this.serverName,
          virtualserverPort: this.serverPort,
          virtualserverMaxclients: this.maxClients,
        });

        this.token = response.token;

        this.$toast.success(this.$t("feedback.serverCreated"));

        await this.$TeamSpeak.selectServer(response.sid);
      } catch (err) {
        this.$toast.error(err.message);
      }
    },
  },
  async created() {
    try {
      this.servers = await this.getServerList();
      this.serverPort = this.getAvailablePort();
    } catch (err) {
      this.$toast.error(err.message);
    }
  },
};
</script>
