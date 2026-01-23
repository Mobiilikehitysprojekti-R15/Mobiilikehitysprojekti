import { View, Text } from 'react-native'
import React from 'react'
import { PieChart } from 'react-native-gifted-charts'

export default function StatisticsTest() {
  return (
    <View>
        <PieChart
            data={[
                { value: 40, color: 'red'},
                { value: 30, color: 'blue' },
                { value: 20, color: 'green' },
                { value: 10, color: 'yellow' },
            ]}
        />
    </View>
  )
}