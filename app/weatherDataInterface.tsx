// weatherInterfaces.ts
export interface WeatherData {
  app_max_temp: number;
  app_min_temp: number;
  clouds: number;
  clouds_hi: number;
  clouds_low: number;
  // Add other properties as needed
}

export interface Weather {
  city_name: string;
  country_code: string;
  data: WeatherData[];
  lat: string;
  lon: string;
  state_code: string;
  timezone: string;
}