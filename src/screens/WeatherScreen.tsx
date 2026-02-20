import { View, Text, StyleSheet, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { BarChart, LineChart, lineDataItem } from 'react-native-gifted-charts';

import useWeather from '../hooks/useWeather';
import StyledButton from '../components/StyledButton';
import DropzoneModal from '../components/DropzoneModal';
import { useDropzone } from '../context/DropzoneContext';
import { useTheme } from '../context/ThemeContext';


export default function WeatherScreen() {
    const { dropzone } = useDropzone();
    const { theme } = useTheme();


    const LOCATION : string = dropzone || "EFOU"; //Oulun lentoasema ICAO koodi

    const [windSpeedType, setWindSpeedType] = React.useState<'KT' | 'MS'>('KT'); //KT or MS
    const [dropzoneModalVisible, setDropzoneModalVisible] = useState(false);


    const {
        current,
        hourly,
        minutely15,
        metarData,
        getLatitude,
        getLongitude,
        metarObject,
        isJumpSafe,
        isNight,
        knotsToMs,
        msToKnots,
        maxCloudCoverLimitSTUDENT,
        maxWindGustLimitLICENSE_B,
        maxWindGustLimitSTUDENT
    } = useWeather({ icaoCode: LOCATION, windSpeedType: windSpeedType });


    //voi vähä tehä kuvaajista ei niin tarkkoja...
    const filterCloseValuesWithIndex = (
        values: number[],
        threshold: number
    ): Array<{ value: number; index: number }> => {
        if (values.length <= 1) return values.map((v, i) => ({ value: v, index: i }));

        const filtered: Array<{ value: number; index: number }> = [{ value: values[0], index: 0 }];

        //make sure it cannot be more than 2, so that not too many datapoints are removed if there is a sudden change in values
        let lastOffset : number = 0;

        for (let i = 1; i < values.length; i++) {

            if(lastOffset > 2){
                    lastOffset = 0;
                    filtered.push({ value: values[i], index: i });
                    continue
                }

            if (Math.abs(values[i] - filtered[filtered.length - 1].value) > threshold) {

                lastOffset++;
                

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


    

    const isaCorrection = (altitude: number, temperature: number | undefined): string => {
        if (temperature === null || temperature === undefined) {
            return "Unknown"; //no data
        }
        //ISA temperature at sea level is something and it decreases by 6.5°C per 1000m
        const isaTemperature = temperature - (6.5 * (altitude / 1000));
        return isaTemperature.toFixed(0).toString() + "°C";
    }


    //also take isNight into account for how safe it is and other stuff....

    return (
        <ScrollView style={{ backgroundColor: theme.colors.background }}>
            <View style={styles.rootContainer}>

                <View style={styles.buttonRow}>
                    <StyledButton
                        title={windSpeedType === 'KT' ? 'Change to m/s' : 'Change to KT'}
                        onPress={() => {
                            if (windSpeedType === 'KT') {
                                //convert to m/s
                                setWindSpeedType('MS');
                            } else {
                                //convert to KT
                                setWindSpeedType('KT');
                            }
                        }}
                        style={styles.rowButton}
                    />
                    <StyledButton
                        title="Change dropzone"
                        onPress={() => setDropzoneModalVisible(true)}
                        style={styles.rowButton}
                    />
                </View>

                <DropzoneModal
                    visible={dropzoneModalVisible}
                    onClose={() => setDropzoneModalVisible(false)}
                />

                <Text style={[styles.title, { color: theme.colors.text }]}>Dropzone: {metarObject?.name ?? LOCATION}</Text>
                <Text style={{ color: theme.colors.textSecondary }}>Wind and weather data for {getLatitude}, {getLongitude}</Text>

                <Text style={[styles.lowerTitle, { color: isJumpSafe() ? theme.colors.success : theme.colors.error }]}>
                    Jumping is probably {isJumpSafe() ? "safe" : !isJumpSafe() ? "dangerous" : "unsure if jumping is safe"} at the moment.
                </Text>

                <Text style={[styles.explanationText, { color: theme.colors.textSecondary }]}>Temperature at 4km : {isaCorrection(4000, current?.temperature_2m)}</Text>

                {current && (
                    <View style={[styles.container]}>
                        <Text style={{ color: theme.colors.text }}>Time: {current.time?.toLocaleString()}</Text>
                        <Text style={{ color: theme.colors.text }}>Wind Gusts 10m: {current.wind_gusts_10m?.toFixed(2)} {windSpeedType === 'KT' ? 'KT' : 'm/s'}</Text>
                        <Text style={{ color: theme.colors.text }}>Wind direction 10m: {current.wind_direction_10m} °</Text>
                        <Text style={[styles.lowerTitle, { color: theme.colors.text }]}>METAR:</Text>
                        <Text style={{ color: theme.colors.textSecondary }}>{metarData}</Text>
                        <Text style={{ color: theme.colors.text }}>Wind Speed: {metarObject?.wspd} KT</Text>
                        <Text style={{ color: theme.colors.text }}>Wind Direction: {metarObject?.wdir} °</Text>

                    </View>
                )}


                {minutely15 && (

                    <View style={[styles.container]}>

                        <Text style={[styles.lowerTitle, { color: theme.colors.text }]}>Wind gust forecast:</Text>
                        <Text style={[styles.explanationText, { color: theme.colors.textSecondary }]}>Wind Gusts (next 12 hours):</Text>

                        <LineChart
                            data={minutely15.wind_gusts_10m ? filterCloseValuesWithIndex(Array.from(minutely15.wind_gusts_10m).slice(48, 96), 0.1)
                                .map((item, newIndex) => ({ value: item.value,  label: (newIndex % 2 === 0) ? getTimeLabels(minutely15.time)[item.index] : '' })) : []}

                            data2={Array(24).fill({ value: (windSpeedType === 'KT' ? msToKnots(maxWindGustLimitSTUDENT) : maxWindGustLimitSTUDENT)})}
                            data3={Array(24).fill({ value: (windSpeedType === 'KT' ? msToKnots(maxWindGustLimitLICENSE_B) : maxWindGustLimitLICENSE_B) })}

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

                            yAxisLabelSuffix={windSpeedType === 'KT' ? 'KT' : 'm/s'}
                            noOfSections={5}
                            hideDataPoints={true}
                            xAxisLabelTextStyle={{ fontSize: 10, color: theme.colors.textSecondary }}
                            allowFontScaling={true}
                            yAxisLabelWidth={70}
                            hideRules={false}
                            hideAxesAndRules={false}
                            yAxisColor={theme.colors.border}
                            xAxisColor={theme.colors.border}
                            yAxisTextStyle={{ color: theme.colors.textSecondary }}
                            initialSpacing={0}
                        />

                        <Text style={[styles.explanationText, { color: theme.colors.textSecondary }]}>Yellow line: Maximum wind gust limit for student pilots</Text>
                        <Text style={[styles.explanationText, { color: theme.colors.textSecondary }]}>Red line: Maximum wind gust limit for licensed pilots, tandems</Text>

                        <Text style={[styles.lowerTitle, { color: theme.colors.text }]}>Hourly Weather:</Text>
                        <Text style={[styles.explanationText, { color: theme.colors.textSecondary }]}>Wind gusts 10m (previous 12 hours):</Text>
                        <LineChart
                            data={minutely15.wind_gusts_10m ? filterCloseValuesWithIndex(Array.from(minutely15.wind_gusts_10m).slice(0, 24), 0.1)
                                .map((item, newIndex) => ({ value: item.value, label: (newIndex % 2 === 0) ? getTimeLabels(minutely15.time)[item.index] : '' })) : []}
                            data2={Array(24).fill({ value: (windSpeedType === 'KT' ? msToKnots(maxWindGustLimitSTUDENT) : maxWindGustLimitSTUDENT)})}
                            data3={Array(24).fill({ value: (windSpeedType === 'KT' ? msToKnots(maxWindGustLimitLICENSE_B) : maxWindGustLimitLICENSE_B) })}
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

                            height={200}
                            adjustToWidth={true}
                            yAxisLabelSuffix={windSpeedType === 'KT' ? 'KT' : 'm/s'}
                            xAxisLabelTextStyle={{ fontSize: 10, color: theme.colors.textSecondary }}
                            xAxisTextNumberOfLines={2}
                            allowFontScaling={true}
                            yAxisLabelWidth={70}
                            noOfSections={4}
                            hideRules={false}
                            hideAxesAndRules={false}
                            yAxisColor={theme.colors.border}
                            xAxisColor={theme.colors.border}
                            yAxisTextStyle={{ color: theme.colors.textSecondary }}
                            initialSpacing={0}
                        />

                        <Text style={[styles.explanationText, { color: theme.colors.textSecondary }]}>Yellow line: Maximum wind gust limit for student pilots</Text>
                        <Text style={[styles.explanationText, { color: theme.colors.textSecondary }]}>Red line: Maximum wind gust limit for licensed pilots, tandems</Text>

                    </View>
                )}

                {hourly && (
                    <View style={[styles.container]}>

                        <Text style={[styles.explanationText, { color: theme.colors.textSecondary }]}>Cloud cover (previous 24 hours):</Text>
                        <LineChart
                            data={hourly.cloud_cover_low ? filterCloseValuesWithIndex(Array.from(hourly.cloud_cover_low).slice(0, 24), 2)
                                .map((item, newIndex) => ({ value: item.value, label: (newIndex % 2 === 0) ? getTimeLabels(hourly.time)[item.index] : '' })) : []}
                            thickness1={4}
                            color1='gray'
                            areaChart1={true}
                            startFillColor={'gray'}
                            hideDataPoints={true}
                            width={250}
                            height={200}
                            adjustToWidth={true}
                            yAxisLabelSuffix={'%'}
                            xAxisLabelTextStyle={{ fontSize: 10, color: theme.colors.textSecondary }}
                            xAxisTextNumberOfLines={2}
                            allowFontScaling={true}
                            yAxisLabelWidth={70}
                            noOfSections={4}
                            hideRules={false}
                            hideAxesAndRules={false}
                            yAxisColor={theme.colors.border}
                            xAxisColor={theme.colors.border}
                            yAxisTextStyle={{ color: theme.colors.textSecondary }}
                            initialSpacing={0}
                        />
                    </View>
                )}
            </View>
        </ScrollView>
    )
}

//<Text style={[styles.explanationText, { color: theme.colors.textSecondary }]}>This is based on the current wind gusts at 10m and cloud cover under 3km. Night time jumping is not allowed for students. For licensed pilots and tandems, the limits are higher and night time jumping is allowed.</Text>


const styles = StyleSheet.create({
    rootContainer: {
        flex: 1,
        marginHorizontal: 20,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        marginTop: 40,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingBottom: 20,
        marginBottom: 20,
    },
    title:{
        fontSize: 20,
        fontWeight: 'bold',
        fontFamily: 'Inter_700Bold',
    },
    lowerTitle:{
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: 'Inter_600SemiBold',
    },
    explanationText:{
        marginBottom: 10,
        fontFamily: 'Inter_400Regular',
    },
    buttonRow: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 10,
    },
    rowButton: {
        flex: 1,
        marginTop: 0,
    }
})

