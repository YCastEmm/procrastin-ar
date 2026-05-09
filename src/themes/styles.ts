import { StyleSheet } from "react-native"
import { colors, spacing, typography, radius } from "./theme"

export const globalStyles = StyleSheet.create({
    primaryButton: {
        backgroundColor: colors.primary,
        paddingVertical: spacing.md,
        borderRadius: radius.md,
        alignItems: 'center',
        marginTop: spacing.sm,
        marginBottom: spacing.md,
    },
    primaryButtonText: {
        fontSize: typography.body,
        fontWeight: '600',
        color: '#fff',
    },
    secondaryButton: {
        paddingVertical: spacing.md,
        borderRadius: radius.md,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.border,
    },
    secondaryButtonText: {
        fontSize: typography.body,
        fontWeight: '500',
        color: colors.primary,
    },
})
