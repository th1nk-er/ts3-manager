<template>
  <div>
    <v-app-bar app>
      <v-app-bar-nav-icon
        @click="drawer = !drawer"
        v-if="connected"
      ></v-app-bar-nav-icon>
      <v-spacer></v-spacer>
      <v-menu offset-y open-on-hover>
        <template #activator="{ on, attrs }">
          <v-btn
            icon
            v-bind="attrs"
            v-on="on"
            :aria-label="$t('locale.label')"
          >
            <v-icon>mdi-translate</v-icon>
          </v-btn>
        </template>
        <v-card class="locale-menu-card">
          <v-list dense nav>
            <v-list-item
              v-for="option in localeOptions"
              :key="option.value"
              :input-value="option.value === $i18n.locale"
              class="locale-option"
              :class="{
                'locale-option--active': option.value === $i18n.locale,
              }"
              @click="$emit('locale-change', option.value)"
            >
              <v-list-item-content>
                <v-list-item-title>{{ option.text }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card>
      </v-menu>
      <dark-mode-switch></dark-mode-switch>
      <file-upload-icon v-if="connected"></file-upload-icon>
      <bell-icon v-if="connected"></bell-icon>
    </v-app-bar>

    <v-navigation-drawer app v-model="drawer" v-if="connected" width="300">
      <v-list dense class="pt-2" subheader nav>
        <logo></logo>
        <v-divider></v-divider>

        <!-- Avoid v-if with v-for https://v3.vuejs.org/style-guide/#avoid-v-if-with-v-for-essential -->
        <template v-for="(entry, i) in menuEntries">
          <v-list-item
            :key="i"
            v-if="!entry.submenu"
            @click="pushRoute(entry)"
            :class="{ 'v-list-item--active': $route.name === entry.route.name }"
          >
            <v-list-item-icon>
              <v-badge
                color="error"
                :value="entry.titleKey === 'navigation.chat' && $store.getters.unreadMessages"
              >
                <template #badge>
                  <span>{{ $store.getters.unreadMessages }}</span>
                </template>
                <v-icon>{{ entry.icon }}</v-icon>
              </v-badge>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>
                {{ $t(entry.titleKey) }}
                <v-icon v-if="entry.experimental">mdi-test-tube</v-icon>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-group v-else :key="i" no-action :prepend-icon="entry.icon">
            <template #activator>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>
                    {{ $t(entry.titleKey) }}
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>
            <v-list-item
              v-for="(subEntry, j) in entry.submenu"
              :key="j"
              @click="pushRoute(subEntry)"
              :class="{
                'v-list-item--active': $route.name === subEntry.route.name,
              }"
            >
              <v-list-item-icon>
                <v-icon>{{ subEntry.icon }}</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>
                  {{ $t(subEntry.titleKey) }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
        </template>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
export default {
  components: {
    DarkModeSwitch: () => import("@/components/DarkModeSwitch"),
    BellIcon: () => import("@/components/BellIcon"),
    FileUploadIcon: () => import("@/components/FileUploadIcon"),
    Logo: () => import("@/components/Logo"),
    ServerSelection: () => import("@/components/ServerSelection"),
  },
  data() {
    return {
      mini: true,
      drawer: null,
      menuEntries: [
        {
          titleKey: "navigation.serverList",
          icon: "dns",
          route: { name: "servers" },
        },
        {
          titleKey: "navigation.serverViewer",
          icon: "remove_red_eye",
          route: { name: "serverviewer" },
        },
        {
          titleKey: "navigation.chat",
          icon: "mail_outline",
          route: { name: "chat" },
        },
        {
          titleKey: "navigation.fileBrowser",
          icon: "mdi-folder",
          route: { name: "files" },
        },
        {
          titleKey: "navigation.serverLog",
          icon: "mdi-file-document-outline",
          route: { name: "logs" },
        },
        {
          titleKey: "navigation.backupRestore",
          icon: "settings_backup_restore",
          route: { name: "snapshot" },
        },
        {
          titleKey: "navigation.serverQuery",
          icon: "mdi-console",
          route: { name: "console" },
        },
        {
          titleKey: "navigation.privilegeKeys",
          icon: "mdi-key",
          route: { name: "tokens" },
        },
        {
          titleKey: "navigation.apiKeys",
          icon: "mdi-shield-key",
          route: { name: "apikeys" },
        },
        {
          titleKey: "navigation.banList",
          icon: "not_interested",
          route: { name: "bans" },
        },
        {
          titleKey: "navigation.complaintsList",
          icon: "warning",
          route: { name: "complaints" },
        },

        {
          titleKey: "navigation.clients",
          icon: "person",
          route: { name: "clients" },
        },
        {
          titleKey: "navigation.serverGroups",
          icon: "group",
          route: { name: "servergroups" },
        },
        {
          titleKey: "navigation.channelGroups",
          icon: "mdi-hexagon-slice-4",
          route: { name: "channelgroups" },
        },
        {
          titleKey: "navigation.permissions",
          icon: "mdi-format-section",
          submenu: [
            {
              titleKey: "navigation.serverGroup",
              icon: "group",
              route: { name: "permissions-servergroup" },
            },
            {
              titleKey: "navigation.clientPermissions",
              icon: "person",
              route: { name: "permissions-client" },
            },
            {
              titleKey: "navigation.channelPermissions",
              icon: "mdi-hexagon-slice-4",
              route: { name: "permissions-channel" },
            },
            {
              titleKey: "navigation.channelGroups",
              icon: "mdi-hexagon-slice-4",
              route: { name: "permissions-channelgroup" },
            },
            {
              titleKey: "navigation.channelClientPermissions",
              icon: "mdi-hexagon-slice-4",
              route: { name: "permissions-channelclient" },
            },
          ],
        },
        {
          titleKey: "navigation.logout",
          icon: "exit_to_app",
          route: { name: "logout" },
        },
      ],
    };
  },
  computed: {
    localeOptions() {
      return [
        { value: "en", text: this.$t("locale.en") },
        { value: "zh-CN", text: this.$t("locale.zhCN") },
        { value: "zh-TW", text: this.$t("locale.zhTW") },
      ];
    },
    connected() {
      return this.$store.state.query.connected;
    },
  },
  methods: {
    pushRoute(entry) {
      if (entry.route.name !== this.$route.name) {
        this.$router.push(entry.route);
      }
    },
  },
};
</script>

<style scoped>
.locale-menu-card {
  min-width: 160px;
  border: 1px solid rgba(255, 255, 255, 0.18) !important;
}

.locale-option--active,
.locale-option:hover {
  color: var(--v-primary-base);
}
</style>
