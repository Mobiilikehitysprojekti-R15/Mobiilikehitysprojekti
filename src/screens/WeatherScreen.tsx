import { View, Text, StyleSheet, ScrollView } from 'react-native'
import React from 'react'
import { BarChart, LineChart, lineDataItem } from 'react-native-gifted-charts';

import useWeather from '../hooks/useWeather';
import StyledButton from '../components/StyledButton';


export default function WeatherScreen() {


    const LOCATION : string = "EFOU"; //Oulun lentoasema ICAO koodi

    //tee parempi tapa määritellä turvallisuusrajat riippuen lisensseistä ja hyppytyypistä (tandem on 11/ms)
    const maxWindGustLimitSTUDENT : number = 8; //m/s
    const maxWindGustLimitLICENSE_B : number = 11; //m/s
    const maxCloudCoverLimitSTUDENT : number = 75; //prosenttia

    const [windSpeedType, setWindSpeedType] = React.useState<'KT' | 'MS'>('KT'); //KT or MS


    const {
        current,
        hourly,
        minutely15,
        metarData,
        getLatitude,
        getLongitude,
        metarObject,
    } = useWeather({ icaoCode: LOCATION, windSpeedType: windSpeedType });


    //voi vähä tehä kuvaajista ei niin tarkkoja...
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


    const isNight = (date: Date): boolean => {
        const hours = date.getHours();
        return hours < 6 || hours > 22;
    }

    const isJumpSafe = (): boolean | null => {

      if(current === null){
        return null; //no data
      }

      if(isNight(current!.time!)){
        return false; //night time jumping not allowed for students
      }

        if (current?.wind_gusts_10m !== undefined && current?.cloud_cover !== undefined) {
            const windGusts = current.wind_gusts_10m!;
            const cloudCover = current.cloud_cover!;

            if(windSpeedType === 'KT'){
              //convert to m/s for checking
              const windGustsMs = windGusts * 0.514444;
              if (windGustsMs <= maxWindGustLimitSTUDENT && cloudCover <= maxCloudCoverLimitSTUDENT) {
                  return true; //safe
              } else {
                  return false; //dangerous
              }
            }else{
              if (windGusts <= maxWindGustLimitSTUDENT && cloudCover <= maxCloudCoverLimitSTUDENT) {
                  return true; //safe
              } else {
                  return false; //dangerous
              }
            }
        }
        return null; //unsure
    }

    //convert from knots to m/s and vice versa
    const knotsToMs = (knots: number): number => {
      return knots * 0.514444;
    }

    const msToKnots = (ms: number): number => {
      return ms / 0.514444;
    }


    //also take isNight into account for how safe it is and other stuff....

    return (
        <ScrollView>
            <View style={styles.rootContainer}>

                <StyledButton title={windSpeedType === 'KT' ? 'Change to m/s' : 'Change to KT'} onPress={() => {
                    if (windSpeedType === 'KT') {
                        //convert to m/s
                        setWindSpeedType('MS');
                    } else {
                        //convert to KT
                        setWindSpeedType('KT');
                    }
                }} />

                <Text style={styles.title}>Dropzone: {metarObject?.name ?? LOCATION}</Text>
                <Text>Wind and weather data for {getLatitude}, {getLongitude}</Text>

                <Text style={styles.lowerTitle}>Jumping is probably {isJumpSafe() ? "safe" : !isJumpSafe() ? "dangerous" : "unsure"}</Text>

                {current && (
                    <View style={styles.container}>
                        <Text>Time: {current.time?.toLocaleString()}</Text>
                        <Text>Wind Gusts 10m: {current.wind_gusts_10m?.toFixed(2)} {windSpeedType === 'KT' ? 'KT' : 'm/s'}</Text>
                        <Text>Cloud Cover: {current.cloud_cover}%</Text>
                        <Text>Wind direction 10m: {current.wind_direction_10m} °</Text>
                        <Text style={styles.lowerTitle}>METAR:</Text>
                        <Text>{metarData}</Text>
                        <Text>Temperature: {metarObject?.temp} °C</Text>
                        <Text>Wind Speed: {metarObject?.wspd} KT</Text>
                        <Text>Wind Direction: {metarObject?.wdir} °</Text>
                        <Text>Visibility: {metarObject?.visib ? metarObject?.visib : "unknown"} miles</Text>

                    </View>
                )}


                {minutely15 && (

                    <View style={styles.container}>

                        <Text style={styles.lowerTitle}>Wind gust forecast:</Text>
                        <Text style={styles.explanationText}>Wind Gusts (next 8 hours):</Text>

                        <LineChart
                            data={minutely15.wind_gusts_10m ? filterCloseValuesWithIndex(Array.from(minutely15.wind_gusts_10m).slice(0, 31), 0.1)
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

                {hourly && (
                    <View style={styles.container}>
                        <Text style={styles.lowerTitle}>Hourly Weather:</Text>
                        <Text style={styles.explanationText}>Wind gusts 10m (previus 24 hours):</Text>
                        <LineChart
                            data={hourly.wind_gusts_10m ? filterCloseValuesWithIndex(Array.from(hourly.wind_gusts_10m).slice(0, 24), 0.5)
                                .map((item, newIndex) => ({ value: item.value, label: (newIndex % 2 === 0) ? getTimeLabels(hourly.time)[item.index] : '' })) : []}
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
        marginTop: 40,
    },
    container: {
        flex: 1,
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
