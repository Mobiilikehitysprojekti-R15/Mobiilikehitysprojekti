import { View, Text } from 'react-native'
import React from 'react'
import { PieChart } from 'react-native-gifted-charts'
import { useTheme } from '../context/ThemeContext'

export default function StatisticsTest() {
  const { theme } = useTheme();

  return (
    <View style={{ backgroundColor: theme.colors.surface }}>
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