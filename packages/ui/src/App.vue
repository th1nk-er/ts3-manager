<template>
  <v-app>
    <app-shell @locale-change="setLocale"></app-shell>
    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
export default {
  components: {
    AppShell: () => import("@/components/AppShell"),
  },
  methods: {
    setLocale(locale) {
      this.$i18n.locale = locale;
      this.$vuetify.lang.current = locale;
      document.documentElement.lang = locale;
      this.$store.commit("setLocale", locale);
      const title = this.$t("app.title");
      document.title = this.$store.getters.unreadMessages
        ? `(${this.$store.getters.unreadMessages}) ${title}`
        : title;
    },
    handleReceivedMessages(e) {
      this.$store.dispatch("handleReceivedMessages", e.detail);
    },
    async updateQueryUserData(e) {
      let client = e && e.detail && e.detail.client;

      if (!client || client.clid === undefined) return;

      try {
        if (client.clid === this.$store.state.query.queryUser.clientId) {
          let queryUser = await this.$TeamSpeak
            .execute("whoami")
            .then((list) => list[0]);

          this.$store.commit("saveUserInfo", queryUser);
        }
      } catch (err) {
        this.$toast.error(err.message);
      }
    },
    addNotificationListeners() {
      this.$TeamSpeak.on("textmessage", this.handleReceivedMessages);
      this.$TeamSpeak.on("clientmoved", this.updateQueryUserData);
    },
  },
  created() {
    this.setLocale(this.$i18n.locale);
    this.addNotificationListeners();
  },
  watch: {
    "$store.getters.unreadMessages": {
      immediate: true,
      handler(number) {
        const title = this.$t("app.title");
        document.title = number ? `(${number}) ${title}` : title;
      },
    },
  },
};
</script>
