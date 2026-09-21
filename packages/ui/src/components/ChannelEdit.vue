<template>
  <div>
    <channel-form :applyButton="true" :title="$t('action.editChannel')" :channel="channel" @save="save"></channel-form>

    <v-dialog v-model="temporaryChannelWarning" max-width="500px">
      <v-card>
        <v-card-title>{{ $t("remaining.temporaryChannel") }}</v-card-title>
        <v-card-text>
          {{ $t("confirm.temporaryChannel") }}
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text color="primary" @click="saveAndLeave">{{ $t("common.yes") }}</v-btn>
          <v-btn text color="primary" @click="temporaryChannelWarning = false">{{ $t("common.no") }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  components: {
    ChannelForm: () => import("@/components/ChannelForm"),
  },
  data() {
    return {
      channelId: this.$route.params.cid,
      channel: {},
      temporaryChannelWarning: false,
      pendingChanges: null,
    };
  },
  methods: {
    getChannelInfo() {
      return this.$TeamSpeak
        .execute("channelinfo", {
          cid: this.channelId,
        })
        .then((channelinfo) => channelinfo[0]);
    },
    channelIsTemporary(channelProps) {
      let newChannelProps = { ...this.channel, ...channelProps };

      if (newChannelProps.channelFlagPermanent === 0 && newChannelProps.channelFlagSemiPermanent === 0) {
        return true;
      } else {
        return false;
      }
    },
    editChannel(channelProps) {
      return (
        Object.keys(channelProps).length &&
        this.$TeamSpeak.execute("channeledit", {
          cid: this.channelId,
          ...channelProps,
        })
      );
    },
    async save(channelProps, action) {
      try {
        if (this.channelIsTemporary(channelProps)) {
          this.temporaryChannelWarning = true;

          this.pendingChanges = channelProps;
        } else {
          switch (action) {
            case "apply":
              await this.editChannel(channelProps);

              this.init();

              break;
            case "ok":
              await this.editChannel(channelProps);

              this.$router.go(-1);
          }
        }
      } catch (err) {
        this.$toast.error(err.message);
      }
    },
    async saveAndLeave() {
      try {
        await this.editChannel(this.pendingChanges);

        this.$router.go(-1);
      } catch (err) {
        this.$toast.error(err.message);
      }
    },
    async init() {
      try {
        this.channel = await this.getChannelInfo();
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
