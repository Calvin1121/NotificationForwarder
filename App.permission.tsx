import { useEffect } from "react";
import { useStates } from "./App.provider";

export const InitPermission = () => {
  const { checkNotificationPermission, updateStates } = useStates();

  const initNotificationPermission = async () => {
    const isNotifyPermitted = await checkNotificationPermission()
    updateStates({ isNotifyPermitted })
  }

  useEffect(() => {
    initNotificationPermission()
  }, []);

  return <></>;
};