import CreateCategory from "@/features/categories/screens/CreateCategory"
import CreateTask from "@/features/tasks/screens/CreateTask"
import EditTask from "@/features/tasks/screens/EditTask"
import Home from "@/features/home/screens/Home"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { RootStackParamList } from "./types"

const Stack = createNativeStackNavigator<RootStackParamList>()

const Navigation = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#1e1e21" },
        headerTintColor: "#ffffff",
        headerTitleStyle: { color: "#ffffff" },
        contentStyle: { backgroundColor: "#111113" },
      }}
    >
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="CreateTask" component={CreateTask} />
      <Stack.Screen name="EditTask" component={EditTask} />
      <Stack.Screen name="CreateCategory" component={CreateCategory} />
    </Stack.Navigator>
  )
}

export default Navigation
