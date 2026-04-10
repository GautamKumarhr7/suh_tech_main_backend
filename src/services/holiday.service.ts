/**
 * Holiday Service
 * Contains business logic for holiday operations
 */

import { holidayRepository } from "../repositories/holiday.repository.js";

export class HolidayService {
  async getAllHolidays(filters?: { type?: string }) {
    return holidayRepository.findAll(filters);
  }

  async getHolidayById(id: number) {
    const holiday = await holidayRepository.findById(id);
    if (!holiday) {
      throw new Error("Holiday not found");
    }
    return holiday;
  }

  async createHoliday(data: { name: string; type: string; date: Date }) {
    if (!data.name || !data.type || !data.date) {
      throw new Error("Name, type, and date are required");
    }

    return holidayRepository.create({
      name: data.name.trim(),
      type: data.type.trim(),
      date: data.date,
    });
  }

  async updateHoliday(
    id: number,
    data: {
      name?: string;
      type?: string;
      date?: Date;
    },
  ) {
    const existing = await holidayRepository.findById(id);
    if (!existing) {
      throw new Error("Holiday not found");
    }

    const updated = await holidayRepository.update(id, {
      name: data.name?.trim(),
      type: data.type?.trim(),
      date: data.date,
    });

    if (!updated) {
      throw new Error("Failed to update holiday");
    }

    return updated;
  }

  async deleteHoliday(id: number) {
    const existing = await holidayRepository.findById(id);
    if (!existing) {
      throw new Error("Holiday not found");
    }

    const deleted = await holidayRepository.delete(id);
    if (!deleted) {
      throw new Error("Failed to delete holiday");
    }

    return { message: "Holiday deleted successfully" };
  }
}

export const holidayService = new HolidayService();
