<template>
  <v-container>
    <v-layout>
      <v-flex xs12>
        <v-card>
          <v-card-title>
            <v-layout wrap justify-space-between>
              <v-flex sm6 xs12>
                <v-btn color="error" :disabled="!Boolean(selectedTableItems.length)" @click="openRemoveDialog(selectedTableItems)">
                  <v-icon left>delete</v-icon>
                  {{ $t("apiKey.remove") }}
                </v-btn>
              </v-flex>
              <v-flex md4 sm6 xs12>
                <v-text-field append-icon="search" :label="$t('common.search')" v-model="search"></v-text-field>
              </v-flex>
            </v-layout>
          </v-card-title>
          <v-card-text>
            <v-data-table
              :no-data-text="$store.state.query.loading ? $t('common.loadingTable') : $vuetify.noDataText"
              :headers="headers"
              :items="clientdblist"
              :search="search"
              :footer-props="{ 'items-per-page-options': rowsPerPage }"
              v-model="selectedTableItems"
              show-select
              item-key="cldbid"
            >
              <template #item.name="{ item }">
                <v-menu>
                  <template #activator="{ on, attrs }">
                    <v-btn icon v-bind="attrs" v-on="on">
                      <v-icon>mdi-dots-vertical</v-icon>
                    </v-btn>
                  </template>
                  <v-list>
                    <v-list-item :to="`/client/${item.cldbid}/ban`">
                      <v-list-item-title>{{ $t("action.banClient") }}</v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="openRemoveDialog([item])">
                      <v-list-item-title>{{ $t("action.deleteClient") }}</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </template>
              <template #item.clientCreated="{ item }">
                {{ new Date(item.clientCreated * 1000).toLocaleString($i18n.locale) }}
              </template>
              <template #item.clientLastconnected="{ item }">
                {{ new Date(item.clientLastconnected * 1000).toLocaleString($i18n.locale) }}
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-dialog max-width="500px" v-model="dialog">
        <v-card>
          <v-card-title>{{ $t("action.deleteClient") }}</v-card-title>
          <v-card-text>
            <template v-if="clientRemoveList.length === 1">
              {{ $t("action.deleteClient") }} <b>{{ clientRemoveList[0].clientNickname }}</b
              >?
            </template>
            <template v-else>{{ $t("confirm.deleteClients") }}</template>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="dialog = false" color="primary">{{ $t("common.no") }}</v-btn>
            <v-btn text @click="deleteClient" color="primary">{{ $t("common.yes") }}</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      headers: [
        {
          text: "",
          value: "name",
          align: "start",
          sortable: false,
        },
        {
          text: this.$t("entity.nickname"),
          value: "clientNickname",
        },
        {
          text: this.$t("entity.uniqueId"),
          value: "clientUniqueIdentifier",
        },
        {
          text: this.$t("table.created"),
          value: "clientCreated",
        },
        {
          text: this.$t("table.last"),
          value: "clientLastconnected",
        },
        {
          text: this.$t("table.total"),
          value: "clientTotalconnections",
        },
        {
          text: this.$t("table.lastIp"),
          value: "clientLastip",
        },
        {
          text: this.$t("common.description"),
          value: "clientDescription",
        },
      ],
      clientdblist: [],
      search: "",
      rowsPerPage: [25, 50, 75, -1],
      dialog: false,
      clientRemoveList: [],
      selectedTableItems: [],
      clientAvatarDialog: false,
    };
  },
  methods: {
    openRemoveDialog(clients) {
      this.clientRemoveList = clients;

      this.dialog = true;
    },
    getClientDbList() {
      return this.$TeamSpeak.fullClientDBList();
    },
    async deleteClient() {
      try {
        for (let client of this.clientRemoveList) {
          await this.$TeamSpeak.execute("clientdbdelete", {
            cldbid: client.cldbid,
          });
        }
      } catch (err) {
        this.$toast.error(err.message);
      }

      // v-model is not updating correctly when the content of the table changes.
      // Removed content is still in the selectedTableItems array.
      // This is a workaround for this vuetify bug.
      this.selectedTableItems = [];

      this.dialog = false;

      this.init();
    },
    async init() {
      try {
        this.clientdblist = await this.getClientDbList();
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
