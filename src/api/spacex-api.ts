import type { Launch, LaunchDetails, Launchpad, Payload, Rocket } from "../types/launch";
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

  async getLaunchDetails(launchId: string): Promise<LaunchDetails> {
    try {
      const [launchResponse] = await Promise.all([
        axiosInstance.get(`/launches/${launchId}`),
      ]);

      const launch: Launch = launchResponse.data;

      // Fetch related data individually
      const [rocketResponse, launchpadResponse, ...payloadResponses] = await Promise.all([
        axiosInstance.get(`/rockets/${launch.rocket}`),
        axiosInstance.get(`/launchpads/${launch.launchpad}`),
        ...launch.payloads.map(payloadId => axiosInstance.get(`/payloads/${payloadId}`))
      ]);

      const rocket: Rocket = rocketResponse.data;
      const launchpad: Launchpad = launchpadResponse.data;
      const launchPayloads: Payload[] = payloadResponses.map(response => response.data);

      if (!rocket || !launchpad) {
        throw new Error('Failed to fetch complete launch details');
      }

      return {
        launch,
        rocket,
        launchpad,
        payloads: launchPayloads
      };
    } catch (error) {
      console.error('Error fetching launch details:', error);
      throw new Error('Failed to fetch launch details');
    }
  },

  async getRockets(): Promise<Rocket[]> {
    try {
      const response = await axiosInstance.get('/rockets');
      return response.data;
    } catch (error) {
      console.error('Error fetching rockets:', error);
      throw new Error('Failed to fetch rockets');
    }
  },

  async getLaunchpads(): Promise<Launchpad[]> {
    try {
      const response = await axiosInstance.get('/launchpads');
      return response.data;
    } catch (error) {
      console.error('Error fetching launchpads:', error);
      throw new Error('Failed to fetch launchpads');
    }
  }
}