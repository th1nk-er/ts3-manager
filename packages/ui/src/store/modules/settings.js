const state = {
  rememberLogin: true,
  notifications: true,
  darkMode: true,
  locale: null,
};

const mutations = {
  setRememberLogin(state, status) {
    state.rememberLogin = status;
  },
  setNotifications(state, status) {
    state.notifications = status;
  },
  setDarkMode(state, status) {
    state.darkMode = status;
  },
  setLocale(state, locale) {
    state.locale = locale;
  },
};

export default {
  state,
  mutations,
};
