import type { Season, Config } from "$lib/interfaces";
import {
  exists,
  BaseDirectory,
  writeTextFile,
  readTextFile,
} from "@tauri-apps/plugin-fs";
import { v4 } from "uuid";
import { defaultEpisode, defaultItem, defaultConfig } from "$lib/defaults";

// this class makes handling local data a lot easer so you do not have to invoke the rust API a million times

export class StorageManager {
  config: Config | null = null;
  seasons: { data: Season[] } = { data: [] };
  ready: boolean = false;

  // since the rust fs module is async we have to initialize the storage manager
  async init() {
    try {
      await this.getConfig();
      await this.getAllSeasons();
      this.ready = true;
    } catch (e) {
      this.ready = false;
      return false;
    }
  }

  async updateConfig(config: Config) {
    try {
      this.config = config;
      await this.saveConfig(config);
    } catch (e) {
      return false;
    }
  }

  // private methods

  // episode methods

  async removeItemFromEpisode(episodeId: string, itemId: string) {
    try {
      this.seasons.data.forEach((season) => {
        season.episodes.forEach((episode) => {
          if (episode.id === episodeId) {
            episode.items = episode.items.filter((item) => {
              return item.id !== itemId;
            });
          }
        });
      });
      await this.saveAllSeasons(this.seasons);
      return true;
    } catch (e) {
      return false;
    }
  }

  async addItemToEpisode(episodeId: string) {
    try {
      const itemToAdd = defaultItem;
      itemToAdd.episodeId = episodeId;
      this.seasons.data.forEach((season) => {
        season.episodes.forEach((episode) => {
          if (episode.id === episodeId) {
            itemToAdd.seasonId = season.id;
            itemToAdd.id = v4();
            episode.items.push(defaultItem);
          }
        });
      });
      await this.saveAllSeasons(this.seasons);
      return true;
    } catch (e) {
      return false;
    }
  }

  async deleteEpisode(episodeId: string) {
    try {
      this.seasons.data.forEach((season) => {
        season.episodes = season.episodes.filter((episode) => {
          return episode.id !== episodeId;
        });
      });
      await this.saveAllSeasons(this.seasons);
    } catch (e) {
      return false;
    }
  }

  async createEpisode(seasonId: string) {
    try {
      const season = this.seasons.data.filter((season) => {
        return season.id === seasonId;
      });

      if (season.length === 0) {
        return false;
      }

      const newEpisode = defaultEpisode;
      newEpisode.seasonId = seasonId;
      newEpisode.id = v4();
      season[0].episodes.push(newEpisode);
      // filters out the selected season
      this.seasons.data = this.seasons.data.filter((s) => {
        return s.id !== seasonId;
      });
      // sort the episodes by name
      season[0].episodes.sort((a, b) => {
        return b.name.localeCompare(a.name);
      });
      this.seasons.data.push(season[0]);
      // sort the seasons by name after adding in the new data
      this.seasons.data.sort((a, b) => {
        return a.name.localeCompare(b.name);
      });

      await this.saveAllSeasons(this.seasons);

      return true;
    } catch (e) {
      return false;
    }
  }

  // season methods
  async deleteSeason(seasonId: string) {
    try {
      this.seasons.data = this.seasons.data.filter((season) => {
        return season.id !== seasonId;
      });
      await this.saveAllSeasons(this.seasons);
      return true;
    } catch (e) {
      return false;
    }
  }

  async saveAllSeasons(seasons: { data: Season[] }) {
    try {
      await this.saveFile("seasons.json", JSON.stringify(seasons));
      this.seasons = seasons;
      return true;
    } catch (e) {
      return false;
    }
  }

  async addSeason(season: Season) {
    season.id = v4();
    try {
      this.seasons.data.push(season);
      // sort the seasons by the name
      this.seasons.data.sort((a, b) => {
        return a.name.localeCompare(b.name);
      });
      await this.saveAllSeasons(this.seasons);
      return true;
    } catch (e) {
      return false;
    }
  }

  private async getAllSeasons() {
    try {
      // if the file exists we read it and load it into the app
      if (await this.fileExists("seasons.json")) {
        const seasons = await readTextFile("seasons.json", {
          baseDir: BaseDirectory.AppLocalData,
        });
        this.seasons = JSON.parse(seasons);
        return JSON.parse(seasons);
      } else {
        // the file didnt exist so we initialize empty array and create the file for future use
        this.seasons = { data: [] };
        await this.saveAllSeasons({ data: [] });
        return { data: [] };
      }
    } catch (e) {
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
    try {
      await this.saveFile("config.json", JSON.stringify(config));
      return true;
    } catch (e) {
      return false;
    }
  }

  // file system methods

  private async fileExists(file: string) {
    try {
      return await exists(file, {
        baseDir: BaseDirectory.AppLocalData,
      });
    } catch (e) {
      return false;
    }
  }

  private async saveFile(fileName: string, data: string) {
    try {
      await writeTextFile(fileName, data, {
        baseDir: BaseDirectory.AppLocalData,
      });
    } catch (e) {
      return false;
    }
  }
}

export const storage = new StorageManager();
