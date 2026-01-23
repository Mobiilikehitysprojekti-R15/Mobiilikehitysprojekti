import React, { useEffect } from 'react'
import { currentWeather, hourlyWeather, fifteenMinuteWeather, metarType } from '../types/WeatherTypes'
import { fetchWeatherApi } from 'openmeteo';


type Props = {
    icaoCode?: string;
    windSpeedType?: 'KT' | 'MS';
};

export default function useWeather({ icaoCode, windSpeedType }: Props) {


    const [current, setCurrent] = React.useState<currentWeather | null>(null);
    const [hourly, setHourly] = React.useState<hourlyWeather | null>(null);
    const [minutely15, setMinutely15] = React.useState<fifteenMinuteWeather | null>(null);

    const [metarData, setMetarData] = React.useState<string>('');
    const [getLatitude, setLatitude] = React.useState<number>(64.9301);
    const [getLongitude, setLongitude] = React.useState<number>(25.3546);

    const [metarObject, setMetarObject] = React.useState<metarType | null>(null);



    useEffect(() => {
        getMetarData();
        fetchData();
    }, [icaoCode, windSpeedType]);

    if (!icaoCode) {
        icaoCode = 'EFOU'; //Oulun lentoasema oletuksena
    }


    const metarUrl = `https://aviationweather.gov/api/data/metar?ids=${icaoCode}&format=json`;
    //"https://metar-taf.com/api/metar.php?iata=KAO&format=json";

    const getMetarData = async () => {
        try {
            const response = await fetch(metarUrl);
            const data = await response.json();
            console.log("METAR Data:", data);

            //raaka metar data talteen
            if (data && data[0] && data[0].rawOb) {
                setMetarData(data[0].rawOb);

                //päivitetään koordinaatit metar datan perusteella

                setLatitude(data[0].lat);
                setLongitude(data[0].lon);

                setMetarObject(data[0]);
            }

        } catch (error) {
            console.error("Error fetching METAR data:", error);
        }
    };


    const url = "https://api.open-meteo.com/v1/forecast";

    const fetchData = async () => {
        try {

            const params = {
                latitude: getLatitude,
                longitude: getLongitude,
                hourly: ["temperature_2m", "wind_speed_1000hPa", "wind_speed_950hPa", "wind_speed_925hPa", "wind_speed_700hPa",
                    "wind_speed_600hPa", "weather_code", "wind_speed_10m", "wind_speed_80m", "wind_speed_120m", "wind_speed_180m", "wind_direction_10m",
                    "wind_direction_80m", "wind_direction_120m", "wind_direction_180m", "wind_gusts_10m", "cloud_cover_1000hPa", "cloud_cover_975hPa",
                    "cloud_cover_950hPa", "cloud_cover_925hPa", "cloud_cover_900hPa", "cloud_cover_850hPa", "cloud_cover_800hPa", "cloud_cover_700hPa",
                    "cloud_cover_600hPa", "wind_speed_975hPa", "wind_speed_900hPa", "wind_speed_800hPa", "wind_speed_850hPa", "wind_direction_800hPa",
                    "wind_direction_850hPa", "wind_direction_900hPa", "wind_direction_925hPa", "wind_direction_950hPa", "wind_direction_975hPa",
                    "wind_direction_1000hPa", "wind_direction_700hPa", "wind_direction_600hPa"],

                current: ["wind_gusts_10m", "wind_direction_10m", "wind_speed_10m", "cloud_cover", "weather_code"],
                minutely_15: ["wind_speed_10m", "wind_speed_80m", "wind_speed_120m", "wind_direction_10m", "wind_direction_80m", "wind_gusts_10m", "visibility"],
                wind_speed_unit: (windSpeedType === 'KT') ? "kn" : "ms",
                forecast_minutely_15: 48,
            };

            const data = await fetchWeatherApi(url, params);

            const utcOffsetSeconds = data[0].utcOffsetSeconds();

            const hourly = data[0].hourly()!;
            const current = data[0].current()!;
            const minutely15 = data[0].minutely15()!;

            const weatherData = {
                current: {
                    time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
                    wind_gusts_10m: current.variables(0)!.value(),
                    wind_direction_10m: current.variables(1)!.value(),
                    wind_speed_10m: current.variables(2)!.value(),
                    cloud_cover: current.variables(3)!.value(),
                    weather_code: current.variables(4)!.value(),
                },
                hourly: {
                    time: Array.from(
                        { length: (Number(hourly.timeEnd()) - Number(hourly.time())) / hourly.interval() },
                        (_, i) => new Date((Number(hourly.time()) + i * hourly.interval() + utcOffsetSeconds) * 1000)
                    ),
                    temperature_2m: hourly.variables(0)!.valuesArray(),
                    wind_speed_1000hPa: hourly.variables(1)!.valuesArray(),
                    wind_speed_950hPa: hourly.variables(2)!.valuesArray(),
                    wind_speed_925hPa: hourly.variables(3)!.valuesArray(),
                    wind_speed_700hPa: hourly.variables(4)!.valuesArray(),
                    wind_speed_600hPa: hourly.variables(5)!.valuesArray(),
                    weather_code: hourly.variables(6)!.valuesArray(),
                    wind_speed_10m: hourly.variables(7)!.valuesArray(),
                    wind_speed_80m: hourly.variables(8)!.valuesArray(),
                    wind_speed_120m: hourly.variables(9)!.valuesArray(),
                    wind_speed_180m: hourly.variables(10)!.valuesArray(),
                    wind_direction_10m: hourly.variables(11)!.valuesArray(),
                    wind_direction_80m: hourly.variables(12)!.valuesArray(),
                    wind_direction_120m: hourly.variables(13)!.valuesArray(),
                    wind_direction_180m: hourly.variables(14)!.valuesArray(),
                    wind_gusts_10m: hourly.variables(15)!.valuesArray(),
                    cloud_cover_1000hPa: hourly.variables(16)!.valuesArray(),
                    cloud_cover_975hPa: hourly.variables(17)!.valuesArray(),
                    cloud_cover_950hPa: hourly.variables(18)!.valuesArray(),
                    cloud_cover_925hPa: hourly.variables(19)!.valuesArray(),
                    cloud_cover_900hPa: hourly.variables(20)!.valuesArray(),
                    cloud_cover_850hPa: hourly.variables(21)!.valuesArray(),
                    cloud_cover_800hPa: hourly.variables(22)!.valuesArray(),
                    cloud_cover_700hPa: hourly.variables(23)!.valuesArray(),
                    cloud_cover_600hPa: hourly.variables(24)!.valuesArray(),
                    wind_speed_975hPa: hourly.variables(25)!.valuesArray(),
                    wind_speed_900hPa: hourly.variables(26)!.valuesArray(),
                    wind_speed_800hPa: hourly.variables(27)!.valuesArray(),
                    wind_speed_850hPa: hourly.variables(28)!.valuesArray(),
                    wind_direction_800hPa: hourly.variables(29)!.valuesArray(),
                    wind_direction_850hPa: hourly.variables(30)!.valuesArray(),
                    wind_direction_900hPa: hourly.variables(31)!.valuesArray(),
                    wind_direction_925hPa: hourly.variables(32)!.valuesArray(),
                    wind_direction_950hPa: hourly.variables(33)!.valuesArray(),
                    wind_direction_975hPa: hourly.variables(34)!.valuesArray(),
                    wind_direction_1000hPa: hourly.variables(35)!.valuesArray(),
                    wind_direction_700hPa: hourly.variables(36)!.valuesArray(),
                    wind_direction_600hPa: hourly.variables(37)!.valuesArray(),

                },
                minutely_15: {
                    time: Array.from(
                        { length: (Number(minutely15.timeEnd()) - Number(minutely15.time())) / minutely15.interval() },
                        (_, i) => new Date((Number(minutely15.time()) + i * minutely15.interval() + utcOffsetSeconds) * 1000)
                    ),
                    wind_speed_10m: minutely15.variables(0)!.valuesArray(),
                    wind_speed_80m: minutely15.variables(1)!.valuesArray(),
                    wind_speed_120m: minutely15.variables(2)!.valuesArray(),
                    wind_direction_10m: minutely15.variables(3)!.valuesArray(),
                    wind_direction_80m: minutely15.variables(4)!.valuesArray(),
                    wind_gusts_10m: minutely15.variables(5)!.valuesArray(),
                    visibility: minutely15.variables(6)!.valuesArray(),
                }
            };

            setCurrent(weatherData.current);
            setHourly(weatherData.hourly);
            setMinutely15(weatherData.minutely_15);

        } catch (error) {
            console.error("Error fetching weather data:", error);
        }
    };



    return {      
        current,
        hourly,
        minutely15,
        metarData,
        getLatitude,
        getLongitude,
        metarObject,
     };
}