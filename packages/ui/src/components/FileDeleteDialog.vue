<template lang="html">
  <v-dialog v-model="dialog" max-width="500px">
    <v-card>
      <v-card-title>
        {{ $t("file.deleteTitle", { type: item.type === 0 ? $t("entity.folder") : $t("entity.file") }) }}
      </v-card-title>
      <v-card-text v-if="item.type === 0">
        {{ $t("confirm.deleteFolder") }}
      </v-card-text>
      <v-card-text v-else>
        {{ $t("confirm.deleteFile") }}
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="deleteFile" color="primary">{{ $t("common.yes") }}</v-btn>
        <v-btn text @click="dialog = false" color="primary">{{ $t("common.no") }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import Path from "path-browserify";

export default {
  props: {
    /**
     * File or folder
     * Folders are handled by the ServerQuery like files.
     * @type {TreeItem}
     */
    item: Object,
    value: Boolean,
  },
  computed: {
    dialog: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      },
    },
  },
  methods: {
    /**
     * Delete the file or folder.
     */
    async deleteFile() {
      let { cid, path, name } = this.item;

      try {
        await this.$TeamSpeak.execute("ftdeletefile", {
          cid,
          cpw: "",
          name: Path.join(path, name),
        });
      } catch (err) {
        this.$toast.error(err.message);
      }

      this.$emit("filedelete", this.item);
    },
  },
};
</script>

<style lang="css" scoped></style>
