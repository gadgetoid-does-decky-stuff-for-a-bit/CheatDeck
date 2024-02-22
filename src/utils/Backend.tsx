import {
  FileSelectionType,
  FilePickerRes,
  ServerAPI,
  ToastData,
} from "decky-frontend-lib";

export type FilePickerFilter = RegExp | ((file: File) => boolean) | undefined;

export class Backend {
  static serverAPI: ServerAPI;

  static initialize(serverApi: ServerAPI) {
    Backend.serverAPI = serverApi;
  }

  static async bridge(functionName: string, namedArgs?: any) {
    namedArgs = namedArgs ? namedArgs : {};
    console.debug(`Calling backend function: ${functionName}`);
    let output = await Backend.serverAPI.callPluginMethod(
      functionName,
      namedArgs,
    );
    return output.result;
  }
  static async getSetting(key: string, defaults: any) {
    let output = await Backend.bridge("settings_getSetting", { key, defaults });
    return output;
  }
  static async setSetting(key: string, value: any) {
    let output = await Backend.bridge("settings_setSetting", { key, value });
    return output;
  }
  static async commitSettings() {
    let output = await Backend.bridge("settings_commit");
    return output;
  }

  static openFilePicker = (
    startPath: string,
    includeFiles?: boolean,
    validFileExtensions?: string[],
    filter?: FilePickerFilter,
    defaultHidden?: boolean,
  ): Promise<FilePickerRes> => {
    return new Promise(async (resolve, reject) => {
      await Backend.serverAPI
        .openFilePickerV2(
          FileSelectionType.FILE,
          startPath,
          includeFiles,
          true,
          filter,
          validFileExtensions,
          defaultHidden,
          false,
        )
        .then(resolve, () => reject("User Canceled"));
    });
  };

  static sendNotice = (msg: string) => {
    const toastData: ToastData = {
      title: "CheatDeck",
      body: msg,
      duration: 2000,
      playSound: true,
      showToast: true,
    };
    Backend.serverAPI.toaster.toast(toastData);
  };
}
