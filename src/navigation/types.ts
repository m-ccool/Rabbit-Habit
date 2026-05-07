import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { DrawerScreenProps } from "@react-navigation/drawer"

export type RootStackParamList = {
  Home: undefined
  CreateTask: undefined
  EditTask: {
    task: ITask
  }
  CreateCategory: undefined
  EditCategory: {
    category: undefined
  }
  CarrotCollection: undefined
}

export type DrawerParamList = {
  MainStack: undefined
}

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>

export type DrawerScreenPropsType<T extends keyof DrawerParamList> =
  DrawerScreenProps<DrawerParamList, T>

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
