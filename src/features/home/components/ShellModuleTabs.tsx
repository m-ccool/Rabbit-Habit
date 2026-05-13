import { Box, Text } from "@/shared/utils/theme"
import { ShellModule } from "@/store"
import React from "react"
import { Pressable } from "react-native"

type TabItem = {
  key: ShellModule
  label: string
  icon: string
}

type ShellModuleTabsProps = {
  activeModule: ShellModule
  onChange: (module: ShellModule) => void
}

const tabs: TabItem[] = [
  { key: "tasks", label: "Tasks", icon: "✅" },
  { key: "categories", label: "Categories", icon: "🎨" },
  { key: "rewards", label: "Rewards", icon: "🏆" },
  { key: "profile", label: "Profile", icon: "👤" },
]

export default function ShellModuleTabs({ activeModule, onChange }: ShellModuleTabsProps) {
  return (
    <Box flexDirection="row" bg="dark800" borderRadius="roundedFull" p="1" mb="3">
      {tabs.map((tab) => {
        const selected = tab.key === activeModule
        return (
          <Pressable
            key={tab.key}
            onPress={() => onChange(tab.key)}
            accessibilityRole="button"
            accessibilityLabel={`Show ${tab.label}`}
            style={({ pressed }) => [
              {
                flex: 1,
                borderRadius: 9999,
                opacity: pressed ? 0.84 : 1,
                transform: [{ scale: pressed ? 0.98 : 1 }],
              },
            ]}
          >
            <Box
              py="3"
              alignItems="center"
              borderRadius="roundedFull"
              bg={selected ? "dark700" : "dark800"}
              borderWidth={selected ? 1 : 0}
              borderColor={selected ? "separator" : "dark800"}
            >
              <Text variant="textBase">{tab.icon}</Text>
              <Text variant="textBase" mt="1" color={selected ? "foreground" : "gray200"}>
                {tab.label}
              </Text>
            </Box>
          </Pressable>
        )
      })}
    </Box>
  )
}
