import dotenv from 'dotenv';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lng: number;
  name: string;
  country: string;
  state: string;
}
// TODO: Define a class for the Weather object
class Weather {
  temp: number;
  wind: number;
  humidity: number
  description: string;
  constructor(temp: number, wind: number, humidity: number, description: string) {
    this.temp = temp;
    this.wind = wind;
    this.humidity = humidity;
    this.description = description;

  }
}
// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
  private baseURL: string = process.env.API_BASE_URL || '';
  private APIKey: string = process.env.API_KEY || '';
  private cityName: string;
  //constructor
  constructor(cityName: string) {
    this.cityName = cityName;
  }
  // TODO: Create fetchLocationData method
  //gets location data using geocode query with the cityName
  
  private async fetchLocationData() {
    const response = await fetch(this.buildGeocodeQuery());
    if (!response.ok) {
      throw new Error("Failed to fetch location data");
    }
    const locationData = await response.json();
    return locationData;
  }
  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: any): Coordinates {
    const { coord } = locationData;
    const { lat, lon } = coord;
    const coordinates: Coordinates = {};
    return coordinates;

  }
  // TODO: Create buildGeocodeQuery method
  //uses city name to do the geocode query from the API documentation
  private buildGeocodeQuery(): string {
    return `${this.baseURL}?q=${encodeURIComponent(this.cityName)}&appid=${this.APIKey}`;
  }
  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    const { lat, lng } = coordinates;
    return `${this.baseURL}?lat=${lat}&lon=${lng}&appid=${this.APIKey}`;
  }
  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData() {
    try {
      const response = await this.fetchLocationData();
      if (!response.ok) {
        throw new Error('Network response error.');
      }
      const data = await response.json();

      // Destructure the relevant data from the response
      const coordinates = this.destructureLocationData(data);

      console.log(coordinates);

      return coordinates;

    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
      return undefined;

    }
  }
  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates): Promise<Weather> {
    const response = await fetch(this.buildWeatherQuery(coordinates));
    if (!response.ok) {
      throw new Error("Failed to fetch weather data");
    }
    const weatherData = await response.json();
    const { main, wind, weather } = weatherData; // Assuming this structure
    return new Weather(main.temp, main.humidity, wind.speed, weather[0].description);
  }

  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(response: any) {
    let parsedWeather = {};
    try {
      const data = JSON.parse(response);

      parsedWeather = {
        cityName: data.city.name,
        date: new Date(data.list[0].dt * 1000).toLocaleDateString(),
        weatherIcon: data.list[0].weather[0].icon,
        weatherDescription: data.list[0].weather[0].description,
        temperature: data.list[0].main.temp,
        humidity: data.list[0].main.humidity,
        windSpeed: data.list[0].wind.speed,
      };

    } catch (err) {
      console.error("Error parsing weather data.", err)
      parsedWeather = {};
    }
    return parsedWeather;
  }
  // TODO: Complete buildForecastArray method
  private buildForecastArray(weatherData: any[]) {
    const forecastArray = [];

    // Assuming weatherData contains daily forecasts
    for (let i = 0; i < weatherData.length; i++) {
      const dayData = weatherData[i];

      // Extract relevant data
      const date = new Date(dayData.dt * 1000).toLocaleDateString(); // Convert Unix timestamp to date
      const temperature = dayData.main.temp; // Temperature
      const humidity = dayData.main.humidity; // Humidity
      const windSpeed = dayData.wind.speed; // Wind Speed
      const weatherCondition = dayData.weather[0].description; // Weather description

      // Create a forecast object
      const forecast = {
        date: date,
        temperature: temperature,
        humidity: humidity,
        windSpeed: windSpeed,
        condition: weatherCondition
      };

      // Add the forecast to the array
      forecastArray.push(forecast);
    }

    return forecastArray;
  }
  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(cityName: string) {
    const locationData = await this.fetchAndDestructureLocationData();

    if (!locationData) {
      throw new Error(`Location data not found for city: ${cityName}`);
    }
      const { lat, lng } = locationData;

    const weatherData = await this.fetchWeatherData(this.coordinates);
    const currentWeather = parseCurrentWeather(weatherData);

  //   const url = `${this.baseURL}?q=${encodeURIComponent(city)}&appid=${this.APIKey}&units=metric`;
  //   try {
  //     // Make the API request
  //     const response = await fetch(url);

  //     // Check if the response is ok (status code 200)
  //     if (!response.ok) {
  //         throw new Error(`Error fetching weather data: ${response.statusText}`);
  //     }

  //     // Parse the JSON response
  //     const weatherData = await response.json();

  //     // Return the parsed weather data
  //     return weatherData;

  // } catch (error) {
  //     console.error(error);
  //     throw new Error('Failed to fetch weather data');
  // }
  }
}

export default new WeatherService();
