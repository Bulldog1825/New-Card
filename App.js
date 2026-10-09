import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { useFonts } from 'expo-font';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

import GenerateProfileButton, { BUTTON_HEIGHT } from './src/components/GenerateProfileButton';
import ProfileCardList from './src/components/ProfileCardList';
import { COLORS } from './src/constants/colors';
import { FONT_ASSETS } from './src/constants/fonts';
import { useProfileCards } from './src/hooks/useProfileCards';

const BUTTON_BOTTOM_GAP = 20;

function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { cards, addCard, removeCard } = useProfileCards();

  const buttonBottom = insets.bottom + BUTTON_BOTTOM_GAP;

  return (
    <View style={[styles.screen, { paddingLeft: insets.left, paddingRight: insets.right }]}>
      <ProfileCardList
        cards={cards}
        onRemove={removeCard}
        paddingTop={insets.top + 16}
        // Keep the last card clear of the floating button.
        paddingBottom={buttonBottom + BUTTON_HEIGHT + 28}
      />
      <View style={[styles.buttonDock, { bottom: buttonBottom }]} pointerEvents="box-none">
        <GenerateProfileButton onGenerate={addCard} />
      </View>
    </View>
  );
}

export default function App() {
  const [fontsLoaded, fontError] = useFonts(FONT_ASSETS);

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      {fontsLoaded || fontError ? <ProfileScreen /> : <View style={styles.screen} />}
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.burgundy,
  },
  buttonDock: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
});
