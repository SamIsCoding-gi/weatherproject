"use client";
import Image from "next/image";
import { useState, CSSProperties, ChangeEvent, FormEvent } from "react";
import { Weather } from "./weatherDataInterface";

const WeatherView = ({
  weather,
  currentWeather,
}: {
  weather: Weather;
  currentWeather: any;
}) => {
  // sets text colour based on temperature
  const getTemperatureColor = (temp: number) => {
    const minTemp = 12;
    const maxTemp = 29;
    const clampedTemp = Math.max(minTemp, Math.min(maxTemp, temp));
    const ratio = (clampedTemp - minTemp) / (maxTemp - minTemp);

    // Define the color stops
    const colors = [
      { r: 0, g: 0, b: 255 }, // Blue
      { r: 0, g: 128, b: 255 }, // Light Blue
      { r: 0, g: 255, b: 255 }, // Cyan
      { r: 0, g: 255, b: 128 }, // Light Green
      { r: 0, g: 255, b: 0 }, // Green
      { r: 128, g: 255, b: 0 }, // Yellow-Green
      { r: 255, g: 255, b: 0 }, // Yellow
      { r: 255, g: 128, b: 0 }, // Orange
      { r: 255, g: 0, b: 0 }, // Red
    ];

    // Calculate the index of the two colors to interpolate between
    const colorIndex = Math.floor(ratio * (colors.length - 1));
    const color1 = colors[colorIndex];
    const color2 = colors[colorIndex + 1] || colors[colorIndex];

    // Calculate the interpolation factor
    const colorRatio = (ratio * (colors.length - 1)) % 1;

    // Interpolate between the two colors
    const r = Math.round(color1.r + (color2.r - color1.r) * colorRatio);
    const g = Math.round(color1.g + (color2.g - color1.g) * colorRatio);
    const b = Math.round(color1.b + (color2.b - color1.b) * colorRatio);

    return `rgb(${r}, ${g}, ${b})`;
  };

  const temp = currentWeather.data[0].temp;
  const tempColor = getTemperatureColor(temp);
  return (
    <div className=" border-2 border-transparent flex-1 items-center justify-center bg-white p-4 md:p-8 lg:p-12 backdrop-blur-3xl rounded-[10px] bg-opacity-[50%] ">
      <div className=" flex flex-row justify-between items-center ">
        <span className=" text-[12px] sm:text-[15px] md:text-[20px] text-[#525252] font-bold">
          {currentWeather.data[0].city_name}
        </span>
        <span className=" text-[12px] sm:text-[15px] md:text-[20px] text-[#525252] font-bold">
          {new Date(currentWeather.data[0].ob_time).toLocaleDateString(
            "en-US",
            {
              weekday: "short",
              month: "short",
              day: "numeric",
              year: "numeric",
            }
          )}
        </span>
        <span className=" text-[12px] sm:text-[15px] md:text-[20px] text-[#525252] font-bold">
          {currentWeather.data[0].country_code}
        </span>
      </div>

      <div className=" flex flex-col">
        <div className="mt-[20px] flex flex-row justify-center items-start mb-[80px]">
          <div className=" mr-[30px]">
            <p
              className="sm:text-7xl md:text-9xl text-[80px] font-black text-center"
              style={{ color: tempColor }}
            >
              {currentWeather.data[0].temp}°
            </p>
            <p className=" sm:text-5xl md:text-7xl text-[40px] text-[#525252] text-center">
              {currentWeather.data[0].weather.description}
            </p>
          </div>
          <div className=" justify-center items-center ml-[30px] ">
            <div className=" flex flex-row items-center mb-[5px]">
              <Image
                className="mr-[20px] w-[20px] h-[20px] sm:w-[25px] sm:h-[25px] md:w-[30px] md:h-[30px]"
                layout="fixed"
                src="/wind.png"
                width={25}
                height={25}
                alt="wind speed icon"
              />
              <p className=" sm:text-[20px] md:text-[30px] text-[17px] text-[#525252] text-center ">
                {currentWeather.data[0].wind_spd}
              </p>
            </div>

            <div className=" flex flex-row items-center mb-[5px] ">
              <Image
                className="mr-[20px] w-[20px] h-[20px] sm:w-[25px] sm:h-[25px] md:w-[30px] md:h-[30px]"
                layout="fixed"
                src="/humidity-sensor.png"
                width={25}
                height={25}
                alt="humidity icon"
              />
              <p className=" sm:text-[20px] md:text-[30px] text-[17px] text-[#525252] text-center ">
                {currentWeather.data[0].rh}
              </p>
            </div>

            <div className=" flex flex-row items-center mb-[5px]">
              <Image
                className="mr-[20px] w-[20px] h-[20px] sm:w-[25px] sm:h-[25px] md:w-[30px] md:h-[30px]"
                layout="fixed"
                src="/air-quality.png"
                width={22}
                height={22}
                alt="air quality icon"
              />
              <p className=" sm:text-[20px] md:text-[30px] text-[17px] text-[#525252] text-center ">
                {currentWeather.data[0].aqi}
              </p>
            </div>

            <p className=" sm:text-[20px] md:text-[30px] text-[13px] text-[#525252] text-center mb-[5px] ">
              Feels like {currentWeather.data[0].app_temp}°
            </p>
          </div>
        </div>
        <div>
          <div className="flex flex-crow items-center justify-center w-full">
            <hr className="border-[#7f7f7f] border-[1px] w-full mt-[20px] mb-[20px]" />
            <p className="sm:text-[20px] md:text-[30px] text-[17px] text-[#525252] text-center">
              16-Day Forecast
            </p>
            <hr className="border-[#7f7f7f] border-[1px] w-full mt-[20px] mb-[20px]" />
          </div>

          <div className="overflow-x-auto">
            <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-8 gap-4 mt-4">
              {weather.data.map((day, index) => (
                <div
                  key={index}
                  className={`mt-2 flex flex-col items-center justify-center ${
                    index === 0
                      ? "border-[1px] border-grey-200 rounded-[12px]"
                      : ""
                  }`}
                >
                  <p className=" text-center sm:text-lg md:text-lg text-[15px] font-black text-[#292929]">
                    {new Date(day.valid_date).toLocaleDateString("en-US", {
                      weekday: "short",
                    })}
                  </p>
                  <div className="flex flex-row items-center justify-center"></div>
                  <p className=" text-center sm:text-xl md:text-xl text-[20px] font-black text-[#3e3e3e] ">
                    {day.temp}°
                  </p>
                  <div className=" flex flex-col">
                    <p className=" text-center sm:text-[15px] md:text-[15px] text-[10px] text-[#525252] ">
                      H {day.high_temp}°
                    </p>
                    <p className=" text-center sm:text-[15px] md:text-[15px] text-[10px] text-[#525252] ">
                      l {day.min_temp}°
                    </p>
                    <p className=" text-center sm:text-[15px] md:text-[15px] text-[10px] text-[#525252] ">
                      Precip: {day.precip}
                    </p>
                    <p className=" text-center sm:text-[15px] md:text-[15px] text-[10px] text-[#525252] ">
                      UV index:: {day.uv}
                    </p>
                    <p className=" text-center sm:text-[15px] md:text-[15px] text-[10px] text-[#373737] font-black ">
                      {day.weather.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherView;
