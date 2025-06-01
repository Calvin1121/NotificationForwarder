import { useEffect} from "react";
import { useStates } from "./App.provider";
import { checkNotificationPermission, getInstalledApps } from "./utils/native";
import { EmitterSubscription, NativeEventEmitter } from "react-native";
import { generateHashId } from "./utils/util";
import { Notify } from "./native";
import useSWRMutation from "swr/mutation";
import notifyApi from "./api/notify"
import { fetcher } from "./utils/fetcher";

export const InitialApp = () => {
  const { trigger } = useSWRMutation(notifyApi.notifyLineWorks, async (url: string, { arg }: { arg: Record<string, any> }) =>
    fetcher(url, { method: 'post', body: JSON.stringify(arg) })
  );
  const { updateStates, isNotifyPermitted: isPermitted, installedApps, notify } = useStates();
  const initNotificationPermission = async () => {
    const isNotifyPermitted = await checkNotificationPermission()
    updateStates({ isNotifyPermitted })
  }

  const initInsstalledApps = async () => {
    const installedApps = await getInstalledApps()
    updateStates({ installedApps })
  }

  useEffect(() => {
    let notifySubscription: EmitterSubscription
    if (isPermitted && !!installedApps?.length) {
      const eventEmitter = new NativeEventEmitter();
      notifySubscription = eventEmitter.addListener("onNotificationPosted", (data: Notify) => {
        if (installedApps.find(app => app.packageName === data.packageName) && data.sbnTag) {
          const hashId = generateHashId(data);
          const _data = Object.assign(data, { hashId });
          updateStates(prev => {
            if (prev.notify?.hashId !== hashId) {
              return { ...prev, notify: _data }
            }
            return prev
          })
        }
      })
    }
    return () => {
      notifySubscription?.remove?.()
    }
  }, [isPermitted, installedApps])

  useEffect(() => {
    // if(notify?.hashId) 
      // trigger(notify)
  }, [notify, trigger])

  useEffect(() => {
    initNotificationPermission()
    initInsstalledApps()
  }, []);

  return <></>;
};