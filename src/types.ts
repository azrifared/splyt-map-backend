interface Location {
  latitude: number;
  longitude: number;
  bearing: number;
};

interface Drivers {
  driver_id: string;
  location: Location;
};

export interface DriversRecord {
  pickup_eta: number;
  drivers: Drivers[];
};