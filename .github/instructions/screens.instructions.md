---
applyTo: "src/features/**/screens/**/*.tsx"
---

# Screen Conventions

## File Structure
Each screen lives in a PascalCase folder with an `index.tsx` entry:
```
src/features/{feature}/screens/{ScreenName}/index.tsx
```

## Screen Template

```tsx
import { Box, Text } from "@/shared/utils/theme";
import FormInput from "@/shared/components/FormInput";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { useTasks } from "@/features/tasks/hooks/useTasks";

export default function CreateTask() {
  const navigation = useNavigation();
  const { addTask, isCreatingTask } = useTasks();

  // Local form state — commit to store only on submit
  const [name, setName] = useState("");

  const handleSubmit = () => {
    if (!name.trim()) return;
    addTask({ id: `task_${nanoid()}`, name });
    navigation.goBack();
  };

  return (
    <Box flex={1} bg="dark900" p="4">
      <FormInput
        label="Task Name"
        value={name}
        onChangeText={setName}
        placeholder="Enter task name"
      />
      {/* submit button */}
    </Box>
  );
}
```

## Rules

1. **Rehydration guard** — On the Home screen (and any screen that reads store data directly), always check `useHydration()` before rendering:
   ```tsx
   const hasHydrated = useHydration();
   if (!hasHydrated) return <HomeScreenSkeleton />;
   ```

2. **Local state for forms** — Keep form values in `useState()`; write to the store only on successful submission.

3. **Feature hooks, not direct store** — Use `useTasks()`, `useCategories()`, etc. instead of calling `useGlobalStore()` directly.

4. **Navigation type-safe params** — Import `NativeStackScreenProps` and `RootStackParamList` from `@/navigation/types`:
   ```tsx
   import type { NativeStackScreenProps } from "@react-navigation/native-stack";
   import type { RootStackParamList } from "@/navigation/types";
   type Props = NativeStackScreenProps<RootStackParamList, "EditTask">;
   ```

5. **No inline styles** — Use Restyle `Box`/`Text` props only.
