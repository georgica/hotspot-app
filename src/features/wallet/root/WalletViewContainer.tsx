import React, { useRef, memo, useCallback, useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigation } from '@react-navigation/native'
import BottomSheet from '@gorhom/bottom-sheet'
import Search from '@assets/images/search.svg'
import Qr from '@assets/images/qr.svg'
import { AnyTransaction, PendingTransaction } from '@helium/http'
import Box from '../../../components/Box'
import Text from '../../../components/Text'
import BalanceCard from './BalanceCard/BalanceCard'
import {
  withWalletLayout,
  WalletAnimationPoints,
  WalletLayout,
} from './walletLayout'
import { triggerNavHaptic } from '../../../utils/haptic'
import TouchableOpacityBox from '../../../components/TouchableOpacityBox'
import { hp } from '../../../utils/layout'
import WalletIntroCarousel from './WalletIntroCarousel'
import {
  ActivityViewState,
  Loading,
} from '../../../store/activity/activitySlice'
import { FilterType } from './walletTypes'
import WalletView from './WalletView'

type Props = {
  layout: WalletLayout
  animationPoints: WalletAnimationPoints
  activityViewState: ActivityViewState
  txns: AnyTransaction[]
  pendingTxns: PendingTransaction[]
  filter: FilterType
  txnTypeStatus: Loading
}

const WalletViewContainer = ({
  layout,
  animationPoints,
  activityViewState,
  txns,
  pendingTxns,
  filter,
  txnTypeStatus,
}: Props) => {
  const { t } = useTranslation()
  const navigation = useNavigation()

  const activityCard = useRef<BottomSheet>(null)
  const balanceSheet = useRef<BottomSheet>(null)

  const [activityCardIndex, setActivityCardIndex] = useState(1)
  const [balanceSheetIndex, setBalanceSheetIndex] = useState(0)

  const handlePress = useCallback(() => {
    triggerNavHaptic()
  }, [])

  const navScan = useCallback(() => {
    triggerNavHaptic()
    navigation.navigate('Scan')
  }, [navigation])

  const handleSendPress = useCallback(() => {
    triggerNavHaptic()
    navigation.navigate('Send')
  }, [navigation])

  const toggleShowReceive = useCallback(() => {
    if (activityViewState) {
      const snapToIndex = activityCardIndex === 1 ? 0 : 1
      activityCard.current?.snapTo(snapToIndex)
    } else {
      const snapToIndex = balanceSheetIndex === 1 ? 0 : 1
      balanceSheet.current?.snapTo(snapToIndex)
    }
    triggerNavHaptic()
  }, [activityCardIndex, activityViewState, balanceSheetIndex])

  const containerStyle = useMemo(() => ({ paddingTop: layout.notchHeight }), [
    layout.notchHeight,
  ])

  return (
    <Box flex={1} style={containerStyle}>
      <Box
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        paddingHorizontal="l"
        backgroundColor="primaryBackground"
        zIndex={1}
        height={layout.headerHeight}
      >
        <Text variant="h1" fontSize={22}>
          {t('wallet.title')}
        </Text>

        <Box flexDirection="row" justifyContent="space-between" width={85}>
          <TouchableOpacityBox onPress={handlePress} padding="s">
            <Search width={22} height={22} />
          </TouchableOpacityBox>
          <TouchableOpacityBox onPress={navScan} padding="s">
            <Qr width={22} height={22} color="white" />
          </TouchableOpacityBox>
        </Box>
      </Box>
      <WalletView
        layout={layout}
        animationPoints={animationPoints}
        activityViewState={activityViewState}
        txns={txns}
        pendingTxns={pendingTxns}
        filter={filter}
        txnTypeStatus={txnTypeStatus}
        balanceSheetIndex={balanceSheetIndex}
        activityCardIndex={activityCardIndex}
        setActivityCardIndex={setActivityCardIndex}
      />
      {activityViewState === 'no_activity' && (
        <>
          <WalletIntroCarousel />
          <BottomSheet
            index={balanceSheetIndex}
            onChange={setBalanceSheetIndex}
            handleComponent={null}
            backgroundComponent={null}
            snapPoints={[hp(20), hp(55)]}
            animateOnMount={false}
            ref={balanceSheet}
          >
            <BalanceCard
              onReceivePress={toggleShowReceive}
              onSendPress={handleSendPress}
            />
          </BottomSheet>
        </>
      )}
    </Box>
  )
}

export default memo(withWalletLayout(WalletViewContainer))
