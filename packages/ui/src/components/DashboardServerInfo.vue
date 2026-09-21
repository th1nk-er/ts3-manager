<template lang="html">
  <v-card>
    <v-card-title>{{ serverInfo.virtualserverName }}</v-card-title>
    <v-card-text>
      <v-list>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>{{ $t('misc.ipAddress') }}:</v-list-item-title>
          </v-list-item-content>
          <v-list-item-action>
            {{ serverInfo.virtualserverIp }}
          </v-list-item-action>
        </v-list-item>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>{{ $t('misc.version') }}:</v-list-item-title>
          </v-list-item-content>
          <v-list-item-action>{{
            serverInfo.virtualserverVersion
          }}</v-list-item-action>
        </v-list-item>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>{{ $t('misc.uptime') }}:</v-list-item-title>
          </v-list-item-content>
          <v-list-item-action>{{
            serverInfo.virtualserverUptime
          }}</v-list-item-action>
        </v-list-item>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>{{ $t('misc.platform') }}:</v-list-item-title>
          </v-list-item-content>
          <v-list-item-action>{{
            serverInfo.virtualserverPlatform
          }}</v-list-item-action>
        </v-list-item>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>{{ $t('misc.downloaded') }}:</v-list-item-title>
          </v-list-item-content>
          <v-list-item-action>{{
            serverInfo.virtualserverTotalBytesDownloaded
          }}</v-list-item-action>
        </v-list-item>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>{{ $t('misc.uploaded') }}:</v-list-item-title>
          </v-list-item-content>
          <v-list-item-action>{{
            serverInfo.virtualserverTotalBytesUploaded
          }}</v-list-item-action>
        </v-list-item>
      </v-list>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: {
    serverInfo: {
      type: Object,
      default() {
        return {};
      },
    },
  },
};
</script>

<style lang="css" scoped></style>
