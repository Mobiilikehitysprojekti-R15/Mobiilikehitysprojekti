import { View, Text, StyleSheet, ScrollView } from 'react-native'
import React from 'react'
import { fetchWeatherApi } from 'openmeteo';
import { useEffect } from 'react';
import { BarChart, LineChart, lineDataItem } from 'react-native-gifted-charts';
import { currentWeather, hourlyWeather, fifteenMinuteWeather } from '../types/WeatherTypes';


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
    minutely_15: ["wind_speed_10m", "wind_speed_80m", "wind_speed_120m", "wind_direction_10m", "wind_direction_80m", "wind_gusts_10m", "visibility"],
    wind_speed_unit: "ms",
    forecast_minutely_15: 48,
};


export default function Weathertest() {

    const [current, setCurrent] = React.useState<currentWeather | null>(null);
    const [hourly, setHourly] = React.useState<hourlyWeather | null>(null);
    const [minutely15, setMinutely15] = React.useState<fifteenMinuteWeather | null>(null);

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

        fetchData();
    }, []);


    const filterCloseValuesWithIndex = (
        values: number[],
        threshold: number
    ): Array<{ value: number; index: number }> => {
        if (values.length <= 1) return values.map((v, i) => ({ value: v, index: i }));

        const filtered: Array<{ value: number; index: number }> = [{ value: values[0], index: 0 }];

        for (let i = 1; i < values.length; i++) {
            if (Math.abs(values[i] - filtered[filtered.length - 1].value) > threshold) {
                filtered.push({ value: values[i], index: i });
            }
        }

        return filtered;
    };

    const getTimeLabels = (dates: Date[]): string[] => {
        return dates.map(date => {
            const hours = date.getHours().toString().padStart(2, '0');
            const minutes = date.getMinutes().toString().padStart(2, '0');
            return `${hours}:${minutes}`;
        });
    };


    return (
        <ScrollView>
            <View style={styles.rootContainer}>
                <Text style={styles.title}>Weathertest</Text>
                <Text>Fetching weather data for latitude: {params.latitude}, longitude: {params.longitude}</Text>


                {minutely15 && (

                    <View style={styles.container}>

                        <Text style={styles.lowerTitle}>Wind gust forecast:</Text>
                        <Text style={styles.explanationText}>Wind Gusts (next 8 hours):</Text>

                        <LineChart
                            data={minutely15.wind_gusts_10m ? filterCloseValuesWithIndex(Array.from(minutely15.wind_gusts_10m).slice(0, 31), 0.1)
                                .map((item, newIndex) => ({ value: item.value,  label: (newIndex % 2 === 0) ? getTimeLabels(minutely15.time)[item.index] : '' })) : []}

                            data2={Array(24).fill({ value: 8})}
                            data3={Array(24).fill({ value: 11})}
                            color2='yellow'
                            color3='red'

                            thickness1={4}
                            color1='blue'

                            thickness2={4}
                            thickness3={4}

                            height={200}
                            adjustToWidth={true}
                            width={250}
                            

                            areaChart1={true}
                            startFillColor={'blue'}

                            yAxisLabelSuffix='m/s'
                            noOfSections={5}
                            hideDataPoints={true}
                            xAxisLabelTextStyle={{ fontSize: 10 }}
                            allowFontScaling={true}
                            yAxisLabelWidth={70}
                            hideRules={false}
                            hideAxesAndRules={false}
                            yAxisColor={'black'}
                            xAxisColor={'black'}
                            yAxisTextStyle={{ color: 'black' }}
                            initialSpacing={0}
                        />

                    </View>
                )}



                {current && (
                    <View style={styles.container}>
                        <Text style={styles.lowerTitle}>Current Weather:</Text>
                        <Text>Time: {current.time?.toString()}</Text>
                        <Text>Wind Gusts 10m: {current.wind_gusts_10m}</Text>
                        <Text>Wind Direction 10m: {current.wind_direction_10m}</Text>
                        <Text>Wind Speed 10m: {current.wind_speed_10m}</Text>
                        <Text>Cloud Cover: {current.cloud_cover}</Text>
                        <Text>Weather Code: {current.weather_code}</Text>
                    </View>
                )}

                {hourly && (
                    <View style={styles.container}>
                        <Text style={styles.lowerTitle}>Hourly Weather:</Text>
                        <Text style={styles.explanationText}>Wind gusts 10m (previus 24 hours):</Text>
                        <LineChart
                            data={hourly.wind_gusts_10m ? filterCloseValuesWithIndex(Array.from(hourly.wind_gusts_10m).slice(0, 24), 0.5)
                                .map((item, newIndex) => ({ value: item.value, label: (newIndex % 2 === 0) ? getTimeLabels(hourly.time)[item.index] : '' })) : []}
                            data2={Array(24).fill({ value: 8})}
                            data3={Array(24).fill({ value: 11})}
                            color2='yellow'
                            color3='red'

                            thickness1={4}
                            color1='blue'

                            thickness2={4}
                            thickness3={4}

                            areaChart1={true}
                            startFillColor={'blue'}
                            hideDataPoints={true}
                            width={250}
                            showReferenceLine1={true}
                            referenceLine1Position={8}
                            
                            height={200}
                            adjustToWidth={true}
                            yAxisLabelSuffix='m/s'
                            xAxisLabelTextStyle={{ fontSize: 10 }}
                            xAxisTextNumberOfLines={2}
                            allowFontScaling={true}
                            yAxisLabelWidth={70}
                            noOfSections={4}
                            hideRules={false}
                            hideAxesAndRules={false}
                            yAxisColor={'black'}
                            xAxisColor={'black'}
                            yAxisTextStyle={{ color: 'black' }}
                            initialSpacing={0}
                        />
                    </View>
                )}
            </View>
        </ScrollView>
    )
}


const styles = StyleSheet.create({
    rootContainer: {
        flex: 1,
        marginHorizontal: 20,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
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
    },
    explanationText:{
        marginBottom: 10,
    }
})