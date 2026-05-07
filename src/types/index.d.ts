interface IColor {
  id: string
  name: string
  code: string
}

interface ICategory {
  id: string
  name: string
  color: IColor
}

interface ISubTask {
  id: string
  name: string
  completed: boolean
}

interface ITask {
  id: string
  category_id: string
  name: string
  completed: boolean
  color?: IColor
  repeatDays?: number[]
  subTasks?: ISubTask[]
  originalId?: string
  generatedDate?: string
}

interface IUser {
  username: string
  isLoggedIn: boolean
}

interface IBadge {
  id: string
  name: string
  description: string
  icon: string
  unlocked: boolean
}
