import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { tokens } from '@sub-keeper/core';

/**
 * Phase 1 placeholder. 실제 화면(하단 탭바·대시보드·CRUD 등)은 다음 단계에서 구현.
 * 여기서는 모노레포 배선(core import) 동작 확인용 최소 화면만 렌더링한다.
 */
export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>sub-keeper · mobile</Text>
      <Text style={styles.subtitle}>
        Phase 1 scaffold. 화면은 다음 단계에서 구현됩니다.
      </Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: tokens.colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    padding: tokens.spacing.xl,
  },
  title: {
    fontSize: tokens.typography.size.xl,
    color: tokens.colors.gray[900],
  },
  subtitle: {
    marginTop: tokens.spacing.sm,
    fontSize: tokens.typography.size.sm,
    color: tokens.colors.gray[500],
  },
});
