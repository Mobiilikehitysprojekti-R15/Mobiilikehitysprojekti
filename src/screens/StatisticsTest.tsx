import { View, Text, ScrollView, StyleSheet, Button } from 'react-native'
import React, { useEffect, useState } from 'react'
import { PieChart, BarChart } from 'react-native-gifted-charts'

type JumpType = {
    number: number;
    jumpType: 'PL' | 'IA' | 'IA > 2km';
    approved: boolean;
    altitude: number;
    freefallTime: number;
    place: string;
    canopy: string;
    plane: string;
    date: Date;
}

type Props = {
    value: number;
    text: string;
}

export default function StatisticsTest() {

    const [selectedSlice, setSelectedSlice] = useState<Props | null>(null);

    // Dummy data for testing
    const jumpTypes: JumpType[] = [
        { number: 1, jumpType: 'PL', approved: true, altitude: 1000, freefallTime: 0, place: 'EFOU', canopy: 'Nav220', plane: 'OH-EKO', date: new Date('2025-04-27') },
        { number: 2, jumpType: 'PL', approved: true, altitude: 1000, freefallTime: 0, place: 'EFOU', canopy: 'Nav220', plane: 'OH-EKO', date: new Date('2025-05-10') },
        { number: 3, jumpType: 'PL', approved: true, altitude: 1000, freefallTime: 0, place: 'EFOU', canopy: 'Nav220', plane: 'OH-EKO', date: new Date('2025-05-11') },
        { number: 4, jumpType: 'PL', approved: true, altitude: 1000, freefallTime: 0, place: 'EFOU', canopy: 'Nav220', plane: 'OH-EKO', date: new Date('2025-05-29') },
        { number: 5, jumpType: 'PL', approved: true, altitude: 1000, freefallTime: 0, place: 'EFOU', canopy: 'Nav220', plane: 'OH-CVE', date: new Date('2025-06-19') },
        { number: 6, jumpType: 'PL', approved: true, altitude: 1100, freefallTime: 0, place: 'EFOU', canopy: 'Nav220', plane: 'OH-EKO', date: new Date('2025-06-21') },
        { number: 7, jumpType: 'IA', approved: true, altitude: 1100, freefallTime: 3, place: 'EFOU', canopy: 'Nav220', plane: 'OH-EKO', date: new Date('2025-06-21') },
        { number: 8, jumpType: 'IA', approved: false, altitude: 1250, freefallTime: 5, place: 'EFOU', canopy: 'Nav220', plane: 'OH-EKO', date: new Date('2025-07-09') },
        { number: 9, jumpType: 'IA', approved: false, altitude: 1200, freefallTime: 5, place: 'EFOU', canopy: 'Nav220', plane: 'OH-EKO', date: new Date('2025-07-09') },
        { number: 10, jumpType: 'IA', approved: true, altitude: 1200, freefallTime: 5, place: 'EFOU', canopy: 'Nav220', plane: 'OH-EKO', date: new Date('2025-07-09') },
        { number: 11, jumpType: 'IA', approved: true, altitude: 1600, freefallTime: 10, place: 'EFOU', canopy: 'Nav220', plane: 'OH-EKO', date: new Date('2025-07-17') },
        { number: 12, jumpType: 'IA', approved: false, altitude: 2000, freefallTime: 20, place: 'EFOU', canopy: 'Nav220', plane: 'OH-EKO', date: new Date('2025-08-14') },
        { number: 13, jumpType: 'IA', approved: false, altitude: 1900, freefallTime: 17, place: 'EFOU', canopy: 'Nav220', plane: 'OH-CVE', date: new Date('2025-08-23') },
        { number: 14, jumpType: 'IA', approved: false, altitude: 1800, freefallTime: 22, place: 'EFOU', canopy: 'Nav220', plane: 'OH-EKO', date: new Date('2025-09-06') },
        { number: 15, jumpType: 'IA', approved: true, altitude: 2000, freefallTime: 20, place: 'EFOU', canopy: 'Nav220', plane: 'OH-EKO', date: new Date('2025-09-14') },
        { number: 16, jumpType: 'IA', approved: true, altitude: 1800, freefallTime: 15, place: 'EFOU', canopy: 'Nav220', plane: 'OH-EKO', date: new Date('2025-09-19') },
        { number: 17, jumpType: 'IA > 2km', approved: true, altitude: 3300, freefallTime: 50, place: 'EFOU', canopy: 'Nav220', plane: 'OH-EKO', date: new Date('2025-09-19') },
        { number: 18, jumpType: 'IA > 2km', approved: true, altitude: 3100, freefallTime: 45, place: 'EFOU', canopy: 'Commodore 210', plane: 'OH-EKO', date: new Date('2025-09-27') },
        { number: 19, jumpType: 'IA > 2km', approved: true, altitude: 3500, freefallTime: 45, place: 'EFOU', canopy: 'Commodore 210', plane: 'OH-CVE', date: new Date('2025-09-28') },
    ];

    const [allFreeFall, setAllFreefall] = useState<number>(0)

    useEffect(() => {
        let totalFreefall : number = 0;
        jumpTypes.map((item) => (totalFreefall += item.freefallTime))
        setAllFreefall(totalFreefall);
    },[])

    return (
        <View style={style.cointainer}>

            <ScrollView style={style.scrollContainer}>
                <PieChart
                    data={[
                        { value: jumpTypes.filter(j => j.jumpType === 'PL').length, text: 'PL', color: '#7eccff' },
                        { value: jumpTypes.filter(j => j.jumpType === 'IA').length, text: 'IA', color: '#ffa1ff' },
                        { value: jumpTypes.filter(j => j.jumpType === 'IA > 2km').length, text: 'IA > 2km', color: '#d2ffad' },
                    ]}
                    showText={true}
                    radius={100}
                    innerRadius={50}
                    textSize={14}
                    textColor={'black'}
                    fontStyle={'oblique'}
                    onPress={(item: Props, index: Number) => setSelectedSlice(item)}
                />


                <Text>Jumps during the season 2025</Text>
                <BarChart
                    data={[
                        { value: jumpTypes.filter(j => j.date.getMonth() === 1).length, label: 'Jan' },
                        { value: jumpTypes.filter(j => j.date.getMonth() === 2).length, label: 'Feb' },
                        { value: jumpTypes.filter(j => j.date.getMonth() === 3).length, label: 'Mar' },
                        { value: jumpTypes.filter(j => j.date.getMonth() === 4).length, label: 'Apr' },
                        { value: jumpTypes.filter(j => j.date.getMonth() === 5).length, label: 'May' },
                        { value: jumpTypes.filter(j => j.date.getMonth() === 6).length, label: 'Jun' },
                        { value: jumpTypes.filter(j => j.date.getMonth() === 7).length, label: 'Jul' },
                        { value: jumpTypes.filter(j => j.date.getMonth() === 8).length, label: 'Aug' },
                        { value: jumpTypes.filter(j => j.date.getMonth() === 9).length, label: 'Sep' },
                        { value: jumpTypes.filter(j => j.date.getMonth() === 10).length, label: 'Oct' },
                        { value: jumpTypes.filter(j => j.date.getMonth() === 11).length, label: 'Nov' },
                        { value: jumpTypes.filter(j => j.date.getMonth() === 12).length, label: 'Dec' },

                    ]}
                    width={250}
                    adjustToWidth={true}
                    allowFontScaling={true}
                />

                <Text>Statistics Test Screen</Text>
                <Text>{selectedSlice ? `Selected: ${selectedSlice.text}` : 'No selection'}</Text>
                <Text>{selectedSlice ? `Jumps: ${selectedSlice.value}` : ''}</Text>

                <Text>Total free fall time: {allFreeFall}s</Text>
                {

                    jumpTypes.map((item, index) => (
                        <View style={style.jumpSlot} key={index}>
                            <Text>{item.jumpType}</Text>
                            <Text>{item.date.getDate().toString() + "." + item.date.getMonth().toString() + "." + item.date.getFullYear().toString()}</Text>
                            <Text>Altitude: {item.altitude}m</Text>
                            <Text>Free fall amount: {item.freefallTime}s</Text>
                            <Text>{item.approved ? "Approved" : "Not Approved"}</Text>
                            <Button title={"See more"} />
                        </View>
                    ))
                }

            </ScrollView>

        </View>
    )
}

const style = StyleSheet.create({
    cointainer:{
        marginHorizontal: 20,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
    },
    scrollContainer:{
        width:'100%'
    },
    jumpSlot:{
        margin: 20
    }
})