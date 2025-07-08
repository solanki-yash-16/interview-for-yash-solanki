export interface Launch {
  id: string;
  flight_number: number;
  name: string;
  date_utc: string;
  date_unix: number;
  date_local: string;
  success: boolean | null;
  upcoming: boolean;
  details: string | null;
  rocket: string;
  payloads: string[];
  launchpad: string;
  links: {
    patch: {
      small: string | null;
      large: string | null;
    };
    reddit: {
      campaign: string | null;
      launch: string | null;
      media: string | null;
      recovery: string | null;
    };
    flickr: {
      small: string[];
      original: string[];
    };
    presskit: string | null;
    webcast: string | null;
    youtube_id: string | null;
    article: string | null;
    wikipedia: string | null;
  };
}

export interface Rocket {
  id: string;
  name: string;
  type: string;
  active: boolean;
  stages: number;
  boosters: number;
  cost_per_launch: number;
  success_rate_pct: number;
  first_flight: string;
  country: string;
  company: string;
  description: string;
}

export interface Launchpad {
  id: string;
  name: string;
  full_name: string;
  locality: string;
  region: string;
  timezone: string;
  latitude: number;
  longitude: number;
  launch_attempts: number;
  launch_successes: number;
  status: string;
  details: string;
}

export interface Payload {
  id: string;
  name: string;
  type: string;
  mass_kg: number | null;
  mass_lbs: number | null;
  orbit: string;
  reference_system: string;
  regime: string;
  longitude: number | null;
  semi_major_axis_km: number | null;
  eccentricity: number | null;
  periapsis_km: number | null;
  apoapsis_km: number | null;
  inclination_deg: number | null;
  period_min: number | null;
  lifespan_years: number | null;
  epoch: string | null;
  mean_motion: number | null;
  raan: number | null;
  arg_of_pericenter: number | null;
  mean_anomaly: number | null;
  customers: string[];
  norad_ids: number[];
  nationalities: string[];
  manufacturers: string[];
  payload_mass_kg: number | null;
  payload_mass_lbs: number | null;
  dragon: {
    capsule: string | null;
    mass_returned_kg: number | null;
    mass_returned_lbs: number | null;
    flight_time_sec: number | null;
    manifest: string | null;
    water_landing: boolean | null;
    land_landing: boolean | null;
  } | null;
}

export interface LaunchDetails {
  launch: Launch;
  rocket: Rocket;
  launchpad: Launchpad;
  payloads: Payload[];
}

export type FilterStatus = "all" | "upcoming" | "successful" | "failed";

export type DateFilterOption =
  | "all-time"
  | "past-week"
  | "past-month"
  | "past-3-months"
  | "past-6-months"
  | "past-year"
  | "past-2-years"
  | "custom-range";

export interface DateRange {
  start: Date | null;
  end: Date | null;
  option?: DateFilterOption;
}
