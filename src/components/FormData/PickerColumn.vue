<!-- PickerColumn.vue -->
<template>
    <div class="picker-column" ref="columnRef">
        <div class="picker-mask" :style="{ height: `${itemHeight}px` }"></div>
        <div class="picker-indicator" :style="{ height: `${itemHeight}px` }"></div>
        <div class="picker-content" ref="contentRef" @touchstart="onTouchStart" @touchmove="onTouchMove"
            @touchend="onTouchEnd">
            <div v-for="(item, idx) in items" :key="idx" class="picker-item" :class="{ active: idx === selectedIndex }"
                :style="{ height: `${itemHeight}px`, lineHeight: `${itemHeight}px` }">
                {{ item }}
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, nextTick, onMounted } from 'vue'

const props = defineProps({
    items: {
        type: Array,
        required: true
    },
    defaultIndex: {
        type: Number,
        default: 0
    },
    itemHeight: {
        // type: Number,
        default: 44
    }
})

const emit = defineEmits(['select'])

const columnRef = ref(null)
const contentRef = ref(null)
const selectedIndex = ref(props.defaultIndex)
const touchStartY = ref(0)
const startTranslateY = ref(0)
const currentTranslateY = ref(0)
const isAnimating = ref(false)
const animationFrame = ref(null)

// 最大最小偏移量（基于内容高度和可视高度）
const getMaxTranslate = () => {
    if (!contentRef.value || !columnRef.value) return 0
    const contentHeight = contentRef.value.scrollHeight
    const containerHeight = columnRef.value.clientHeight
    const maxOffset = contentHeight - containerHeight
    return Math.max(0, maxOffset)
}

// 根据索引计算偏移量
const getTranslateYByIndex = (index) => {
    const itemHeight = props.itemHeight
    const containerHeight = columnRef.value?.clientHeight || 0
    // 让选中项居中：偏移量 = 索引 * 项高 - (容器高度/2 - 项高/2)
    const offset = index * itemHeight - (containerHeight / 2 - itemHeight / 2)
    return Math.min(Math.max(offset, 0), getMaxTranslate())
}

// 应用偏移量（带动画或不带动画）
const setTranslateY = (value, withAnimation = false) => {
    if (!contentRef.value) return
    if (withAnimation) {
        isAnimating.value = true
        contentRef.value.style.transition = 'transform 0.3s cubic-bezier(0.23, 1, 0.32, 1)'
    } else {
        contentRef.value.style.transition = 'none'
    }
    currentTranslateY.value = value
    contentRef.value.style.transform = `translateY(-${value}px)`

    if (withAnimation) {
        setTimeout(() => {
            if (contentRef.value) contentRef.value.style.transition = ''
            isAnimating.value = false
        }, 300)
    }
}

// 根据当前偏移量计算最近的索引
const findNearestIndex = (translateY) => {
    const itemHeight = props.itemHeight
    const containerHeight = columnRef.value?.clientHeight || 0
    const halfItem = itemHeight / 2
    const centerOffset = containerHeight / 2 - halfItem
    // 当前偏移量下，中心点对应的内容位置
    const centerContentY = translateY + centerOffset
    let index = Math.round(centerContentY / itemHeight)
    index = Math.max(0, Math.min(props.items.length - 1, index))
    return index
}

// 滚动到指定索引
const scrollToIndex = (index, animate = true) => {
    if (index < 0 || index >= props.items.length) return
    const targetTranslate = getTranslateYByIndex(index)
    setTranslateY(targetTranslate, animate)
    if (selectedIndex.value !== index) {
        selectedIndex.value = index
        emit('select', index, props.items[index])
    }
}

// 对外暴露方法（供父组件调用）
const setSelectedIndex = (index, animate = true) => {
    if (index >= 0 && index < props.items.length) {
        scrollToIndex(index, animate)
    }
}

defineExpose({ setSelectedIndex })

// 惯性滚动逻辑
let momentumStartTime = 0
let momentumStartY = 0
let momentumStartTranslate = 0
let lastMoveTime = 0
let lastMoveY = 0
let velocity = 0

const onTouchStart = (e) => {
    if (isAnimating.value) return
    e.preventDefault()
    touchStartY.value = e.touches[0].clientY
    startTranslateY.value = currentTranslateY.value
    momentumStartY = touchStartY.value
    momentumStartTranslate = currentTranslateY.value
    lastMoveTime = Date.now()
    lastMoveY = touchStartY.value
    velocity = 0
    // 清除过渡
    if (contentRef.value) contentRef.value.style.transition = 'none'
    cancelAnimationFrame(animationFrame.value)
}

const onTouchMove = (e) => {
    if (isAnimating.value) return
    e.preventDefault()
    const currentY = e.touches[0].clientY
    const deltaY = currentY - touchStartY.value
    let newTranslate = startTranslateY.value - deltaY
    // 边界弹性阻尼
    const maxTranslate = getMaxTranslate()
    if (newTranslate < 0) {
        newTranslate = newTranslate * 0.3
    } else if (newTranslate > maxTranslate) {
        newTranslate = maxTranslate + (newTranslate - maxTranslate) * 0.3
    }
    setTranslateY(newTranslate, false)

    const now = Date.now()
    const timeDelta = Math.max(16, now - lastMoveTime)
    const moveDelta = currentY - lastMoveY
    velocity = moveDelta / timeDelta
    lastMoveTime = now
    lastMoveY = currentY
}

const onTouchEnd = (e) => {
    if (isAnimating.value) return
    e.preventDefault()
    // 惯性滚动
    let targetTranslate = currentTranslateY.value - velocity * 150
    const maxTranslate = getMaxTranslate()
    targetTranslate = Math.min(Math.max(targetTranslate, 0), maxTranslate)
    // 吸附到最近的索引位置
    const nearestIndex = findNearestIndex(targetTranslate)
    scrollToIndex(nearestIndex, true)
}

// 监听 items 变化，确保选中项有效
watch(() => props.items, (newItems) => {
    if (selectedIndex.value >= newItems.length) {
        selectedIndex.value = newItems.length - 1
    }
    if (selectedIndex.value < 0 && newItems.length) {
        selectedIndex.value = 0
    }
    scrollToIndex(selectedIndex.value, false)
}, { immediate: true })

// 监听 defaultIndex 变化（外部可能改变默认选中）
watch(() => props.defaultIndex, (newIdx) => {
    if (newIdx >= 0 && newIdx < props.items.length) {
        scrollToIndex(newIdx, false)
    }
})

// 初始化定位
onMounted(() => {
    nextTick(() => {
        let idx = props.defaultIndex
        if (idx < 0 || idx >= props.items.length) idx = 0
        scrollToIndex(idx, false)
    })
})
</script>

<style scoped lang="less">
.picker-column {
    flex: 1;
    position: relative;
    height: 100%;
    overflow: hidden;
    background: #fff;
    touch-action: pan-y;
}

.picker-mask {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.6) 30%, rgba(255, 255, 255, 0) 50%, rgba(255, 255, 255, 0.6) 70%, rgba(255, 255, 255, 0.95) 100%);
    pointer-events: none;
    z-index: 1;
}

.picker-indicator {
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    transform: translateY(-50%);
    background-color: rgba(0, 0, 0, 0.05);
    border-top: 1px solid #e5e5e5;
    border-bottom: 1px solid #e5e5e5;
    pointer-events: none;
    z-index: 1;
}

.picker-content {
    position: relative;
    width: 100%;
    will-change: transform;
}

.picker-item {
    text-align: center;
    font-size: 18px;
    color: #333;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.picker-item.active {
    color: var(--orange--);
    font-weight: 500;
}
</style>