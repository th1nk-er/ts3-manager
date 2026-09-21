<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="10" lg="6">
        <v-card>
          <v-card-title>
            <v-btn
              color="error"
              :disabled="!selectedKeys.length"
              @click="deleteDialog = true"
            >
              <v-icon left>delete</v-icon>
              {{ $t('apiKey.remove') }}
            </v-btn>
          </v-card-title>
          <v-card-text>
            <v-data-table
              :headers="headers"
              :items="tableItems"
              item-key="id"
              show-select
              v-model="selectedKeys"
            >
              <template #item.clientNickname="{ item }">
                <v-chip>{{ item.clientNickname }} ({{ item.cldbid }})</v-chip>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-btn fab color="primary" fixed bottom right dark @click="addApiKey">
      <v-icon>add</v-icon>
    </v-btn>
    <v-dialog v-model="deleteDialog" max-width="500px">
      <v-card>
        <v-card-title>{{ $t('apiKey.delete') }}</v-card-title>
        <v-card-text>
          {{ $t('apiKey.confirmDelete') }}
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text color="primary" @click="deleteDialog = false">{{ $t('common.no') }}</v-btn>
          <v-btn text color="primary" @click="removeApiKeys">{{ $t('common.yes') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      apiKeys: [],
      dbClients: [],
      selectedKeys: [],
      deleteDialog: false,
    };
  },
  computed: {
    headers() {
      return [
        {
          text: this.$t("entity.client"),
          sortable: true,
          align: "start",
          value: "clientNickname",
        },
        {
          text: this.$t("apiKey.scope"),
          sortable: true,
          align: "start",
          value: "scope",
        },
        {
          text: this.$t("apiKey.createdAt"),
          sortable: true,
          align: "start",
          value: "createdAt",
        },
        {
          text: this.$t("apiKey.expiresAt"),
          sortable: true,
          align: "start",
          value: "expiresAt",
        },
      ];
    },
    tableItems() {
      return this.apiKeys.map((key) => {
        let client = this.dbClients.find(
          (client) => client.cldbid === key.cldbid
        );

        return {
          id: key.id,
          clientNickname: client ? client.clientNickname : "serveradmin",
          cldbid: key.cldbid,
          scope: key.scope,
          createdAt: new Date(key.createdAt * 1000).toLocaleString(this.$i18n.locale),
          expiresAt: new Date(key.expiresAt * 1000).toLocaleString(this.$i18n.locale),
        };
      });
    },
  },
  methods: {
    addApiKey() {
      this.$router.push({ name: "apikey-add" });
    },
    getApiKeys() {
      return this.$TeamSpeak.execute("apikeylist", {
        cldbid: "*",
      });
    },
    getDbClients() {
      return this.$TeamSpeak.fullClientDBList();
    },
    async removeApiKeys() {
      try {
        for (let key of this.selectedKeys) {
          await this.$TeamSpeak.execute("apikeydel", { id: key.id });
        }

        this.deleteDialog = false;
      } catch (err) {
        this.$toast.error(err.message);
      }

      // v-model is not updating correctly when the content of the table changes.
      // Removed content is still in the selectedKeys array.
      // This is a workaround for this vuetify bug.
      this.selectedKeys = [];

      this.init();
    },
    async init() {
      try {
        this.apiKeys = await this.getApiKeys();
        this.dbClients = await this.getDbClients();
      } catch (err) {
        this.$toast.error(err.message);
      }
    },
  },
  created() {
    this.init();
  },
};
</script>
