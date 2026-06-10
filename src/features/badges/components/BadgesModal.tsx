import useGlobalStore from "@/store"
import { Box, Text } from "@/shared/utils/theme"
import React from "react"
import { Modal, Pressable, ScrollView, StyleSheet } from "react-native"

type BadgesModalProps = {
  visible: boolean
  onClose: () => void
}

export default function BadgesModal({ visible, onClose }: BadgesModalProps) {
  const { badges } = useGlobalStore()

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.card} onPress={() => {}}>
          <Text variant="textXl" style={styles.title}>
            earn bunny badges
          </Text>
          <ScrollView>
            {badges.map((badge) => (
              <Box key={badge.id} flexDirection="row" alignItems="center" mb="4">
                <Box
                  width={48}
                  height={48}
                  borderRadius="roundedFull"
                  alignItems="center"
                  justifyContent="center"
                  style={[
                    styles.badgeCircle,
                    badge.unlocked ? styles.badgeUnlocked : styles.badgeLocked,
                  ]}
                >
                  <Text style={styles.badgeIcon}>{badge.icon}</Text>
                </Box>
                <Box ml="3" flex={1}>
                  <Text variant="textBase" style={styles.badgeName}>
                    {badge.name}
                  </Text>
                  <Text variant="textBase" color="gray200" style={styles.badgeDesc}>
                    {badge.description}
                  </Text>
                </Box>
              </Box>
            ))}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  )
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    backgroundColor: "#1e1e21",
    borderRadius: 20,
    padding: 24,
    width: "85%",
    maxHeight: "70%",
  },
  title: {
    color: "#ec4899",
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  badgeCircle: {
    borderWidth: 2,
  },
  badgeLocked: {
    borderColor: "#3a3a46",
    backgroundColor: "transparent",
  },
  badgeUnlocked: {
    borderColor: "#ec4899",
    backgroundColor: "#ec489922",
  },
  badgeIcon: {
    fontSize: 22,
  },
  badgeName: {
    color: "#ffffff",
    fontWeight: "bold",
    marginBottom: 2,
  },
  badgeDesc: {
    fontSize: 13,
  },
})
