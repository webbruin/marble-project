<template>
    <Teleport to="body">
        <Transition name="fade">
            <div v-if="visible" class="date-picker-mask" @click.self="handleClose">
                <Transition name="slide-up">
                    <div v-if="visible" class="date-picker-container">
                        <div class="date-picker-header">
                            <button class="cancel-btn" @click="handleClose">取消</button>
                            <span class="title">选择日期</span>
                            <button class="confirm-btn" @click="handleConfirm">确定</button>
                        </div>
                        <div class="picker-wrapper">
                            <!-- 年选择器 -->
                            <PickerColumn ref="yearColumnRef" :items="yearList" :default-index="initialYearIndex"
                                item-height="44" @select="onYearSelect" />
                            <!-- 月选择器 -->
                            <PickerColumn ref="monthColumnRef" :items="monthList" :default-index="initialMonthIndex"
                                item-height="44" @select="onMonthSelect" />
                            <!-- 日选择器 -->
                            <PickerColumn ref="dayColumnRef" :items="dayList" :default-index="initialDayIndex"
                                item-height="44" @select="onDaySelect" />
                        </div>
                    </div>
                </Transition>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted } from 'vue'
import PickerColumn from './PickerColumn.vue'

const props = defineProps({
    visible: {
        type: Boolean,
        default: false
    },
    modelValue: {
        type: String,
        default: ''
    },
    // 可选：起始年份，默认当前年份前后50年
    startYear: {
        type: Number,
        default: null
    },
    endYear: {
        type: Number,
        default: null
    }
})

const emit = defineEmits(['update:visible', 'change'])

// 子组件引用
const yearColumnRef = ref(null)
const monthColumnRef = ref(null)
const dayColumnRef = ref(null)

// 内部选中的年月日数值
const selectedYear = ref(2000)
const selectedMonth = ref(1)
const selectedDay = ref(1)

// 生成年份范围（默认当前年份前后50年）
const getYearRange = () => {
    const currentYear = new Date().getFullYear()
    let start = props.startYear !== null ? props.startYear : currentYear - 50
    let end = props.endYear !== null ? props.endYear : currentYear + 20
    if (start > end) [start, end] = [end, start]
    const years = []
    for (let i = start; i <= end; i++) {
        years.push(i)
    }
    return years
}

const yearList = computed(() => getYearRange())

const monthList = computed(() => {
    const months = []
    for (let i = 1; i <= 12; i++) {
        months.push(i)
    }
    return months
})

// 获取指定年月的天数
const getDaysInMonth = (year, month) => {
    return new Date(year, month, 0).getDate()
}

const dayList = computed(() => {
    const maxDay = getDaysInMonth(selectedYear.value, selectedMonth.value)
    const days = []
    for (let i = 1; i <= maxDay; i++) {
        days.push(i)
    }
    return days
})

// 确保日期的日合法（不超过当月最大天数）
const clampDay = (year, month, day) => {
    const maxDay = getDaysInMonth(year, month)
    return Math.min(day, maxDay)
}

// 解析传入的日期字符串，格式 YYYY-MM-DD
const parseDateString = (dateStr) => {
    if (!dateStr) return null
    const parts = dateStr.split('.')
    if (parts.length === 3) {
        const year = parseInt(parts[0], 10)
        const month = parseInt(parts[1], 10)
        const day = parseInt(parts[2], 10)
        if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
            return { year, month, day }
        }
    }
    return null
}

// 获取当前有效日期（优先使用 props.modelValue，否则当前日期）
const getValidDate = () => {
    const parsed = parseDateString(props.modelValue)
    if (parsed) {
        const maxDay = getDaysInMonth(parsed.year, parsed.month)
        const day = Math.min(parsed.day, maxDay)
        return { year: parsed.year, month: parsed.month, day }
    }
    const now = new Date()
    return {
        year: now.getFullYear(),
        month: now.getMonth() + 1,
        day: now.getDate()
    }
}

// 初始化或重置选中值
const initSelectedDate = () => {
    const { year, month, day } = getValidDate()
    selectedYear.value = year
    selectedMonth.value = month
    selectedDay.value = clampDay(year, month, day)
}

// 获取年份在列表中的索引
const getYearIndex = (year) => {
    const idx = yearList.value.findIndex(y => y === year)
    return idx !== -1 ? idx : 0
}

// 获取月份在列表中的索引
const getMonthIndex = (month) => {
    const idx = monthList.value.findIndex(m => m === month)
    return idx !== -1 ? idx : 0
}

// 获取日期在列表中的索引
const getDayIndex = (day) => {
    const idx = dayList.value.findIndex(d => d === day)
    return idx !== -1 ? idx : 0
}

// 同步滚动列位置（根据当前 selectedYear/Month/Day）
const syncColumnsPosition = async () => {
    await nextTick()
    const yearIndex = getYearIndex(selectedYear.value)
    const monthIndex = getMonthIndex(selectedMonth.value)
    const dayIndex = getDayIndex(selectedDay.value)

    if (yearColumnRef.value) {
        yearColumnRef.value.setSelectedIndex(yearIndex, false)
    }
    if (monthColumnRef.value) {
        monthColumnRef.value.setSelectedIndex(monthIndex, false)
    }
    if (dayColumnRef.value) {
        dayColumnRef.value.setSelectedIndex(dayIndex, false)
    }
}

// 联动修正日列（当年月变化时，确保日合法并更新日列滚动）
const adjustDayByMonthYear = async () => {
    const newMaxDay = getDaysInMonth(selectedYear.value, selectedMonth.value)
    let newDay = selectedDay.value
    if (newDay > newMaxDay) {
        newDay = newMaxDay
        selectedDay.value = newDay
    }
    // 更新日列的滚动位置
    await nextTick()
    const newDayIndex = getDayIndex(newDay)
    if (dayColumnRef.value) {
        dayColumnRef.value.setSelectedIndex(newDayIndex, false)
    }
}

// 监听年月变化，联动调整日
watch([selectedYear, selectedMonth], async () => {
    await adjustDayByMonthYear()
})

// 监听日列表变化（由于年月变动导致天数数组变化），确保滚动位置正确
watch(dayList, async () => {
    // 防止重复触发，如果当前选中的日超出范围，已在 adjustDayByMonthYear 处理
    const dayIndex = getDayIndex(selectedDay.value)
    if (dayColumnRef.value && dayIndex !== -1) {
        dayColumnRef.value.setSelectedIndex(dayIndex, false)
    }
})

// 年选择回调
const onYearSelect = (index, value) => {
    selectedYear.value = value
}

// 月选择回调
const onMonthSelect = (index, value) => {
    selectedMonth.value = value
}

// 日选择回调
const onDaySelect = (index, value) => {
    selectedDay.value = value
}

// 关闭弹窗
const handleClose = () => {
    emit('update:visible', false)
}

// 确认选择
const handleConfirm = () => {
    const year = selectedYear.value
    const month = selectedMonth.value
    const day = selectedDay.value
    const dateStr = `${year}.${String(month).padStart(2, '0')}.${String(day).padStart(2, '0')}`
    emit('change', dateStr)
    handleClose()
}

// 当弹窗显示时，重置并同步位置
watch(() => props.visible, async (newVal) => {
    if (newVal) {
        initSelectedDate()
        await syncColumnsPosition()
    }
})

// 监听外部 modelValue 变化，同步内部选中值（用于外部动态修改）
watch(() => props.modelValue, () => {
    if (props.visible) {
        initSelectedDate()
        syncColumnsPosition()
    }
})

// 初始化默认值（组件挂载时设置）
onMounted(() => {
    initSelectedDate()
})

// 初始索引计算（用于子组件初始展示）
const initialYearIndex = computed(() => getYearIndex(getValidDate().year))
const initialMonthIndex = computed(() => getMonthIndex(getValidDate().month))
const initialDayIndex = computed(() => getDayIndex(getValidDate().day))
</script>

<style scoped lang="less">
.date-picker-mask {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1000;
    display: flex;
    align-items: flex-end;
    justify-content: center;
}

.date-picker-container {
    width: 100%;
    background-color: #fff;
    border-radius: 16px 16px 0 0;
    display: flex;
    flex-direction: column;
    max-height: 70vh;
    animation: slideUp 0.3s ease-out;
}

.date-picker-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
    border-bottom: 1px solid #e5e5e5;
    background-color: #fff;
    border-radius: 16px 16px 0 0;
}

.cancel-btn,
.confirm-btn {
    font-size: 16px;
    background: none;
    border: none;
    padding: 8px 0;
    cursor: pointer;
    color: var(--orange--);
    font-weight: 500;
}

.cancel-btn {
    color: #666;
}

.title {
    font-size: 18px;
    font-weight: 500;
    color: #333;
}

.picker-wrapper {
    display: flex;
    justify-content: space-between;
    background: #fff;
    height: 260px;
    overflow: hidden;
}

/* 动画 */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.slide-up-enter-active,
.slide-up-leave-active {
    transition: transform 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
    transform: translateY(100%);
}

/* 移动端适配 */
@media (max-width: 768px) {
    .picker-wrapper {
        height: 240px;
    }
}
</style>