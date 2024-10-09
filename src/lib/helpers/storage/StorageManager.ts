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
import type { Season } from "$lib/interfaces/Season";
import { v4 } from "uuid";
import type { Episode } from "$lib/interfaces/Episode";
import { defaultEpisode } from "$lib/defaults/defaultEpisode";

// this class makes handling local data a lot easer so you do not have to invoke the rust API a million times

export class StorageManager {
  config: Config | null = null;
  seasons: { data: Season[] } = { data: [] };
  ready: boolean = false;

  // since the rust fs module is async we have to initialize the storage manager
  async init() {
    await this.getConfig();
    await this.getAllSeasons();
    this.ready = true;
  }

  async updateConfig(config: Config) {
    console.log("updating config");
    this.config = config;
    await this.saveConfig(config);
  }

  // private methods

  // episode methods

  async createEpisode(seasonId: string) {
    console.log("creati episode");
    console.log(this.seasons.data);
    console.log(seasonId);
    const season = this.seasons.data.filter((season) => {
      return season.id === seasonId;
    });
    console.log("season", season);
    if (season.length === 0) {
      return false;
    }

    const newEpisode = defaultEpisode;
    newEpisode.seasonId = seasonId;
    newEpisode.id = v4();
    season[0].episodes.push(newEpisode);
    // needto filter out the season that was updated and then add it back in
    this.seasons.data = this.seasons.data.filter((s) => {
      return s.id !== seasonId;
    });
    // sort the episodes by name
    season[0].episodes.sort((a, b) => {
      return b.name.localeCompare(a.name);
    });
    this.seasons.data.push(season[0]);
    this.seasons.data.sort((a, b) => {
      return a.name.localeCompare(b.name);
    });

    await this.saveAllSeasons(this.seasons);

    return true;
  }

  // season methods
  // TODO: WHEN A SEASON IS DELETED NEED TO UPDATE ALL ITEMS AND EPISODES TO BE DISSOCIATED FROM IT
  async deleteSeason(seasonId: string) {
    this.seasons.data = this.seasons.data.filter((season) => {
      return season.id !== seasonId;
    });
    await this.saveAllSeasons(this.seasons);
  }

  async saveAllSeasons(seasons: { data: Season[] }) {
    await this.saveFile("seasons.json", JSON.stringify(seasons));
    this.seasons = seasons;
  }

  async addSeason(season: Season) {
    season.id = v4();
    this.seasons.data.push(season);
    // sort the seasons by the name
    this.seasons.data.sort((a, b) => {
      return a.name.localeCompare(b.name);
    });
    await this.saveAllSeasons(this.seasons);
  }

  private async getAllSeasons() {
    if (await this.fileExists("seasons.json")) {
      const seasons = await readTextFile("seasons.json", {
        baseDir: BaseDirectory.AppLocalData,
      });
      this.seasons = JSON.parse(seasons);
      return JSON.parse(seasons);
    } else {
      this.seasons = { data: [] };
      await this.saveAllSeasons({ data: [] });
      return { data: [] };
    }
  }

  //configuration methods

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

  private async saveConfig(config: Config) {
    await this.saveFile("config.json", JSON.stringify(config));
  }

  // file system methods

  private async fileExists(file: string) {
    return await exists(file, {
      baseDir: BaseDirectory.AppLocalData,
    });
  }

  private async saveFile(fileName: string, data: string) {
    await writeTextFile(fileName, data, {
      baseDir: BaseDirectory.AppLocalData,
    });
  }
}

export const storage = new StorageManager();
