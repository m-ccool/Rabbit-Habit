---
applyTo: "src/**/{components,shared/components}/**/*.tsx"
---

# Component Conventions

## Restyle Styling
All layout and styling uses `Box` and `Text` from the Restyle theme. Never use `StyleSheet.create()` or inline `style={{}}` for standard layout.

```tsx
import { Box, Text } from "@/shared/utils/theme";

export default function MyComponent() {
  return (
    <Box
      flexDirection="row"
      alignItems="center"
      bg="dark800"
      p="3"
      borderRadius="rounded2Xl"
    >
      <Text variant="textBase" color="white">
        Hello
      </Text>
    </Box>
  );
}
```

## Theme Values (quick reference)
- **Colors**: `dark900`, `dark800`, `dark700`, `white`, `gray200`, `purple`, `green300` — see `src/shared/utils/theme/colors.ts` for full list
- **Spacing**: `1`=4px, `2`=8px, `3`=12px, `4`=16px, `5`=20px, `6`=24px
- **borderRadius**: `rounded`, `roundedXl`, `rounded2Xl`
- **textVariants**: `textBase`, `textSm`, `textXl`, `text2Xl`, `text3Xl`, `textHeader`

## Naming & Exports
- **File name**: PascalCase `.tsx` (e.g., `TaskListItem.tsx`)
- **Export**: Default export using function declaration
- **Props interface**: Inline or named `type Props = { ... }` above the component

```tsx
type Props = {
  task: ITask;
  onToggle: (id: string) => void;
};

export default function TaskListItem({ task, onToggle }: Props) { ... }
```

## Component Placement
| Scope | Location |
|-------|----------|
| Used only inside one feature | `src/features/{feature}/components/` |
| Used across multiple features | `src/shared/components/` |

## Existing Shared Components
Always use these before creating new ones:
- `FormInput` — Text input with label, themed styling
- `ErrorBoundary` — Wrap root/screens in error recovery
- `HomeScreenSkeleton`, `TaskSkeleton`, `CategorySkeleton`, `ShimmerBox` — Loading states

## Accessibility
Add accessibility props on interactive elements:
```tsx
<TouchableOpacity
  accessibilityRole="button"
  accessibilityLabel="Toggle task"
  onPress={() => onToggle(task.id)}
/>
```
