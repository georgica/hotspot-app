import React, { useEffect, useState, useMemo, useCallback, memo } from 'react'
import { ActivityIndicator, TouchableWithoutFeedback } from 'react-native'
import { round } from 'lodash'
import { useSelector } from 'react-redux'
import ChartContainer from './ChartContainer'
import CarotLeft from '../../assets/images/carot-left.svg'
import CarotRight from '../../assets/images/carot-right.svg'
import Box from '../Box'
import Text from '../Text'
import { ChartData, ChartRange } from './types'
import { triggerImpact } from '../../utils/haptic'
import { useColors } from '../../theme/themeHooks'
import { useAppDispatch } from '../../store/store'
import { RootState } from '../../store/rootReducer'
import { fetchActivityChart } from '../../store/account/accountSlice'

type Props = {
  height: number
}

const WalletChart = ({ height }: Props) => {
  const dispatch = useAppDispatch()
  const {
    account: { activityChart },
    activity: { filter },
  } = useSelector((state: RootState) => state)

  const [focusedData, setFocusedData] = useState<ChartData | null>(null)
  const [timeframe, setTimeframe] = useState<ChartRange>('daily')

  const data = useMemo(() => activityChart[timeframe].data, [
    activityChart,
    timeframe,
  ])

  useEffect(() => {
    dispatch(fetchActivityChart({ range: timeframe, filterType: filter }))
  }, [dispatch, timeframe, filter])

  const headerHeight = 30
  const padding = 20
  const chartHeight = useMemo(() => height - headerHeight - padding, [height])

  const changeTimeframe = useCallback(
    (range: ChartRange) => () => {
      setTimeframe(range)
      triggerImpact()
    },
    [],
  )

  const handleFocusData = useCallback((chartData: ChartData | null): void => {
    setFocusedData(chartData)
  }, [])

  const { greenBright } = useColors()

  const containerStyle = useMemo(() => ({ paddingVertical: padding / 2 }), [])

  return (
    <Box justifyContent="space-around" style={containerStyle}>
      <Box
        flexDirection="row"
        justifyContent="space-between"
        height={headerHeight}
      >
        <Box flexDirection="row" flex={1.5}>
          {focusedData && (
            <>
              <Box flexDirection="row" alignItems="center" marginRight="s">
                <CarotLeft
                  width={12}
                  height={12}
                  stroke={greenBright}
                  strokeWidth={2}
                />
                <Text variant="body2" marginLeft="xs">
                  {round(focusedData?.up, 2).toLocaleString()}
                </Text>
              </Box>

              <Box
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  width: 200,
                }}
              >
                <CarotRight width={12} height={12} />
                <Text variant="body2" marginLeft="s">
                  {round(focusedData?.down, 2).toLocaleString()}
                </Text>
              </Box>
            </>
          )}
        </Box>
        <Box flex={1} flexDirection="row" justifyContent="space-between">
          <TouchableWithoutFeedback onPress={changeTimeframe('daily')}>
            <Text variant="body1" opacity={timeframe === 'daily' ? 1 : 0.3}>
              14D
            </Text>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={changeTimeframe('weekly')}>
            <Text variant="body1" opacity={timeframe === 'weekly' ? 1 : 0.3}>
              12W
            </Text>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={changeTimeframe('monthly')}>
            <Text variant="body1" opacity={timeframe === 'monthly' ? 1 : 0.3}>
              12M
            </Text>
          </TouchableWithoutFeedback>
        </Box>
      </Box>
      {data.length === 0 && (
        <Box
          height={chartHeight}
          width="100%"
          justifyContent="center"
          position="absolute"
        >
          <ActivityIndicator color="gray" />
        </Box>
      )}
      <ChartContainer
        height={chartHeight}
        data={data}
        onFocus={handleFocusData}
      />
    </Box>
  )
}

export default memo(WalletChart)
