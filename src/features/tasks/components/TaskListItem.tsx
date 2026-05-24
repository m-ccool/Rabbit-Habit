import { Box, Text, Theme } from "@/shared/utils/theme"
import { useTheme } from "@shopify/restyle"
import React, { useEffect, useRef } from "react"
import { Animated, PanResponder, Pressable, StyleSheet, View } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import useGlobalStore from "@/store"
import { useNavigation } from "@react-navigation/native"

type TaskListItemProps = {
  task: ITask
  index?: number
  isNew?: boolean
  overrideToggle?: (task: ITask) => void
}

const SWIPE_THRESHOLD = 80

const TaskListItem = ({ task, index = 0, isNew = false, overrideToggle }: TaskListItemProps) => {
  const theme = useTheme<Theme>()
  const navigation = useNavigation()
  const { toggleTaskStatus, toggleSubTaskStatus } = useGlobalStore()
  const accentColor = task.color?.code ?? theme.colors.dark600

  // ── Swipe-to-complete ────────────────────────────────────────────────────
  const swipeX        = useRef(new Animated.Value(0)).current
  const revealOpacity = useRef(new Animated.Value(0)).current
  const revealScale   = useRef(new Animated.Value(0.5)).current

  // ── Mount entry: stagger (existing) or spring-pop (newly added) ──────────
  const mountOpacity   = useRef(new Animated.Value(0)).current
  const mountTranslate = useRef(new Animated.Value(isNew ? 0 : 14)).current
  const mountScale     = useRef(new Animated.Value(isNew ? 0.82 : 1)).current

  useEffect(() => {
    if (isNew) {
      Animated.parallel([
        Animated.timing(mountOpacity, { toValue: 1, duration: 160, useNativeDriver: true }),
        Animated.spring(mountScale,   { toValue: 1, speed: 14, bounciness: 18, useNativeDriver: true }),
      ]).start()
    } else {
      const delay = Math.min(index * 55, 360)
      Animated.parallel([
        Animated.timing(mountOpacity,   { toValue: 1, duration: 260, delay, useNativeDriver: true }),
        Animated.spring(mountTranslate, { toValue: 0, delay, speed: 20, bounciness: 5, useNativeDriver: true }),
      ]).start()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Animated progress bar (useNativeDriver: false — width is a layout prop) ──
  const subTasks      = task.subTasks ?? []
  const completedSubs = subTasks.filter((s) => s.completed).length
  const subProgress   = subTasks.length > 0 ? completedSubs / subTasks.length : 0

  const progressAnim = useRef(new Animated.Value(subProgress)).current

  useEffect(() => {
    Animated.timing(progressAnim, { toValue: subProgress, duration: 480, useNativeDriver: false }).start()
  }, [subProgress, progressAnim])

  const animatedProgressWidth = progressAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] })

  // ── Animated strikethrough (draws left→right on complete, erases on undo) ─
  const strikeAnim       = useRef(new Animated.Value(task.completed ? 1 : 0)).current
  const prevCompletedRef = useRef(task.completed)

  useEffect(() => {
    if (task.completed !== prevCompletedRef.current) {
      prevCompletedRef.current = task.completed
      Animated.timing(strikeAnim, { toValue: task.completed ? 1 : 0, duration: 300, useNativeDriver: false }).start()
    }
  }, [task.completed, strikeAnim])

  const animatedStrikeWidth = strikeAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] })

  const handleToggle = () => {
    if (overrideToggle) overrideToggle(task)
    else toggleTaskStatus(task)
  }

  const resetReveal = (duration = 200) => {
    Animated.parallel([
      Animated.spring(swipeX,        { toValue: 0,   useNativeDriver: true, bounciness: 12 }),
      Animated.timing(revealOpacity, { toValue: 0,   duration, useNativeDriver: true }),
      Animated.timing(revealScale,   { toValue: 0.5, duration, useNativeDriver: true }),
    ]).start()
  }

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, g) =>
        Math.abs(g.dx) > 8 && Math.abs(g.dx) > Math.abs(g.dy) * 1.5,
      onPanResponderMove: (_, g) => {
        const dx = Math.max(0, g.dx)
        swipeX.setValue(dx)
        const p = Math.min(dx / SWIPE_THRESHOLD, 1)
        revealOpacity.setValue(p)
        revealScale.setValue(0.5 + p * 0.5)
      },
      onPanResponderRelease: (_, g) => {
        if (g.dx >= SWIPE_THRESHOLD) {
          Animated.spring(swipeX, { toValue: SWIPE_THRESHOLD + 36, useNativeDriver: true, speed: 50, bounciness: 0 })
            .start(() => { handleToggle(); resetReveal() })
        } else {
          resetReveal()
        }
      },
      onPanResponderTerminate: () => resetReveal(),
    })
  ).current

  const revealColor = task.completed ? theme.colors.dark600 : theme.colors.systemGreen

  return (
    <Animated.View
      style={[
        styles.card,
        { opacity: mountOpacity, transform: [{ translateY: mountTranslate }, { scale: mountScale }] },
      ]}
      {...panResponder.panHandlers}
    >
      {/* Swipe reveal layer */}
      <View style={[styles.revealLayer, { backgroundColor: revealColor }]}>
        <Animated.View style={{ transform: [{ scale: revealScale }], opacity: revealOpacity }}>
          <Ionicons
            name={task.completed ? "remove-circle-outline" : "checkmark-circle"}
            size={30}
            color="#ffffff"
          />
        </Animated.View>
      </View>

      {/* Sliding card */}
      <Animated.View style={{ transform: [{ translateX: swipeX }] }}>
        <Pressable onLongPress={() => navigation.navigate("EditTask", { task })} accessibilityRole="none">
          <View style={[styles.cardInner, { backgroundColor: theme.colors.dark800 }]}>
            <View style={[styles.accentBar, { backgroundColor: accentColor }]} />

            <View style={styles.content}>
              {/* Main task row */}
              <Pressable
                onPress={handleToggle}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: task.completed }}
                accessibilityLabel={task.name}
                style={styles.mainRow}
              >
                <Ionicons
                  name={task.completed ? "checkmark-circle" : "ellipse-outline"}
                  size={26}
                  color={task.completed ? theme.colors.systemGreen : theme.colors.gray200}
                />
                {/* Name + animated strikethrough */}
                <View style={styles.taskNameWrapper}>
                  <Text
                    variant="textLg"
                    style={[styles.taskName, task.completed && styles.completedFade]}
                  >
                    {task.name}
                  </Text>
                  <Animated.View style={[styles.strikethrough, { width: animatedStrikeWidth }]} />
                </View>
              </Pressable>

              {/* Sub-task progress bar */}
              {subTasks.length > 0 && (
                <View style={styles.progressSection}>
                  <View style={[styles.progressTrack, { backgroundColor: theme.colors.dark600 }]}>
                    <Animated.View
                      style={[styles.progressFill, { width: animatedProgressWidth, backgroundColor: accentColor }]}
                    />
                  </View>
                </View>
              )}

              {/* Sub-tasks */}
              {subTasks.length > 0 && (
                <View style={styles.subTaskList}>
                  {subTasks.map((sub) => (
                    <Pressable
                      key={sub.id}
                      onPress={() => toggleSubTaskStatus(task.id, sub.id)}
                      accessibilityRole="checkbox"
                      accessibilityState={{ checked: sub.completed }}
                      accessibilityLabel={sub.name}
                      style={styles.subTaskRow}
                    >
                      <Ionicons
                        name={sub.completed ? "checkbox" : "square-outline"}
                        size={18}
                        color={sub.completed ? theme.colors.systemGreen : theme.colors.gray200}
                      />
                      <Text
                        variant="textBase"
                        ml="2"
                        color="gray200"
                        style={sub.completed ? styles.completedText : undefined}
                      >
                        {sub.name}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              )}
            </View>
          </View>
        </Pressable>
      </Animated.View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical:   5,
    overflow:         "hidden",
    borderRadius:     14,
  },
  revealLayer: {
    ...StyleSheet.absoluteFillObject,
    alignItems:    "flex-start",
    justifyContent: "center",
    paddingLeft:   22,
    borderRadius:  14,
  },
  cardInner: {
    flexDirection: "row",
    borderRadius:  14,
    overflow:      "hidden",
  },
  accentBar: {
    width: 4,
  },
  content: {
    flex:             1,
    paddingVertical:  14,
    paddingHorizontal: 14,
  },
  mainRow: {
    flexDirection: "row",
    alignItems:    "center",
  },
  taskNameWrapper: {
    flex:           1,
    marginLeft:     12,
    justifyContent: "center",
  },
  taskName: {
    fontWeight: "500",
  },
  completedFade: {
    opacity: 0.45,
  },
  strikethrough: {
    position:        "absolute",
    height:          1.5,
    top:             "50%" as any,
    left:            0,
    borderRadius:    1,
    backgroundColor: "#8E8E93",
  },
  completedText: {
    textDecorationLine: "line-through",
    opacity:            0.45,
  },
  progressSection: {
    marginTop: 10,
  },
  progressTrack: {
    height:       4,
    borderRadius: 2,
    overflow:     "hidden",
  },
  progressFill: {
    height:       "100%",
    borderRadius: 2,
  },
  subTaskList: {
    marginTop: 10,
  },
  subTaskRow: {
    flexDirection:  "row",
    alignItems:     "center",
    paddingVertical: 4,
  },
})

export default TaskListItem

const SWIPE_THRESHOLD = 80

const TaskListItem = ({ task, index = 0, isNew = false, overrideToggle }: TaskListItemProps) => {
  const theme = useTheme<Theme>()
  const navigation = useNavigation()
  const { toggleTaskStatus, toggleSubTaskStatus } = useGlobalStore()
  const accentColor = task.color?.code ?? theme.colors.dark600

  // ── Swipe-to-complete ────────────────────────────────────────────────────
  const swipeX        = useRef(new Animated.Value(0)).current
  const revealOpacity = useRef(new Animated.Value(0)).current
  const revealScale   = useRef(new Animated.Value(0.5)).current

  // ── Mount entry: stagger (existing) or spring-pop (newly added) ──────────
  const mountOpacity   = useRef(new Animated.Value(0)).current
  const mountTranslate = useRef(new Animated.Value(isNew ? 0 : 14)).current
  const mountScale     = useRef(new Animated.Value(isNew ? 0.82 : 1)).current

  useEffect(() => {
    if (isNew) {
      // Spring-pop for freshly created tasks
      Animated.parallel([
        Animated.timing(mountOpacity, { toValue: 1, duration: 160, useNativeDriver: true }),
        Animated.spring(mountScale,   { toValue: 1, speed: 14, bounciness: 18, useNativeDriver: true }),
      ]).start()
    } else {
      // Stagger cascade for initial list load
      const delay = Math.min(index * 55, 360)
      Animated.parallel([
        Animated.timing(mountOpacity, { toValue: 1, duration: 260, delay, useNativeDriver: true }),
        Animated.spring(mountTranslate, { toValue: 0, delay, speed: 20, bounciness: 5, useNativeDriver: true }),
      ]).start()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Animated progress bar (width % — requires useNativeDriver: false) ───
  const subTasks      = task.subTasks ?? []
  const completedSubs = subTasks.filter((s) => s.completed).length
  const subProgress   = subTasks.length > 0 ? completedSubs / subTasks.length : 0

  const progressAnim = useRef(new Animated.Value(subProgress)).current

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue:         subProgress,
      duration:        480,
      useNativeDriver: false,
    }).start()
  }, [subProgress, progressAnim])

  const animatedProgressWidth = progressAnim.interpolate({
    inputRange:  [0, 1],
    outputRange: ['0%', '100%'],
  })

  // ── Animated strikethrough overlay ───────────────────────────────────────
  const strikeAnim       = useRef(new Animated.Value(task.completed ? 1 : 0)).current
  const prevCompletedRef = useRef(task.completed)

  useEffect(() => {
    if (task.completed !== prevCompletedRef.current) {
      prevCompletedRef.current = task.completed
      Animated.timing(strikeAnim, {
        toValue:         task.completed ? 1 : 0,
        duration:        300,
        useNativeDriver: false,
      }).start()
    }
  }, [task.completed, strikeAnim])

  const animatedStrikeWidth = strikeAnim.interpolate({
    inputRange:  [0, 1],
    outputRange: ['0%', '100%'],
  })

  const handleToggle = () => {
    if (overrideToggle) {
      overrideToggle(task)
    } else {
      toggleTaskStatus(task)
    }
  }

  const resetReveal = (duration = 200) => {
    Animated.parallel([
      Animated.spring(swipeX,        { toValue: 0,   useNativeDriver: true, bounciness: 12 }),
      Animated.timing(revealOpacity, { toValue: 0,   duration, useNativeDriver: true }),
      Animated.timing(revealScale,   { toValue: 0.5, duration, useNativeDriver: true }),
    ]).start()
  }

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, g) =>
        Math.abs(g.dx) > 8 && Math.abs(g.dx) > Math.abs(g.dy) * 1.5,
      onPanResponderMove: (_, g) => {
        const dx = Math.max(0, g.dx)
        swipeX.setValue(dx)
        const progress = Math.min(dx / SWIPE_THRESHOLD, 1)
        revealOpacity.setValue(progress)
        revealScale.setValue(0.5 + progress * 0.5)
      },
      onPanResponderRelease: (_, g) => {
        if (g.dx >= SWIPE_THRESHOLD) {
          Animated.spring(swipeX, {
            toValue:         SWIPE_THRESHOLD + 36,
            useNativeDriver: true,
            speed:           50,
            bounciness:      0,
          }).start(() => {
            handleToggle()
            resetReveal()
          })
        } else {
          resetReveal()
        }
      },
      onPanResponderTerminate: () => resetReveal(),
    })
  ).current

  const revealColor = task.completed ? theme.colors.dark600 : theme.colors.systemGreen

  return (
    <Animated.View
      style={[
        styles.card,
        { opacity: mountOpacity, transform: [{ translateY: mountTranslate }, { scale: mountScale }] },
      ]}
      {...panResponder.panHandlers}
    >
      {/* Swipe reveal layer */}
      <View style={[styles.revealLayer, { backgroundColor: revealColor }]}>
        <Animated.View style={{ transform: [{ scale: revealScale }], opacity: revealOpacity }}>
          <Ionicons
            name={task.completed ? "remove-circle-outline" : "checkmark-circle"}
            size={30}
            color="#ffffff"
          />
        </Animated.View>
      </View>

      {/* Sliding card */}
      <Animated.View style={{ transform: [{ translateX: swipeX }] }}>
        <Pressable
          onLongPress={() => navigation.navigate("EditTask", { task })}
          accessibilityRole="none"
        >
          <View style={[styles.cardInner, { backgroundColor: theme.colors.dark800 }]}>
            {/* Colored left accent bar */}
            <View style={[styles.accentBar, { backgroundColor: accentColor }]} />

            <View style={styles.content}>
              {/* Main task row */}
              <Pressable
                onPress={handleToggle}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: task.completed }}
                accessibilityLabel={task.name}
                style={styles.mainRow}
              >
                <Ionicons
                  name={task.completed ? "checkmark-circle" : "ellipse-outline"}
                  size={26}
                  color={task.completed ? theme.colors.systemGreen : theme.colors.gray200}
                />
                {/* Task name with animated strikethrough overlay */}
                <View style={styles.taskNameWrapper}>
                  <Text
                    variant="textLg"
                    style={[styles.taskName, task.completed && styles.completedFade]}
                  >
                    {task.name}
                  </Text>
                  <Animated.View
                    style={[
                      styles.strikethrough,
                      { width: animatedStrikeWidth },
                    ]}
                  />
                </View>
              </Pressable>

              {/* Sub-task progress bar */}
              {subTasks.length > 0 && (
                <View style={styles.progressSection}>
                  <View style={[styles.progressTrack, { backgroundColor: theme.colors.dark600 }]}>
                    <Animated.View
                      style={[
                        styles.progressFill,
                        { width: animatedProgressWidth, backgroundColor: accentColor },
                      ]}
                    />
                  </View>
                </View>
              )}

              {/* Sub-tasks */}
              {subTasks.length > 0 && (
                <View style={styles.subTaskList}>
                  {subTasks.map((sub) => (
                    <Pressable
                      key={sub.id}
                      onPress={() => toggleSubTaskStatus(task.id, sub.id)}
                      accessibilityRole="checkbox"
                      accessibilityState={{ checked: sub.completed }}
                      accessibilityLabel={sub.name}
                      style={styles.subTaskRow}
                    >
                      <Ionicons
                        name={sub.completed ? "checkbox" : "square-outline"}
                        size={18}
                        color={sub.completed ? theme.colors.systemGreen : theme.colors.gray200}
                      />
                      <Text
                        variant="textBase"
                        ml="2"
                        color="gray200"
                        style={sub.completed ? styles.completedText : undefined}
                      >
                        {sub.name}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              )}
            </View>
          </View>
        </Pressable>
      </Animated.View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 5,
    overflow: "hidden",
    borderRadius: 14,
  },
  revealLayer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "flex-start",
    justifyContent: "center",
    paddingLeft: 22,
    borderRadius: 14,
  },
  cardInner: {
    flexDirection: "row",
    borderRadius: 14,
    overflow: "hidden",
  },
  accentBar: {
    width: 4,
  },
  content: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  mainRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  taskName: {
    flex: 1,
    fontWeight: "500",
  },
  completedText: {
    textDecorationLine: "line-through",
    opacity: 0.45,
  },
  progressSection: {
    marginTop: 10,
  },
  progressTrack: {
    height: 4,
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
  },
  subTaskList: {
    marginTop: 10,
  },
  subTaskRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
  },
})

export default TaskListItem

const TaskListItem = ({ task, overrideToggle }: TaskListItemProps) => {
  const theme = useTheme<Theme>()
  const navigation = useNavigation()
  const { toggleTaskStatus, toggleSubTaskStatus } = useGlobalStore()
  const accentColor = task.color?.code ?? theme.colors.dark600

  const handleToggle = () => {
    if (overrideToggle) {
      overrideToggle(task)
    } else {
      toggleTaskStatus(task)
    }
  }

  const subTasks = task.subTasks ?? []
  const completedSubs = subTasks.filter((s) => s.completed).length
  const subProgress = subTasks.length > 0 ? completedSubs / subTasks.length : 0

  return (
    <Pressable
      onLongPress={() => navigation.navigate("EditTask", { task })}
      accessibilityRole="none"
      style={styles.card}
    >
      <View style={[styles.cardInner, { backgroundColor: theme.colors.dark800 }]}>
        {/* Colored left accent bar */}
        <View style={[styles.accentBar, { backgroundColor: accentColor }]} />

        <View style={styles.content}>
          {/* Main task row */}
          <Pressable
            onPress={handleToggle}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: task.completed }}
            accessibilityLabel={task.name}
            style={styles.mainRow}
          >
            <Ionicons
              name={task.completed ? "checkmark-circle" : "ellipse-outline"}
              size={26}
              color={task.completed ? theme.colors.systemGreen : theme.colors.gray200}
            />
            <Text
              variant="textLg"
              ml="3"
              style={[
                styles.taskName,
                task.completed && styles.completedText,
              ]}
            >
              {task.name}
            </Text>
          </Pressable>

          {/* Sub-task progress bar */}
          {subTasks.length > 0 && (
            <View style={styles.progressSection}>
              <View style={[styles.progressTrack, { backgroundColor: theme.colors.dark600 }]}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${subProgress * 100}%` as any, backgroundColor: accentColor },
                  ]}
                />
              </View>
            </View>
          )}

          {/* Sub-tasks */}
          {subTasks.length > 0 && (
            <View style={styles.subTaskList}>
              {subTasks.map((sub) => (
                <Pressable
                  key={sub.id}
                  onPress={() => toggleSubTaskStatus(task.id, sub.id)}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: sub.completed }}
                  accessibilityLabel={sub.name}
                  style={styles.subTaskRow}
                >
                  <Ionicons
                    name={sub.completed ? "checkbox" : "square-outline"}
                    size={18}
                    color={sub.completed ? theme.colors.systemGreen : theme.colors.gray200}
                  />
                  <Text
                    variant="textBase"
                    ml="2"
                    color="gray200"
                    style={sub.completed ? styles.completedText : undefined}
                  >
                    {sub.name}
                  </Text>
                </Pressable>
              ))}
            </View>
          )}
        </View>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 5,
  },
  cardInner: {
    flexDirection: "row",
    borderRadius: 14,
    overflow: "hidden",
  },
  accentBar: {
    width: 4,
  },
  content: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  mainRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  taskName: {
    flex: 1,
    fontWeight: "500",
  },
  completedText: {
    textDecorationLine: "line-through",
    opacity: 0.45,
  },
  progressSection: {
    marginTop: 10,
  },
  progressTrack: {
    height: 4,
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
  },
  subTaskList: {
    marginTop: 10,
  },
  subTaskRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
  },
})

export default TaskListItem
