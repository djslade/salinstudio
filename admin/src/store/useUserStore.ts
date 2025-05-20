import { defineStore } from "pinia";

type User = {
  id: string;
  username: string;
};

export const useUserStore = defineStore("user", {
  state: () => {
    return { user: { id: "", username: "" } };
  },
  getters: {
    isLoggedIn(): boolean {
      return this.user.id !== "" && this.user.username !== "";
    },
  },
  actions: {
    set(user: User) {
      this.user = user;
    },
    clear() {
      this.user = { id: "", username: "" };
    },
  },
});
