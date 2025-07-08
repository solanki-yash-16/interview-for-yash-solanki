import type { Launch } from "../types/launch";
import { axiosInstance } from "./axios";

export const spaceXApi = {
    async getLaunches(): Promise<Launch[]> {
    try {
      const response = await axiosInstance.get('/launches');
      return response.data;
    } catch (error) {
      console.error('Error fetching launches:', error);
      throw new Error('Failed to fetch launches');
    }
  },
}
