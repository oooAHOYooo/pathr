import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '@pathr/ui';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pathr</Text>
      <Text style={styles.subtitle}>Like Strava for driving</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.base,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing[4],
  },
  title: {
    fontSize: typography['3xl'].fontSize,
    fontWeight: 'bold',
    color: colors.light.text,
    marginBottom: spacing[2],
  },
  subtitle: {
    fontSize: typography.base.fontSize,
    color: colors.light.textSecondary,
  },
});

