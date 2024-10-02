"use client";
import Image from "next/image";
import WeatherView from "./weatherview";
import {
  useState,
  CSSProperties,
  ChangeEvent,
  FormEvent,
  useEffect,
} from "react";
import axios from "axios";
import PulseLoader from "react-spinners/PulseLoader";

export default function Home() {
  const [locationValue, setLocationValue] = useState("");
  const [oldCitySearch, setOldCitySearch] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [location, setLocation] = useState<string>("");
  const [currentWeather, setCurrentWeather] = useState();

  // Load saved searches from localStorage when the component mounts
  useEffect(() => {
    const savedCities = localStorage.getItem("savedCities");
    console.log("Saved cities: ", savedCities);
    if (savedCities) {
      setOldCitySearch(JSON.parse(savedCities));
    }
  }, []);

  const handleTextChange = (text: string) => {
    setLocationValue(text);
  };

  const backgroundImageStyle: CSSProperties = {
    backgroundImage: 'url("/backgroundimage3.avif")',
    backgroundSize: "cover",
    backgroundPosition: "center",
    height: "100vh",
  };

  interface WeatherData {
    temperature: number;
    description: string;
    location: string;
    unit: string;
    city_name: string;
    country_code: string;
    state_code: string;
    data: any[];
    lat: number;
    lon: number;
    timezone: string;
  }

  // searches old search when clicked
  const pastSearchClicked = (e: any, city: string) => {
    console.log("City: ", city);
    setLocationValue(city);
    handleSearch(city);
  };

  // deletes old search when clicked
  const deleteOldSearch = (city: string) => {
    const updatedCities = oldCitySearch.filter((c) => c !== city);
    setOldCitySearch(updatedCities);
    localStorage.setItem("savedCities", JSON.stringify(updatedCities));
    console.log("Cities Remaining: ", updatedCities);
  };

  // fetches weather prediction
  const handleSearch = async () => {
    console.log("Searching");
    const trimmedLocation = locationValue.trim();
    if (trimmedLocation === "") {
      setError("Please enter a valid location.");
      console.log("Error");
      return;
    }

    setIsLoading(true);
    setError(null);

    // get 16 day prediction
    try {
      const searchTermResponse = await axios.put(
        `http://192.168.124.21:3001/insertSearchTerm`,
        { searchTerm: trimmedLocation }
      );
      if (!searchTermResponse) {
        // Check if the response is ok
        throw new Error("City not found");
      }
      // Check if the search term already exists in the cities array
      if (!oldCitySearch.includes(trimmedLocation)) {
        let updatedCities = [trimmedLocation, ...oldCitySearch];
        if (updatedCities.length > 5) {
          updatedCities = updatedCities.slice(0, 5);
        }
        setOldCitySearch(updatedCities);
        localStorage.setItem("savedCities", JSON.stringify(updatedCities));
      }

      console.log("Search term response: ", searchTermResponse.data);
      setCurrentWeather(searchTermResponse.data.dailyForecastData);
      setWeather(searchTermResponse.data.sixteenDayForecastData);
      console.log("Current Weather data: ", currentWeather);
      console.log("16 day Weather data: ", weather);
    } catch (error) {
      console.error("Error fetching weather data:", error);
      setError("City not found. Please try again.");
      setWeather(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={backgroundImageStyle}
      className=" items-center  w-[100vw] h-[100vh]  overflow-hidden overflow-y-auto no-scrollbar"
    >
      <p className="text-[#afafaf] text-[25px] sm:text-[25px] md:text-[40px] text-center mt-[20px]">
        Samuel's Weather Forecast
      </p>
      <div className=" bg-opacity-[50%] backdrop-blur-3xl  mt-[20px] flex-col items-center flex-1 justify-center mx-[10px] ">
        <Image
          className="absolute  bottom-0 top-2 left-5"
          src="/search.png"
          width={35}
          height={35}
          alt="search icon"
        />
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
        >
          <input
            color="black"
            type="text"
            id="inputId"
            placeholder="Enter A Location!"
            value={locationValue}
            onChange={(e) => handleTextChange(e.target.value)}
            className=" drop-shadow-2xl bg-opacity-[20%] bg-[#212121] border-[2px] border-gray-500 focus:border-black outline-none py-[10px] px-[100px] w-[100%] rounded-[5px] text-black text-[18px] text-left"
          />
        </form>
      </div>
      <div className="">
        <p className="text-[#ff0000] text-[20px] text-center mt-[10px]">
          {error}
        </p>
      </div>
      {/* Old search suggestions */}
      <div className="flex flex-row items-center justify-center gap-4">
        {oldCitySearch.map((city) => (
          <div className="flex justify-between items-center bg-opacity-50 bg-white rounded-[10px] p-2 w-full max-w-[150px]">
            <p
              className="text-black text-center cursor-pointer text-[12px] md:text-[18px] sm:text-[16px] flex-1"
              onClick={() => pastSearchClicked(null, city)}
            >
              {city}
            </p>
            <p
              className="text-[#FF0000] text-center cursor-pointer text-[20px] ml-4"
              onClick={() => deleteOldSearch(city)}
            >
              X
            </p>
          </div>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <PulseLoader color={"white"} loading={isLoading} size={30} />
        </div>
      ) : (
        currentWeather &&
        weather && (
          <div className=" mt-[50px] mx-[10px]  md:mx-[60px] lg:mx-[170px] sm:mx-[20px] mb-[100px]">
            <WeatherView weather={weather} currentWeather={currentWeather} />
          </div>
        )
      )}
    </div>
  );
}
