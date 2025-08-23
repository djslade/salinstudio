import axios, { AxiosError } from "axios";
import { defineStore } from "pinia";

export const useAnalyticsStore = defineStore("analytics", {
  state: () => {
    return {
      visitorId: "",
      isDisabled: false,
      actionTracker: new Map<string, Date>(),
    };
  },
  actions: {
    disable() {
      localStorage.setItem("salinstudio-hideme", "true");
      this.isDisabled = true;
      localStorage.removeItem("salinstudio-analytics");
      this.visitorId = "";
    },
    set(id: string) {
      this.actionTracker.set(id, new Date());
    },
    recentlyLogged(id: string) {
      const date = this.actionTracker.get(id);
      if (!date) return false;
      if (new Date() >= new Date(date.getTime() + 300 * 1000)) return false;
      return true;
    },
    async setVisitorId() {
      if (this.isDisabled) return;
      const savedId = localStorage.getItem("salinstudio-analytics");
      if (savedId) {
        this.visitorId = savedId;
        return;
      }
      const res = await axios.post(
        `${import.meta.env.VITE_SERVER_ENDPOINT}/visitor`
      );
      const id = res.data.visitor.id;
      localStorage.setItem("salinstudio-analytics", id);
      this.visitorId = id;
    },
    async init() {
      if (this.isDisabled || this.visitorId !== "") return;
      this.isDisabled = localStorage.getItem("salinstudio-hideme") === "true";
      await this.setVisitorId();
    },
    async trackAction(type: string, tag: string, path: string) {
      if (!this.visitorId) return;
      const trackerId = `${type}.${path}.${tag}`;
      if (this.recentlyLogged(trackerId)) return;
      try {
        await axios.post(`${import.meta.env.VITE_SERVER_ENDPOINT}/action`, {
          visitorId: this.visitorId,
          type,
          tag,
          path,
        });
        this.set(trackerId);
      } catch (err) {
        if (err instanceof AxiosError) {
          if (err.status === 404) {
            if (
              err.response &&
              err.response.data.message === "no visitor data was found"
            ) {
              localStorage.removeItem("salinstudio-analytics");
              this.visitorId = "";
            }
          }
        }
      }
    },
  },
});
