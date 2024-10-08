import type { Config } from "$lib/interfaces/Config";
import { browser } from "$app/environment";
import {
  exists,
  BaseDirectory,
  writeTextFile,
  readTextFile,
} from "@tauri-apps/plugin-fs";
import { defaultConfig } from "$lib/defaults/defaultConfig";
import exp from "constants";

// this class makes handling local data a lot easer so you do not have to invoke the rust API a million times

export class StorageManager {
  config: Config | null = null;
  ready: boolean = false;

  // since the rust fs module is async we have to initialize the storage manager
  async init() {
    await this.getConfig();
    this.ready = true;
  }

  // configuration methods

  private async getConfig() {
    // check if the config is already there
    const configExists = await this.fileExists("config.json");
    if (!configExists) {
      // the config does not exist so we create a default config and save it
      this.config = defaultConfig;
      await this.saveConfig(defaultConfig);
      return;
    } else {
      // the config exists so we read it and load it into the app
      const config = await readTextFile("config.json", {
        baseDir: BaseDirectory.AppLocalData,
      });
      this.config = JSON.parse(config);
    }
  }

  async updateConfig(config: Config) {
    console.log("updating config");
    this.config = config;
    await this.saveConfig(config);
  }

  private async saveConfig(config: Config) {
    console.log(config);
    await writeTextFile("config.json", JSON.stringify(config), {
      baseDir: BaseDirectory.AppLocalData,
    });
  }

  // file system methods

  private async fileExists(file: string) {
    return await exists(file, {
      baseDir: BaseDirectory.AppLocalData,
    });
  }
}

export const storage = new StorageManager();
