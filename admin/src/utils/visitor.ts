const STORAGE_KEY_VISITOR_STATUS = "salinstudio.admin.visitorstatus";

type VisitorStatus = "ghost" | "member";

export const getVisitorStatus = () => {
  const status = localStorage.getItem(STORAGE_KEY_VISITOR_STATUS);
  if (!status || (status !== "ghost" && status !== "member")) {
    localStorage.setItem(STORAGE_KEY_VISITOR_STATUS, "ghost");
    return "ghost" as VisitorStatus;
  }
  return status as VisitorStatus;
};

export const isVisitorMember = () => {
  const status = getVisitorStatus();
  return status === "member";
};

export const setVisitorAsMember = () => {
  localStorage.setItem(STORAGE_KEY_VISITOR_STATUS, "member");
};
