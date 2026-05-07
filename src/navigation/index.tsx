import CreateCategory from "@/features/categories/screens/CreateCategory"
import CreateTask from "@/features/tasks/screens/CreateTask"
import EditTask from "@/features/tasks/screens/EditTask"
import Home from "@/features/home/screens/Home"
import Login from "@/features/auth/screens/Login"
import ProfileDrawer from "@/features/profile/screens/ProfileDrawer"
import CarrotCollection from "@/features/carrots/screens/CarrotCollection"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { createDrawerNavigator } from "@react-navigation/drawer"
import { RootStackParamList, DrawerParamList } from "./types"
import useGlobalStore from "@/store"
import React from "react"

const Stack = createNativeStackNavigator<RootStackParamList>()
const Drawer = createDrawerNavigator<DrawerParamList>()

const stackScreenOptions = {
  headerStyle: { backgroundColor: "#1e1e21" },
  headerTintColor: "#ffffff",
  headerTitleStyle: { color: "#ffffff" },
  contentStyle: { backgroundColor: "#111113" },
}

const MainStack = () => (
  <Stack.Navigator screenOptions={stackScreenOptions}>
    <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
    <Stack.Screen name="CreateTask" component={CreateTask} options={{ title: "create a task" }} />
    <Stack.Screen name="EditTask" component={EditTask} options={{ title: "edit task" }} />
    <Stack.Screen name="CreateCategory" component={CreateCategory} options={{ title: "create a category" }} />
    <Stack.Screen name="CarrotCollection" component={CarrotCollection} options={{ title: "carrot collection" }} />
  </Stack.Navigator>
)

const DrawerNavigator = () => (
  <Drawer.Navigator
    drawerContent={(props) => <ProfileDrawer {...props} />}
    screenOptions={{ headerShown: false, drawerType: "front" }}
  >
    <Drawer.Screen name="MainStack" component={MainStack} />
  </Drawer.Navigator>
)

const Navigation = () => {
  const { user } = useGlobalStore()

  if (!user?.isLoggedIn) {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={Login} />
      </Stack.Navigator>
    )
  }

  return <DrawerNavigator />
}

export default Navigation
