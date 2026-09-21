import socket from "../socket";
import store from "../store";
import router from "../router";
import NProgress from "nprogress";
import zhCN from "../i18n/locales/zh-CN";
import zhTW from "../i18n/locales/zh-TW";

// Polyfill for EventTarget because Safari has no constructor for it
import EventTarget from "@ungap/event-target";

/**
 * The TeamSpeak Object sends the request to the server and finally receives the response from the ServerQuery.
 * To keep things simple it uses the same naming as the TeamSpeak class from the TS3-NodeJS-Library which is used on the server side.
 * See: https://multivit4min.github.io/TS3-NodeJS-Library/classes/teamspeak.html
 * @type {Object}
 */

const TeamSpeak = Object.create(new EventTarget());

// TeamSpeak ServerQuery errors are returned in English. Translate errors with
// stable error codes here so every component that displays err.message gets
// the active UI locale automatically.
const serverErrorKeys = {
  1: "queryError.general.undefined",
  2: "queryError.general.notImplemented",
  3: "queryError.general.okNoUpdate",
  4: "queryError.general.dontNotify",
  5: "queryError.general.timeLimitReached",
  6: "queryError.general.outOfMemory",
  7: "queryError.general.canceled",
  256: "queryError.command.notFound",
  257: "queryError.command.unableBindNetworkPort",
  258: "queryError.command.noNetworkPortAvailable",
  259: "queryError.command.portAlreadyInUse",
  512: "queryError.client.invalidId",
  513: "queryError.client.nicknameInUse",
  515: "queryError.client.protocolLimitReached",
  516: "queryError.client.invalidType",
  517: "queryError.client.alreadySubscribed",
  518: "queryError.client.notLoggedIn",
  519: "queryError.client.couldNotValidateIdentity",
  520: "queryError.client.invalidPassword",
  521: "queryError.client.tooManyClonesConnected",
  522: "queryError.client.versionOutdated",
  523: "queryError.client.isOnline",
  524: "queryError.client.isFlooding",
  525: "queryError.client.hacked",
  526: "queryError.client.cannotVerifyNow",
  527: "queryError.client.loginNotPermitted",
  528: "queryError.client.notSubscribed",
  768: "queryError.channel.invalidId",
  769: "queryError.channel.protocolLimitReached",
  770: "queryError.channel.alreadyIn",
  771: "queryError.channel.nameInUse",
  772: "queryError.channel.notEmpty",
  773: "queryError.channel.cannotDeleteDefault",
  774: "queryError.channel.defaultRequirePermanent",
  775: "queryError.channel.invalidFlags",
  776: "queryError.channel.parentNotPermanent",
  777: "queryError.channel.maxClientsReached",
  778: "queryError.channel.maxFamilyReached",
  779: "queryError.channel.invalidOrder",
  780: "queryError.channel.noFileTransferSupported",
  781: "queryError.channel.invalidPassword",
  782: "queryError.channel.isPrivate",
  783: "queryError.channel.invalidSecurityHash",
  1024: "queryError.server.invalidId",
  1025: "queryError.server.running",
  1026: "queryError.server.isShuttingDown",
  1027: "queryError.server.maxClientsReached",
  1028: "queryError.server.invalidPassword",
  1029: "queryError.server.deploymentActive",
  1030: "queryError.server.unableToStopOwnServer",
  1031: "queryError.server.isVirtual",
  1032: "queryError.server.wrongMachineId",
  1033: "queryError.server.isNotRunning",
  1034: "queryError.server.isBooting",
  1035: "queryError.server.statusInvalid",
  1036: "queryError.server.modalQuit",
  1037: "queryError.server.versionOutdated",
  1038: "queryError.server.duplicateRunning",
  1039: "queryError.server.timeDifferenceTooLarge",
  1040: "queryError.server.blacklisted",
  1041: "queryError.server.shutdown",
  1280: "queryError.database.error",
  1281: "queryError.database.emptyResult",
  1282: "queryError.database.duplicateEntry",
  1283: "queryError.database.noModifications",
  1284: "queryError.database.constraint",
  1285: "queryError.database.reinvoke",
  1536: "queryError.parameter.quote",
  1537: "queryError.parameter.invalidCount",
  1538: "queryError.parameter.invalid",
  1539: "queryError.parameter.notFound",
  1540: "queryError.parameter.convert",
  1541: "queryError.parameter.invalidSize",
  1542: "queryError.parameter.missing",
  1543: "queryError.parameter.checksum",
  1792: "queryError.connection.virtualServerCritical",
  1793: "queryError.connection.lost",
  1794: "queryError.connection.notConnected",
  1795: "queryError.connection.noCachedConnectionInfo",
  1796: "queryError.connection.currentlyNotPossible",
  1797: "queryError.connection.initializationFailed",
  1798: "queryError.connection.couldNotResolveHostname",
  1799: "queryError.connection.invalidHandlerId",
  1800: "queryError.connection.inputManagerInitializationFailed",
  1801: "queryError.connection.clientLibraryNotInitialized",
  1802: "queryError.connection.serverLibraryNotInitialized",
  1803: "queryError.connection.whisperTooManyTargets",
  1804: "queryError.connection.whisperNoTargets",
  1805: "queryError.connection.ipProtocolMissing",
  1806: "queryError.connection.handshakeFailed",
  1807: "queryError.connection.illegalServerLicense",
  2048: "queryError.file.invalidName",
  2049: "queryError.file.invalidPermissions",
  2050: "queryError.file.alreadyExists",
  2051: "queryError.file.notFound",
  2052: "queryError.file.ioError",
  2053: "queryError.file.invalidTransferId",
  2054: "queryError.file.invalidPath",
  2055: "queryError.file.noFilesAvailable",
  2056: "queryError.file.overwriteExcludesResume",
  2057: "queryError.file.invalidSize",
  2058: "queryError.file.alreadyInUse",
  2059: "queryError.file.couldNotOpenConnection",
  2060: "queryError.file.noSpaceLeftOnDevice",
  2061: "queryError.file.exceedsFileSystemMaximumSize",
  2062: "queryError.file.transferConnectionTimeout",
  2063: "queryError.file.connectionLost",
  2064: "queryError.file.exceedsSuppliedSize",
  2065: "queryError.file.transferComplete",
  2066: "queryError.file.transferCanceled",
  2067: "queryError.file.transferInterrupted",
  2068: "queryError.file.serverQuotaExceeded",
  2069: "queryError.file.clientQuotaExceeded",
  2070: "queryError.file.reset",
  2071: "queryError.file.transferLimitReached",
  2072: "queryError.file.invalidStorageClass",
  2073: "queryError.file.invalidDimension",
  2074: "queryError.file.channelQuotaExceeded",
  2560: "queryError.permission.invalidGroupId",
  2561: "queryError.permission.duplicateEntry",
  2562: "queryError.permission.invalidPermissionId",
  2563: "queryError.permission.emptyResult",
  2564: "queryError.permission.defaultGroupForbidden",
  2565: "queryError.permission.invalidSize",
  2566: "queryError.permission.invalidValue",
  2567: "queryError.permission.groupNotEmpty",
  2568: "queryError.permission.insufficient",
  2569: "queryError.permission.insufficientGroupPower",
  2570: "queryError.permission.insufficientPermissionPower",
  2571: "queryError.permission.templateGroupUsed",
  2572: "queryError.permission.osDenied",
  2573: "queryError.permission.usedByIntegration",
  2816: "queryError.accounting.virtualServerLimitReached",
  2817: "queryError.accounting.slotLimitReached",
  2818: "queryError.accounting.licenseFileNotFound",
  2819: "queryError.accounting.licenseDateNotOk",
  2820: "queryError.accounting.unableToConnect",
  2821: "queryError.accounting.unknownError",
  2822: "queryError.accounting.serverError",
  2823: "queryError.accounting.instanceLimitReached",
  2824: "queryError.accounting.instanceCheckError",
  2825: "queryError.accounting.licenseFileInvalid",
  2826: "queryError.accounting.runningElsewhere",
  2827: "queryError.accounting.instanceDuplicated",
  2828: "queryError.accounting.alreadyStarted",
  2829: "queryError.accounting.notStarted",
  2830: "queryError.accounting.tooManyStarts",
  3072: "queryError.message.invalidId",
  3328: "queryError.ban.invalidId",
  3329: "queryError.ban.connectFailedBanned",
  3330: "queryError.ban.renameFailedBanned",
  3331: "queryError.ban.flooding",
  3840: "queryError.privilegeKey.invalid",
  5120: "queryError.apiKey.outOfScope",
  5121: "queryError.apiKey.cryptoError",
  5122: "queryError.apiKey.invalid",
  5123: "queryError.apiKey.invalidId",
  5124: "queryError.apiKey.missing",
};

const serverErrorMessages = {
  "Missing servername": "queryError.input.missingServerName",
  "No valid port number": "queryError.input.invalidPort",
  "Unsupported protocol": "queryError.input.unsupportedProtocol",
  "TeamSpeak server is not whitelisted": "queryError.input.serverNotWhitelisted",
};

const serverErrorLocales = {
  "zh-CN": zhCN,
  "zh-TW": zhTW,
};

const translateServerError = (key) => {
  const messages = serverErrorLocales[store.state.settings.locale];

  return key.split(".").reduce((value, segment) => value && value[segment], messages);
};

const localizeError = (error) => {
  const key = serverErrorKeys[String(error && error.id)] || serverErrorMessages[error && error.message];
  const translatedMessage = key && translateServerError(key);

  if (translatedMessage) {
    const suffix = error.msg && error.message && error.message.startsWith(error.msg) ? error.message.slice(error.msg.length) : "";
    error.message = `${translatedMessage}${suffix}`;
  }

  return error;
};

const handleError = (error, resolve, reject) => {
  error = localizeError(error);

  if (error.connected) {
    // Ignore empty result error e.g. an empty permissionlist
    if (error.id === "1281") {
      resolve([]);
    } else {
      reject(error);
    }
  } else {
    store.dispatch("clearStorage");

    router.push({ name: "login" });

    reject(error);
  }
};

let handleResponse = (response, resolve, reject) => {
  // TeamSpeak Error or general Error
  if (
    (response.id && response.id !== 0) ||
    (!response.id && response.message)
  ) {
    handleError(response, resolve, reject);
  } else {
    resolve(response);
  }
};

// Just for debugging the progress bar (NProgress)
const throttleSocketConnection = (time) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
};

// Middleware that handles the progressbar
const setLoadingState = (methods) => {
  methods.forEach((method) => {
    let next = TeamSpeak[method];
    let timer = setTimeout(() => {
      store.commit("isLoading", false);

      NProgress.done();
    }, 0);

    TeamSpeak[method] = async (...args) => {
      try {
        clearTimeout(timer);
        store.commit("isLoading", true);
        NProgress.inc();

        if (process.env.NODE_ENV === "development")
          await throttleSocketConnection(0);

        let response = await next(...args);

        timer = setTimeout(() => {
          store.commit("isLoading", false);

          NProgress.done();
        }, 0);

        return response;
      } catch (error) {
        store.commit("isLoading", false);

        NProgress.done();

        throw error;
      }
    };
  });
};

TeamSpeak.connect = (params) => {
  return new Promise((resolve, reject) => {
    socket.emit("teamspeak-connect", params, (response) => {
      if (response.token) {
        resolve(response);
      } else {
        reject(localizeError(response));
      }
    });
  });
};

TeamSpeak.execute = (...args) => {
  let command = args[0];
  let params = args[1] ? args[1] : {};
  let options = args[2] ? args[2] : [];

  return new Promise((resolve, reject) => {
    socket.emit(
      "teamspeak-execute",
      {
        command,
        params,
        options,
      },
      (response) => handleResponse(response, resolve, reject)
    );
  });
};

TeamSpeak.createSnapshot = () => {
  return new Promise((resolve, reject) => {
    socket.emit("teamspeak-createsnapshot", (response) =>
      handleResponse(response, resolve, reject)
    );
  });
};

TeamSpeak.deploySnapshot = (snapshot) => {
  return new Promise((resolve, reject) => {
    socket.emit("teamspeak-deploysnapshot", snapshot, (response) =>
      handleResponse(response, resolve, reject)
    );
  });
};

// The ServerQuery returns maximum 200 entries in the clientdblist.
// This function collects all available entries in the client database list.
TeamSpeak.fullClientDBList = async () => {
  let fullClientDbList = [];
  let start = 0;
  let duration = 200;

  try {
    while (
      (
        await TeamSpeak.execute("clientdblist", {
          start,
          duration,
        })
      ).length
    ) {
      fullClientDbList.push(
        ...(await TeamSpeak.execute("clientdblist", {
          start,
          duration,
        }))
      );

      start += 200;
      duration += 200;
    }
  } catch (err) {
    throw err;
  }

  return fullClientDbList;
};

// To-Do: After 400 lines flooding warnings
TeamSpeak.fullLogView = async (instance = 0) => {
  let allLogs = [];
  let lastPosition = undefined;

  try {
    while (lastPosition !== 0) {
      let logs = await TeamSpeak.execute("logview", {
        instance,
        reverse: 1,
        lines: 100,
        beginPos: lastPosition,
      });

      lastPosition = logs[0].lastPos;

      allLogs.push(...logs);
    }
  } catch (err) {
    throw err;
  }

  return allLogs;
};

TeamSpeak.registerEvents = () => {
  return new Promise((resolve, reject) => {
    socket.emit("teamspeak-registerevents", (response) =>
      handleResponse(response, resolve, reject)
    );
  });
};

TeamSpeak.registerEvents = () => {
  return new Promise((resolve, reject) => {
    socket.emit("teamspeak-registerevents", (response) => {
      return handleResponse(response, resolve, reject);
    });
  });
};

TeamSpeak.unregisterEvent = () => {
  return new Promise((resolve, reject) => {
    socket.emit("teamspeak-unregisterevent", (response) =>
      handleResponse(response, resolve, reject)
    );
  });
};

TeamSpeak.selectServer = (sid) => {
  return TeamSpeak.execute("use", { sid })
    .then(() => store.dispatch("saveServerId", sid))
    .then(() => TeamSpeak.registerEvents())
    .then(() => TeamSpeak.execute("whoami"))
    .then((userInfo) => store.commit("saveUserInfo", userInfo[0]));
};

TeamSpeak.downloadFile = (path, cid, cpw = "") => {
  return new Promise((resolve, reject) => {
    socket.emit("teamspeak-downloadfile", { path, cid, cpw }, (response) => {
      handleResponse(response, resolve, reject);
    });
  });
};

TeamSpeak.reconnect = () => {
  return new Promise((resolve, reject) => {
    socket.emit(
      "teamspeak-reconnect",
      {
        token: store.state.query.token,
        serverId: store.state.query.serverId,
      },
      async (res) => {
        if (res.reconnected) {
          try {
            let queryUser = await TeamSpeak.execute("whoami").then(
              (list) => list[0]
            );

            store.dispatch("saveConnection", { queryUser, connected: true });
          } catch (err) {
            reject(err);
          }

          resolve();
        } else {
          reject(localizeError(res));
        }
      }
    );
  });
};

TeamSpeak.on = (name, fn) => {
  TeamSpeak.__proto__.addEventListener(name, fn);
};

socket.on("teamspeak-textmessage", (data) => {
  TeamSpeak.__proto__.dispatchEvent(
    new CustomEvent("textmessage", {
      detail: data,
    })
  );
});

socket.on("teamspeak-clientconnect", (data) => {
  TeamSpeak.__proto__.dispatchEvent(
    new CustomEvent("clientconnect", {
      detail: data,
    })
  );
});

socket.on("teamspeak-clientdisconnect", (data) => {
  TeamSpeak.__proto__.dispatchEvent(
    new CustomEvent("clientdisconnect", {
      detail: data,
    })
  );
});

socket.on("teamspeak-clientmoved", (data) => {
  TeamSpeak.__proto__.dispatchEvent(
    new CustomEvent("clientmoved", {
      detail: data,
    })
  );
});

socket.on("teamspeak-tokenused", (data) => {
  TeamSpeak.__proto__.dispatchEvent(
    new CustomEvent("tokenused", {
      detail: data,
    })
  );
});

socket.on("teamspeak-serveredit", (data) => {
  TeamSpeak.__proto__.dispatchEvent(
    new CustomEvent("serveredit", {
      detail: data,
    })
  );
});

socket.on("teamspeak-channeledit", (data) => {
  TeamSpeak.__proto__.dispatchEvent(
    new CustomEvent("channeledit", {
      detail: data,
    })
  );
});

socket.on("teamspeak-channelcreate", (data) => {
  TeamSpeak.__proto__.dispatchEvent(
    new CustomEvent("channelcreate", {
      detail: data,
    })
  );
});

socket.on("teamspeak-channelmoved", (data) => {
  TeamSpeak.__proto__.dispatchEvent(
    new CustomEvent("channelmoved", {
      detail: data,
    })
  );
});

socket.on("teamspeak-channeldelete", (data) => {
  TeamSpeak.__proto__.dispatchEvent(
    new CustomEvent("channeldelete", {
      detail: data,
    })
  );
});

// When the teamspeak connection is closed manually.
// E.g. writing "quit" in the console
socket.on("teamspeak-disconnect", () => {
  store.dispatch("clearStorage");

  router.push({ name: "login" });
});

setLoadingState([
  "execute",
  "createSnapshot",
  "deploySnapshot",
  "selectServer",
]);

export default TeamSpeak;
