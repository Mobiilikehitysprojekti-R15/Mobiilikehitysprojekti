import { View, Text } from 'react-native'
import React, { useState } from 'react'
import { PieChart } from 'react-native-gifted-charts'

type Props = {
    value: number;
    text: string;
}

export default function StatisticsTest() {

    const [selectedSlice, setSelectedSlice] = useState<Props | null>(null);

  return (
    <View>
        <PieChart
            data={[
                { value: 10, color: 'lightblue', text: 'PL' },
                { value: 30, color: 'yellow', text: 'IA' },
                { value: 30, color: 'pink', text: 'IA > 2km' },
            ]}
            showText={true}
            radius={100}
            innerRadius={50}
            textSize={14}
            textColor={'black'}
            fontStyle={'oblique'}
            onPress={(item: Props, index:Number) => setSelectedSlice(item)}
        />

        <Text>Statistics Test Screen</Text>
        <Text>{selectedSlice ? `Selected: ${selectedSlice.text}` : 'No selection'}</Text>
        <Text>{selectedSlice ? `Jumps: ${selectedSlice.value}` : ''}</Text>
    </View>
  )
}