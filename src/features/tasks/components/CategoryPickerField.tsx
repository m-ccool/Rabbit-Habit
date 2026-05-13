import React from "react"
import { View } from "react-native"
import { Picker } from "@react-native-picker/picker"
import { COLORS } from "@/shared/utils/theme"

type CategoryPickerFieldProps = {
  categories: ICategory[]
  selectedCategoryId: string
  onValueChange: (categoryId: string) => void
}

const CategoryPickerField = ({
  categories,
  selectedCategoryId,
  onValueChange,
}: CategoryPickerFieldProps) => {
  return (
    <View style={{ width: "100%" }}>
      <Picker
        style={{ backgroundColor: COLORS.muted, borderRadius: 8 }}
        selectedValue={selectedCategoryId}
        onValueChange={(itemValue) => {
          const found = categories.find((c) => c.id === itemValue)
          if (found) {
            onValueChange(found.id)
          }
        }}
      >
        {categories.map((category) => (
          <Picker.Item
            key={category.id}
            label={category.name}
            value={category.id}
            style={{ backgroundColor: COLORS.card }}
          />
        ))}
      </Picker>
    </View>
  )
}

export default CategoryPickerField
