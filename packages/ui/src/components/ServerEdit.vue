<template lang="html">
  <v-container>
    <v-layout justify-center>
      <v-flex lg6 md8 sm8 xs12>
        <v-card>
          <v-card-title>{{ $t('serverSettings.manage') }}</v-card-title>
          <v-card-text>
            <v-text-field
              :label="$t('serverSettings.name')"
              v-model="serverInfo.virtualserverName"
              :disabled="$store.state.query.loading"
            ></v-text-field>
            <v-text-field
              :label="$t('common.password')"
              v-model="serverInfo.virtualserverPassword"
              :disabled="$store.state.query.loading"
              type="password"
            ></v-text-field>
            <v-layout justify-space-between>
              <v-flex xs5>
                <v-text-field
                  :label="$t('serverSettings.maximumClients')"
                  v-model="serverInfo.virtualserverMaxclients"
                  :disabled="$store.state.query.loading"
                  type="number"
                ></v-text-field>
              </v-flex>
              <v-flex xs5>
                <v-text-field
                  :label="$t('serverSettings.reservedSlots')"
                  v-model="serverInfo.virtualserverReservedSlots"
                  :disabled="$store.state.query.loading"
                  type="number"
                ></v-text-field>
              </v-flex>
            </v-layout>
            <v-textarea
              :label="$t('serverSettings.welcomeMessage')"
              v-model="serverInfo.virtualserverWelcomemessage"
              :disabled="$store.state.query.loading"
            ></v-textarea>

            <v-expansion-panels accordion flat>
              <v-expansion-panel>
                <v-expansion-panel-header>{{ $t('serverSettings.host') }}</v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-card outlined>
                    <v-card-subtitle>{{ $t('hostSettings.message') }}</v-card-subtitle>
                    <v-card-text>
                      <v-text-field
                        :label="$t('log.message')"
                        v-model="serverInfo.virtualserverHostmessage"
                        :disabled="$store.state.query.loading"
                      ></v-text-field>
                      <v-select
                        :label="$t('hostSettings.messageMode')"
                        v-model="serverInfo.virtualserverHostmessageMode"
                        :items="messageModes"
                      ></v-select>
                    </v-card-text>
                  </v-card>
                  <v-card class="mt-2" outlined>
                    <v-card-subtitle>{{ $t('hostSettings.banner') }}</v-card-subtitle>
                    <v-card-text>
                      <v-text-field
                        :label="$t('hostSettings.bannerUrl')"
                        v-model="serverInfo.virtualserverHostbannerGfxUrl"
                        :disabled="$store.state.query.loading"
                      ></v-text-field>
                      <v-text-field
                        label="URL"
                        v-model="serverInfo.virtualserverHostbannerUrl"
                        :disabled="$store.state.query.loading"
                      ></v-text-field>
                      <v-layout justify-space-between>
                        <v-flex xs4>
                          <v-text-field
                            :label="$t('hostSettings.interval')"
                            v-model="
                              serverInfo.virtualserverHostbannerGfxInterval
                            "
                            type="number"
                            :disabled="$store.state.query.loading"
                          ></v-text-field>
                        </v-flex>
                        <v-flex xs6>
                          <v-select
                            :label="$t('hostSettings.resize')"
                            :items="bannerModes"
                            v-model="serverInfo.virtualserverHostbannerMode"
                          ></v-select>
                        </v-flex>
                      </v-layout>
                    </v-card-text>
                  </v-card>
                  <v-card class="my-2" outlined>
                    <v-card-subtitle>{{ $t('hostSettings.button') }}</v-card-subtitle>
                    <v-card-text>
                      <v-text-field
                        :label="$t('hostSettings.tooltip')"
                        v-model="serverInfo.virtualserverHostbuttonTooltip"
                        :disabled="$store.state.query.loading"
                      ></v-text-field>
                      <v-text-field
                        label="URL"
                        v-model="serverInfo.virtualserverHostbuttonUrl"
                        :disabled="$store.state.query.loading"
                      ></v-text-field>
                      <v-text-field
                        :label="$t('hostSettings.iconUrl')"
                        v-model="serverInfo.virtualserverHostbuttonGfxUrl"
                        :disabled="$store.state.query.loading"
                      ></v-text-field>
                    </v-card-text>
                  </v-card>
                </v-expansion-panel-content>
              </v-expansion-panel>
              <v-expansion-panel>
                <v-expansion-panel-header>{{ $t('serverSettings.transfers') }}</v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-card outlined>
                    <v-card-subtitle>{{ $t('hostSettings.upload') }}</v-card-subtitle>
                    <v-card-text>
                      <v-text-field
                        :label="$t('hostSettings.bandwidth')"
                        v-model="
                          serverInfo.virtualserverMaxUploadTotalBandwidth
                        "
                        :disabled="$store.state.query.loading"
                        type="number"
                      >
                        <template #append>
                          <div>Byte/s</div>
                        </template>
                      </v-text-field>
                      <v-text-field
                        :label="$t('hostSettings.uploadQuota')"
                        v-model="serverInfo.virtualserverUploadQuota"
                        :disabled="$store.state.query.loading"
                        type="number"
                      >
                        <template #append>
                          <div>MiB</div>
                        </template>
                      </v-text-field>
                    </v-card-text>
                  </v-card>
                  <v-card class="my-2" outlined>
                    <v-card-subtitle>{{ $t('hostSettings.download') }}</v-card-subtitle>
                    <v-card-text>
                      <v-text-field
                        :label="$t('hostSettings.bandwidth')"
                        v-model="
                          serverInfo.virtualserverMaxDownloadTotalBandwidth
                        "
                        :disabled="$store.state.query.loading"
                        type="number"
                      >
                        <template #append>
                          <div>Byte/s</div>
                        </template>
                      </v-text-field>
                      <v-text-field
                        :label="$t('hostSettings.downloadQuota')"
                        v-model="serverInfo.virtualserverDownloadQuota"
                        :disabled="$store.state.query.loading"
                        type="number"
                      >
                        <template #append>
                          <div>MiB</div>
                        </template>
                      </v-text-field>
                    </v-card-text>
                  </v-card>
                </v-expansion-panel-content>
              </v-expansion-panel>
              <v-expansion-panel>
                <v-expansion-panel-header>
                  {{ $t('serverAdvanced.antiFlood') }}
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-card class="mb-2" outlined>
                    <v-card-text>
                      <v-text-field
                        :label="$t('serverAdvanced.reducedPoints')"
                        v-model="
                          serverInfo.virtualserverAntifloodPointsTickReduce
                        "
                        :disabled="$store.state.query.loading"
                        type="number"
                      ></v-text-field>
                      <v-text-field
                        :label="$t('serverAdvanced.commandBlockPoints')"
                        v-model="
                          serverInfo.virtualserverAntifloodPointsNeededCommand_block
                        "
                        :disabled="$store.state.query.loading"
                        type="number"
                      ></v-text-field>
                      <v-text-field
                        :label="$t('serverAdvanced.ipBlockPoints')"
                        v-model="
                          serverInfo.virtualserverAntifloodPointsNeededIp_block
                        "
                        :disabled="$store.state.query.loading"
                        type="number"
                      ></v-text-field>
                    </v-card-text>
                  </v-card>
                </v-expansion-panel-content>
              </v-expansion-panel>
              <v-expansion-panel>
                <v-expansion-panel-header>{{ $t('serverSettings.security') }}</v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-card class="mb-2" outlined>
                    <v-card-text>
                      <v-text-field
                        :label="$t('serverAdvanced.neededSecurityLevel')"
                        v-model="
                          serverInfo.virtualserverNeededIdentitySecurityLevel
                        "
                        :disabled="$store.state.query.loading"
                        type="number"
                      ></v-text-field>
                      <v-select
                        :label="$t('serverAdvanced.voiceEncryption')"
                        v-model="serverInfo.virtualserverCodecEncryptionMode"
                        :items="encryptionModes"
                      ></v-select>
                    </v-card-text>
                  </v-card>
                </v-expansion-panel-content>
              </v-expansion-panel>
              <v-expansion-panel>
                <v-expansion-panel-header>{{ $t('serverAdvanced.misc') }}</v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-card outlined>
                    <v-card-subtitle>{{ $t('serverSettings.defaultGroups') }}</v-card-subtitle>
                    <v-card-text>
                      <v-autocomplete
                        :items="serverGroups"
                        item-text="name"
                        item-value="sgid"
                        v-model="serverInfo.virtualserverDefaultServerGroup"
                        :label="$t('entity.serverGroup')"
                        :disabled="$store.state.query.loading"
                      >
                        <template #selection="{ item }">
                          <div>{{ item.name }} ({{ item.sgid }})</div>
                        </template>
                        <template #item="{ item }">
                          <div>{{ item.name }} ({{ item.sgid }})</div>
                        </template>
                      </v-autocomplete>
                      <v-autocomplete
                        :items="channelGroups"
                        item-text="name"
                        item-value="cgid"
                        v-model="serverInfo.virtualserverDefaultChannelGroup"
                        :label="$t('entity.channelGroup')"
                        :disabled="$store.state.query.loading"
                      >
                        <template #selection="{ item }">
                          <div>{{ item.name }} ({{ item.cgid }})</div>
                        </template>
                        <template #item="{ item }">
                          <div>{{ item.name }} ({{ item.cgid }})</div>
                        </template>
                      </v-autocomplete>
                      <v-autocomplete
                        :items="channelGroups"
                        item-text="name"
                        item-value="cgid"
                        v-model="
                          serverInfo.virtualserverDefaultChannelAdminGroup
                        "
                        :label="$t('serverSettings.channelAdminGroup')"
                        :disabled="$store.state.query.loading"
                      >
                        <template #selection="{ item }">
                          <div>{{ item.name }} ({{ item.cgid }})</div>
                        </template>
                        <template #item="{ item }">
                          <div>{{ item.name }} ({{ item.cgid }})</div>
                        </template>
                      </v-autocomplete>
                    </v-card-text>
                  </v-card>
                  <v-card class="mt-2" outlined>
                    <v-card-subtitle>{{ $t('serverAdvanced.complaints') }}</v-card-subtitle>
                    <v-card-text>
                      <v-layout justify-space-between wrap>
                        <v-flex xs5 md3>
                          <v-text-field
                            :label="$t('serverAdvanced.autobanCount')"
                            :disabled="$store.state.query.loading"
                            v-model="
                              serverInfo.virtualserverComplainAutobanCount
                            "
                            type="number"
                          ></v-text-field>
                        </v-flex>
                        <v-flex xs5 md3>
                          <v-text-field
                            :label="$t('serverAdvanced.autobanTime')"
                            :disabled="$store.state.query.loading"
                            v-model="
                              serverInfo.virtualserverComplainAutobanTime
                            "
                            type="number"
                          >
                            <template #append>
                              <div>{{ $t('hostSettings.seconds') }}</div>
                            </template>
                          </v-text-field>
                        </v-flex>
                        <v-flex xs5 md3>
                          <v-text-field
                            :label="$t('serverAdvanced.removeTime')"
                            :disabled="$store.state.query.loading"
                            v-model="
                              serverInfo.virtualserverComplainRemoveTime
                            "
                            type="number"
                          >
                            <template #append>
                              <div>{{ $t('hostSettings.seconds') }}</div>
                            </template>
                          </v-text-field>
                        </v-flex>
                      </v-layout>
                    </v-card-text>
                  </v-card>
                  <v-card class="my-2" outlined>
                    <v-card-text>
                      <v-text-field
                        :label="$t('serverAdvanced.minClientsBeforeSilence')"
                        :disabled="$store.state.query.loading"
                        v-model="
                          serverInfo.virtualserverMinClientsInChannel_beforeForcedSilence
                        "
                        type="number"
                      ></v-text-field>
                      <v-text-field
                        :label="$t('serverAdvanced.prioritySpeakerDim')"
                        :disabled="$store.state.query.loading"
                        v-model="
                          serverInfo.virtualserverPrioritySpeakerDimmModificator
                        "
                        type="number"
                      ></v-text-field>
                      <v-text-field
                        :label="$t('serverAdvanced.tempChannelDeleteDelay')"
                        :disabled="$store.state.query.loading"
                        v-model="
                          serverInfo.virtualserverChannelTempDeleteDelay_default
                        "
                        type="number"
                      ></v-text-field>
                      <v-text-field
                        :label="$t('serverAdvanced.phoneticName')"
                        :disabled="$store.state.query.loading"
                        v-model="serverInfo.virtualserverNamePhonetic"
                      ></v-text-field>
                      <v-checkbox
                        :label="$t('serverAdvanced.reportToServerList')"
                        v-model="weblistEnabled"
                      ></v-checkbox>
                    </v-card-text>
                  </v-card>
                </v-expansion-panel-content>
              </v-expansion-panel>
              <v-expansion-panel>
                <v-expansion-panel-header>{{ $t('serverSettings.logs') }}</v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-card class="mb-2" outlined>
                    <v-card-subtitle>{{ $t('serverSettings.enableLogging') }}</v-card-subtitle>
                    <v-card-text>
                      <v-checkbox
                        :label="$t('navigation.clients')"
                        v-model="logClient"
                      ></v-checkbox>
                      <v-checkbox
                        :label="$t('entity.channel')"
                        v-model="logChannel"
                      ></v-checkbox>
                      <v-checkbox
                        :label="$t('entity.server')"
                        v-model="logServer"
                      ></v-checkbox>
                      <v-checkbox
                        label="ServerQuery"
                        v-model="logQuery"
                      ></v-checkbox>
                      <v-checkbox
                        :label="$t('navigation.permissions')"
                        v-model="logPermissions"
                      ></v-checkbox>
                      <v-checkbox
                        :label="$t('serverSettings.fileTransfer')"
                        v-model="logFileTransfer"
                      ></v-checkbox>
                    </v-card-text>
                  </v-card>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              text
              :disabled="this.$store.state.query.loading"
              color="primary"
              @click="saveChanges"
              >{{ $t('common.ok') }}
            </v-btn>
            <v-btn text @click="$router.go(-1)" color="primary">{{ $t('common.cancel') }}</v-btn>
            <v-btn
              text
              :disabled="this.$store.state.query.loading"
              color="primary"
              @click="applyChanges"
              >{{ $t('common.apply') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      serverInfo: {},
      serverInfoCopy: {},
      serverGroups: [],
      channelGroups: [],
    };
  },
  computed: {
    messageModes() {
      return [
        { text: this.$t("serverOption.noMessage"), value: 0 },
        { text: this.$t("serverOption.logMessage"), value: 1 },
        { text: this.$t("serverOption.modalMessage"), value: 2 },
        { text: this.$t("serverOption.modalExit"), value: 3 },
      ];
    },
    bannerModes() {
      return [
        { text: this.$t("serverOption.noAdjust"), value: 0 },
        { text: this.$t("serverOption.ignoreAspect"), value: 1 },
        { text: this.$t("serverOption.keepAspect"), value: 2 },
      ];
    },
    encryptionModes() {
      return [
        { text: this.$t("serverOption.perChannel"), value: 0 },
        { text: this.$t("serverOption.globallyOff"), value: 1 },
        { text: this.$t("serverOption.globallyOn"), value: 2 },
      ];
    },
    weblistEnabled: {
      get() {
        return this.serverInfo.virtualserverWeblistEnabled ? true : false;
      },
      set(bool) {
        this.serverInfo.virtualserverWeblistEnabled = bool ? 1 : 0;
      },
    },
    logClient: {
      get() {
        return this.serverInfo.virtualserverLogClient ? true : false;
      },
      set(bool) {
        this.serverInfo.virtualserverLogClient = bool ? 1 : 0;
      },
    },
    logQuery: {
      get() {
        return this.serverInfo.virtualserverLogQuery ? true : false;
      },
      set(bool) {
        this.serverInfo.virtualserverLogQuery = bool ? 1 : 0;
      },
    },
    logChannel: {
      get() {
        return this.serverInfo.virtualserverLogChannel ? true : false;
      },
      set(bool) {
        this.serverInfo.virtualserverLogChannel = bool ? 1 : 0;
      },
    },
    logPermissions: {
      get() {
        return this.serverInfo.virtualserverLogPermissions ? true : false;
      },
      set(bool) {
        this.serverInfo.virtualserverLogPermissions = bool ? 1 : 0;
      },
    },
    logServer: {
      get() {
        return this.serverInfo.virtualserverLogServer ? true : false;
      },
      set(bool) {
        this.serverInfo.virtualserverLogServer = bool ? 1 : 0;
      },
    },
    logFileTransfer: {
      get() {
        return this.serverInfo.virtualserverLogFiletransfer ? true : false;
      },
      set(bool) {
        this.serverInfo.virtualserverLogFiletransfer = bool ? 1 : 0;
      },
    },
  },
  methods: {
    getServerInfo() {
      return this.$TeamSpeak.execute("serverinfo").then((arr) => arr[0]);
    },
    getServerGroupList() {
      return this.$TeamSpeak
        .execute("servergrouplist")
        .then((groups) => groups.filter((group) => group.type === 1));
    },
    getChannelGroupList() {
      return this.$TeamSpeak
        .execute("channelgrouplist")
        .then((groups) => groups.filter((group) => group.type === 1));
    },
    getChanges() {
      let changes = {};

      for (let prop in this.serverInfo) {
        if (this.serverInfo[prop] !== this.serverInfoCopy[prop]) {
          changes[prop] = this.serverInfo[prop];
        }
      }

      return changes;
    },
    serverEdit() {
      return this.$TeamSpeak.execute("serveredit", this.getChanges());
    },
    async saveChanges() {
      try {
        await this.serverEdit();

        this.$router.go(-1);
      } catch (err) {
        this.$toast.error(err.message);
      }
    },
    async applyChanges() {
      try {
        await this.serverEdit();
      } catch (err) {
        this.$toast.error(err.message);
      }

      this.init();
    },
    async init() {
      try {
        this.serverInfo = await this.getServerInfo();
        this.serverInfoCopy = { ...this.serverInfo };
        this.serverGroups = await this.getServerGroupList();
        this.channelGroups = await this.getChannelGroupList();
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
