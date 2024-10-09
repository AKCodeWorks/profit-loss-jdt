import type { Season, Config } from "$lib/interfaces";
import {
  exists,
  BaseDirectory,
  writeTextFile,
  readTextFile,
} from "@tauri-apps/plugin-fs";
import { v4 } from "uuid";
import { defaultEpisode, defaultItem, defaultConfig } from "$lib/defaults";

// this class makes handling local data a lot easier so you do not have to invoke the rust API a million times

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
      // deep clone the default item to avoid reference issues this took me way too much time to figure out lol
      let itemToAdd = JSON.parse(JSON.stringify(defaultItem));

      let newId = v4();

      itemToAdd.episodeId = episodeId;
      itemToAdd.id = newId;

      // add the item
      this.seasons.data.forEach((season) => {
        season.episodes.forEach((episode) => {
          if (episode.id === episodeId) {
            itemToAdd.seasonId = season.id;
            episode.items.push(itemToAdd);
          }
        });
      });

      // save it
      await this.saveAllSeasons(this.seasons);
      return true;
    } catch (e) {
      console.error("Error adding item to episode:", e);
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
      // find season by id
      const season = this.seasons.data.find((s) => s.id === seasonId);

      // no season no problems
      if (!season) return false;

      // deep clone the default episode to avoid reference issues
      let newEpisode = JSON.parse(JSON.stringify(defaultEpisode));
      newEpisode.seasonId = seasonId;
      newEpisode.id = v4();

      // add the new epsiode
      season.episodes.push(newEpisode);

      // sort the episodes by name
      season.episodes.sort((a, b) => b.name.localeCompare(a.name));

      // sort the seasons to make sure nothing got borked here...this might not be needed but the performance hit is super low
      this.seasons.data.sort((a, b) => a.name.localeCompare(b.name));

      // save it all
      await this.saveAllSeasons(this.seasons);

      return true;
    } catch (e) {
      console.error("Error creating episode:", e);
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
// export it as a single variable so it doesnt leak memory everywhere
export const storage = new StorageManager();
