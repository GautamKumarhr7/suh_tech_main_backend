/**
 * System Preferences Service
 * Contains business logic for system preferences
 */

import { systemPreferencesRepository } from "../repositories/system-preferences.repository.js";

export class SystemPreferencesService {
  async getPreferences() {
    const preferences = await systemPreferencesRepository.getPreferences();

    if (!preferences) {
      return {
        timezone: "UTC",
        dateFormat: "YYYY-MM-DD",
        timeFormat: "24h",
      };
    }

    return this.formatPreferencesResponse(preferences);
  }

  async savePreferences(data: {
    timezone?: string;
    dateFormat?: string;
    timeFormat?: string;
  }) {
    if (!data.timezone || !data.dateFormat || !data.timeFormat) {
      throw new Error("Timezone, date format, and time format are required");
    }

    const existing = await systemPreferencesRepository.getPreferences();

    const saved = existing
      ? await systemPreferencesRepository.update(existing.id, data)
      : await systemPreferencesRepository.create(data as Required<typeof data>);

    if (!saved) {
      throw new Error("Failed to save system preferences");
    }

    return this.formatPreferencesResponse(saved);
  }

  private formatPreferencesResponse(preferences: any) {
    return {
      id: preferences.id,
      timezone: preferences.timezone,
      dateFormat: preferences.date_format,
      timeFormat: preferences.time_format,
      createdAt: preferences.created_at,
      updatedAt: preferences.updated_at,
    };
  }
}

export const systemPreferencesService = new SystemPreferencesService();
