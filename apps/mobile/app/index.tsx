import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { colors, spacing, typography, radius, shadow } from '@pathr/ui';

const { width, height } = Dimensions.get('window');

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      {/* Animated gradient background */}
      <LinearGradient
        colors={['rgba(102, 126, 234, 0.2)', 'rgba(0, 122, 255, 0.1)', 'rgba(118, 75, 162, 0.2)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      
      {/* Floating glass orbs for depth */}
      <View style={[styles.orb, styles.orb1]} />
      <View style={[styles.orb, styles.orb2]} />
      
      {/* Main content card with liquid glass effect */}
      <BlurView intensity={40} tint="light" style={styles.glassCard}>
        <View style={styles.cardContent}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Pathr</Text>
          </View>
          
          <Text style={styles.subtitle}>Like Strava for driving</Text>
          <Text style={styles.description}>
            Record your trips, discover scenic routes, and build a personal map of everywhere you've been.
          </Text>
          
          {/* Action buttons */}
          <View style={styles.buttonContainer}>
            <BlurView intensity={30} tint="light" style={styles.button}>
              <Text style={styles.buttonText}>Get Started</Text>
            </BlurView>
            <LinearGradient
              colors={[colors.light.accent.from, colors.light.accent.to]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonTextGradient}>Learn More</Text>
            </LinearGradient>
          </View>
        </View>
      </BlurView>
      
      {/* Decorative glass elements */}
      <BlurView intensity={20} tint="light" style={styles.decorative1} />
      <BlurView intensity={20} tint="light" style={styles.decorative2} />
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
  orb: {
    position: 'absolute',
    borderRadius: 1000,
    opacity: 0.5,
  },
  orb1: {
    width: width * 0.6,
    height: width * 0.6,
    backgroundColor: colors.light.accent.from,
    top: height * 0.1,
    left: -width * 0.2,
    opacity: 0.3,
  },
  orb2: {
    width: width * 0.8,
    height: width * 0.8,
    backgroundColor: colors.light.primary,
    bottom: -height * 0.1,
    right: -width * 0.2,
    opacity: 0.2,
  },
  glassCard: {
    borderRadius: radius.large,
    padding: spacing[8],
    width: '90%',
    maxWidth: 400,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
  },
  cardContent: {
    alignItems: 'center',
    gap: spacing[4],
  },
  titleContainer: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
  },
  title: {
    fontSize: typography['3xl'].fontSize,
    fontWeight: 'bold',
    color: colors.light.text,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: typography.xl.fontSize,
    color: colors.light.textSecondary,
    textAlign: 'center',
    marginTop: spacing[2],
  },
  description: {
    fontSize: typography.sm.fontSize,
    color: colors.light.textSecondary,
    textAlign: 'center',
    marginTop: spacing[2],
    lineHeight: typography.sm.lineHeight * 1.5,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: spacing[4],
    marginTop: spacing[6],
    width: '100%',
  },
  button: {
    flex: 1,
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[6],
    borderRadius: radius.medium,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: typography.base.fontSize,
    fontWeight: '600',
    color: colors.light.text,
  },
  buttonGradient: {
    flex: 1,
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[6],
    borderRadius: radius.medium,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.light.accent.from,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonTextGradient: {
    fontSize: typography.base.fontSize,
    fontWeight: '600',
    color: colors.light.base,
  },
  decorative1: {
    position: 'absolute',
    width: 128,
    height: 128,
    borderRadius: radius.medium,
    top: height * 0.1,
    right: spacing[4],
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    opacity: 0.6,
  },
  decorative2: {
    position: 'absolute',
    width: 96,
    height: 96,
    borderRadius: radius.medium,
    bottom: height * 0.1,
    left: spacing[4],
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    opacity: 0.4,
  },
});

