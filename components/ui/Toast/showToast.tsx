import * as React from "react";
import toast, { Toast } from "react-hot-toast";
import { CustomToast } from "./CustomToast";

export const showToast = {
  success: (title: string, message: string): void => {
    toast.custom((t: Toast) => (
      <CustomToast t={t} title={title} message={message} type="success" />
    ));
  },
  error: (title: string, message: string): void => {
    toast.custom((t: Toast) => (
      <CustomToast t={t} title={title} message={message} type="error" />
    ));
  },
  info: (title: string, message: string) => {
    toast(`${title}\n${message}`);
  },
};
