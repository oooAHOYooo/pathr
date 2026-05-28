import { View, Text, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import { colors, spacing, typography, radius } from '@pathr/ui';

const setupSteps = [
  'Allow location access so Pathr can record your route.',
  'Keep the app open while driving for the most reliable tracking.',
  'Start a trip from the recording screen when you are ready.',
];

export default function StartScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['rgba(102, 126, 234, 0.18)', 'rgba(0, 122, 255, 0.08)', 'rgba(118, 75, 162, 0.18)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <View style={[styles.orb, styles.orb1]} />
      <View style={[styles.orb, styles.orb2]} />

      <BlurView intensity={40} tint="light" style={styles.card}>
        <Text style={styles.kicker}>Setup</Text>
        <Text style={styles.title}>Get ready to record your first drive</Text>
        <Text style={styles.description}>
          A quick setup helps Pathr capture a clean route and keep tracking steady while you are on the move.
        </Text>

        <View style={styles.stepList}>
          {setupSteps.map((step) => (
            <View key={step} style={styles.stepRow}>
              <View style={styles.stepDot} />
              <Text style={styles.stepText}>{step}</Text>
            </View>
          ))}
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Return to the home screen"
          onPress={() => router.back()}
          style={({ pressed }) => [styles.primaryButtonWrap, pressed && styles.buttonPressed]}
        >
          <LinearGradient
            colors={[colors.light.accent.from, colors.light.accent.to]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.primaryButton}
          >
            <Text style={styles.primaryButtonText}>Back to Home</Text>
          </LinearGradient>
        </Pressable>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing[4],
    backgroundColor: colors.light.base,
  },
  orb: {
    position: 'absolute',
    borderRadius: 1000,
    opacity: 0.45,
  },
  orb1: {
    width: 260,
    height: 260,
    backgroundColor: colors.light.accent.from,
    top: -40,
    left: -80,
  },
  orb2: {
    width: 320,
    height: 320,
    backgroundColor: colors.light.primary,
    right: -120,
    bottom: -120,
    opacity: 0.18,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    borderRadius: radius.large,
    padding: spacing[8],
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 8,
  },
  kicker: {
    fontSize: typography.sm.fontSize,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: colors.light.textSecondary,
    marginBottom: spacing[2],
  },
  title: {
    fontSize: typography['2xl'].fontSize,
    lineHeight: typography['2xl'].lineHeight * 1.05,
    fontWeight: '700',
    color: colors.light.text,
  },
  description: {
    marginTop: spacing[3],
    fontSize: typography.sm.fontSize,
    lineHeight: typography.sm.lineHeight * 1.5,
    color: colors.light.textSecondary,
  },
  stepList: {
    marginTop: spacing[6],
    gap: spacing[3],
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing[3],
  },
  stepDot: {
    marginTop: 7,
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: colors.light.accent.from,
  },
  stepText: {
    flex: 1,
    fontSize: typography.sm.fontSize,
    lineHeight: typography.sm.lineHeight * 1.4,
    color: colors.light.text,
  },
  primaryButtonWrap: {
    marginTop: spacing[8],
  },
  primaryButton: {
    minHeight: 52,
    borderRadius: radius.medium,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing[6],
  },
  primaryButtonText: {
    color: colors.light.base,
    fontSize: typography.base.fontSize,
    fontWeight: '700',
  },
  buttonPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.985 }],
  },
});
