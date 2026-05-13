---
applyTo: "src/store/**/*.ts"
---

# Zustand Store Conventions

## Store Interface
Always define the full store shape in the `IGlobalStore` interface before the `create()` call. Add new fields/actions to the interface first.

```typescript
interface IGlobalStore {
  // Data fields
  myData: IMyType[];

  // Loading flags — prefix with `is` for ongoing operations
  isCreatingMyThing: boolean;

  // Private internal flags — prefix with `_`
  _hasHydrated: boolean;

  // Actions — camelCase semantic verbs
  addMyThing: (thing: IMyType) => void;
  deleteMyThing: (id: string) => void;
}
```

## Persistence Pattern
```typescript
const useGlobalStore = create(
  persist(
    (set, get) => ({
      // ...state and actions
    }),
    {
      name: "rabbit-habit-store",
      storage: createJSONStorage(() => AsyncStorage),
      version: 1, // Bump when schema changes
      migrate: (persistedState: any, version: number) => {
        // Add migration logic here when version bumps
        return persistedState;
      },
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
```

## Adding State to the Store
When adding new fields:
1. Add to `IGlobalStore` interface
2. Initialize in the store factory
3. Add mutation actions (`set*`, `add*`, `delete*`, `update*`)
4. Add loading flag if the action has async semantics
5. **Bump `version`** if the schema change is breaking
6. Add entry in `migrate()` for the version transition if needed

## Cascading Deletes
When deleting parent entities, always clean up related children:
```typescript
deleteCategory: (id: string) =>
  set((state) => ({
    categories: state.categories.filter((c) => c.id !== id),
    tasks: state.tasks.filter((t) => t.categoryId !== id), // cascade
  })),
```

## ID Generation
Always use `nanoid` with an entity-type prefix:
```typescript
import { nanoid } from "nanoid";
const id = `task_${nanoid()}`;
const id = `category_${nanoid()}`;
```

## Optimistic Updates
Mutations directly update store state — no async loading needed for local data:
```typescript
addTask: (task: ITask) =>
  set((state) => ({ tasks: [...state.tasks, task] })),
```
Use loading flags only for UI feedback (e.g., disabling a button during form submission).
