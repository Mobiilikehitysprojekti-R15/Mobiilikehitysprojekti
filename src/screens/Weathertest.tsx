import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { fetchWeatherApi } from 'openmeteo';
import { useEffect } from 'react';


const params = {
    latitude: 64.9301,
    longitude: 25.3546,
    hourly: ["temperature_2m", "wind_speed_1000hPa", "wind_speed_950hPa", "wind_speed_925hPa", "wind_speed_700hPa",
        "wind_speed_600hPa", "weather_code", "wind_speed_10m", "wind_speed_80m", "wind_speed_120m", "wind_speed_180m", "wind_direction_10m",
        "wind_direction_80m", "wind_direction_120m", "wind_direction_180m", "wind_gusts_10m", "cloud_cover_1000hPa", "cloud_cover_975hPa",
        "cloud_cover_950hPa", "cloud_cover_925hPa", "cloud_cover_900hPa", "cloud_cover_850hPa", "cloud_cover_800hPa", "cloud_cover_700hPa",
        "cloud_cover_600hPa", "wind_speed_975hPa", "wind_speed_900hPa", "wind_speed_800hPa", "wind_speed_850hPa", "wind_direction_800hPa",
        "wind_direction_850hPa", "wind_direction_900hPa", "wind_direction_925hPa", "wind_direction_950hPa", "wind_direction_975hPa",
        "wind_direction_1000hPa", "wind_direction_700hPa", "wind_direction_600hPa"],

    current: ["wind_gusts_10m", "wind_direction_10m", "wind_speed_10m", "cloud_cover", "weather_code"],
    minutely_15: ["wind_speed_10m", "wind_speed_80m", "wind_direction_10m", "wind_direction_80m", "wind_gusts_10m"],
    wind_speed_unit: "ms",
    forecast_minutely_15: 48,
};

type currentWeatherParams = {
    time?: Date,
    wind_gusts_10m?: number,
    wind_direction_10m?: number,
    wind_speed_10m?: number,
    cloud_cover?: number,
    weather_code?: number,
}

type hourlyWeatherParams = {
    time: Date[],
    temperature_2m: Float32Array<ArrayBufferLike> | null | undefined,
    wind_speed_1000hPa: Float32Array<ArrayBufferLike> | null | undefined,
    wind_speed_950hPa: Float32Array<ArrayBufferLike> | null | undefined,
    wind_speed_925hPa: Float32Array<ArrayBufferLike> | null | undefined,
    wind_speed_850hPa: Float32Array<ArrayBufferLike> | null | undefined,
    wind_speed_700hPa: Float32Array<ArrayBufferLike> | null | undefined,
    wind_speed_600hPa: Float32Array<ArrayBufferLike> | null | undefined,
    weather_code: Float32Array<ArrayBufferLike> | null | undefined,
    wind_speed_10m?: Float32Array<ArrayBufferLike> | null | undefined,
    wind_speed_80m?: Float32Array<ArrayBufferLike> | null | undefined,
    wind_speed_120m?: Float32Array<ArrayBufferLike> | null | undefined,
    wind_speed_180m?: Float32Array<ArrayBufferLike> | null | undefined,
    wind_direction_10m?: Float32Array<ArrayBufferLike> | null | undefined,
    wind_direction_80m?: Float32Array<ArrayBufferLike> | null | undefined,
    wind_direction_120m?: Float32Array<ArrayBufferLike> | null | undefined,
    wind_direction_180m?: Float32Array<ArrayBufferLike> | null | undefined,
    cloud_cover_1000hPa?: Float32Array<ArrayBufferLike> | null | undefined,
    cloud_cover_975hPa?: Float32Array<ArrayBufferLike> | null | undefined,
    cloud_cover_950hPa?: Float32Array<ArrayBufferLike> | null | undefined,
    cloud_cover_925hPa?: Float32Array<ArrayBufferLike> | null | undefined,
    cloud_cover_900hPa?: Float32Array<ArrayBufferLike> | null | undefined,
    cloud_cover_850hPa?: Float32Array<ArrayBufferLike> | null | undefined,
    cloud_cover_800hPa?: Float32Array<ArrayBufferLike> | null | undefined,
    cloud_cover_700hPa?: Float32Array<ArrayBufferLike> | null | undefined,
    cloud_cover_600hPa?: Float32Array<ArrayBufferLike> | null | undefined,
    wind_speed_975hPa?: Float32Array<ArrayBufferLike> | null | undefined,
    wind_speed_900hPa?: Float32Array<ArrayBufferLike> | null | undefined,
    wind_speed_800hPa?: Float32Array<ArrayBufferLike> | null | undefined,
    wind_direction_800hPa?: Float32Array<ArrayBufferLike> | null | undefined,
    wind_direction_850hPa?: Float32Array<ArrayBufferLike> | null | undefined,
    wind_direction_900hPa?: Float32Array<ArrayBufferLike> | null | undefined,
    wind_direction_925hPa?: Float32Array<ArrayBufferLike> | null | undefined,
    wind_direction_950hPa?: Float32Array<ArrayBufferLike> | null | undefined,
    wind_direction_975hPa?: Float32Array<ArrayBufferLike> | null | undefined,
    wind_direction_1000hPa?: Float32Array<ArrayBufferLike> | null | undefined,
    wind_direction_700hPa?: Float32Array<ArrayBufferLike> | null | undefined,
    wind_direction_600hPa?: Float32Array<ArrayBufferLike> | null | undefined,
}

type minutelyWeatherParams = {
    time: Date[],
    wind_speed_10m: Float32Array<ArrayBufferLike> | null | undefined,
    wind_speed_80m: Float32Array<ArrayBufferLike> | null | undefined,
    wind_direction_10m: Float32Array<ArrayBufferLike> | null | undefined,
    wind_direction_80m: Float32Array<ArrayBufferLike> | null | undefined,
    wind_gusts_10m: Float32Array<ArrayBufferLike> | null | undefined,
}

export default function Weathertest() {

    const [current, setCurrent] = React.useState<currentWeatherParams | null>(null);
    const [hourly, setHourly] = React.useState<hourlyWeatherParams | null>(null);
    const [minutely15, setMinutely15] = React.useState<minutelyWeatherParams | null>(null);

    useEffect(() => {
        const url = "https://api.open-meteo.com/v1/forecast";
        const fetchData = async () => {
            try {
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
                    minutely_15:{
                        time: Array.from(
                            { length: (Number(minutely15.timeEnd()) - Number(minutely15.time())) / minutely15.interval() },
                            (_, i) => new Date((Number(minutely15.time()) + i * minutely15.interval() + utcOffsetSeconds) * 1000)
                        ),
                        wind_speed_10m: minutely15.variables(0)!.valuesArray(),
                        wind_speed_80m: minutely15.variables(1)!.valuesArray(),
                        wind_direction_10m: minutely15.variables(2)!.valuesArray(),
                        wind_direction_80m: minutely15.variables(3)!.valuesArray(),
                        wind_gusts_10m: minutely15.variables(4)!.valuesArray(),
                        visibility: minutely15.variables(5)!.valuesArray(),
                    }
                };

                setCurrent(weatherData.current);
                setHourly(weatherData.hourly);
                setMinutely15(weatherData.minutely_15);

            } catch (error) {
                console.error("Error fetching weather data:", error);
            }
        };

        fetchData();
    }, []);


    return (
        <View style={styles.rootContainer}>
            <Text style={styles.title}>Weathertest</Text>
            <Text style={styles.lowerTitle}>Current Weather:</Text>
            {current && (
                <View style={styles.container}>
                    <Text>Time: {current.time?.toString()}</Text>
                    <Text>Wind Gusts 10m: {current.wind_gusts_10m}</Text>
                    <Text>Wind Direction 10m: {current.wind_direction_10m}</Text>
                    <Text>Wind Speed 10m: {current.wind_speed_10m}</Text>
                    <Text>Cloud Cover: {current.cloud_cover}</Text>
                    <Text>Weather Code: {current.weather_code}</Text>
                </View>
            )}
            <Text>Hourly Weather Data Loaded: {hourly ? "Yes" : "No"}</Text>
            {hourly && (
                <View style={styles.container}>
                    <Text>Number of Hourly Entries: {hourly.time.length}</Text>

                    <Text>First Hourly Entry:</Text>
                    <Text>Time: {hourly.time[0].toString()}</Text>
                    <Text>Temperature 2m: {hourly.temperature_2m ? hourly.temperature_2m[0] : 'N/A'}</Text>
                    <Text>Wind Speed 1000hPa: {hourly.wind_speed_1000hPa ? hourly.wind_speed_1000hPa[0] : 'N/A'}</Text>
                    <Text>Wind Speed 950hPa: {hourly.wind_speed_950hPa ? hourly.wind_speed_950hPa[0] : 'N/A'}</Text>
                    <Text>Wind Speed 925hPa: {hourly.wind_speed_925hPa ? hourly.wind_speed_925hPa[0] : 'N/A'}</Text>
                    <Text>Wind Speed 850hPa: {hourly.wind_speed_850hPa ? hourly.wind_speed_850hPa[0] : 'N/A'}</Text>
                    <Text>Wind Speed 700hPa: {hourly.wind_speed_700hPa ? hourly.wind_speed_700hPa[0] : 'N/A'}</Text>
                    <Text>Wind Speed 600hPa: {hourly.wind_speed_600hPa ? hourly.wind_speed_600hPa[0] : 'N/A'}</Text>
                    <Text>Weather Code: {hourly.weather_code ? hourly.weather_code[0] : 'N/A'}</Text>

                </View>
            )}
            <Text>Minutely 15 Weather Data Loaded: {minutely15 ? "Yes" : "No"}</Text>
            {minutely15 && (
                <View style={styles.container}>
                    <Text>Number of Minutely 15 Entries: {minutely15.time.length}</Text>
                    <Text>Second Minutely 15 Entry:</Text>
                    <Text>Time: {minutely15.time[1].toString()}</Text>
                    <Text>Wind Speed 10m: {minutely15.wind_speed_10m ? minutely15.wind_speed_10m[1] : 'N/A'}</Text>
                    <Text>Wind Speed 80m: {minutely15.wind_speed_80m ? minutely15.wind_speed_80m[1] : 'N/A'}</Text>
                    <Text>Wind Direction 10m: {minutely15.wind_direction_10m ? minutely15.wind_direction_10m[1] : 'N/A'}</Text>
                    <Text>Wind Direction 80m: {minutely15.wind_direction_80m ? minutely15.wind_direction_80m[1] : 'N/A'}</Text>
                    <Text>Wind Gusts 10m: {minutely15.wind_gusts_10m ? minutely15.wind_gusts_10m[1] : 'N/A'}</Text>
                </View>
            )}

        </View>
    )
}


const styles = StyleSheet.create({
    rootContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 70,
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
    },
    title:{
        fontSize: 20,
        fontWeight: 'bold',
    },
    lowerTitle:{
        fontSize: 16,
        fontWeight: 'bold',
    }

})