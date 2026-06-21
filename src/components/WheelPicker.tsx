import { useEffect, useRef, useState } from "react"
import { NativeScrollEvent, NativeSyntheticEvent, ScrollView, StyleSheet, Text, View } from "react-native"

export type WheelItem = { label: string; value: number }

type WheelPickerProps = {
    data: WheelItem[]
    selectedValue: number
    onChange: (value: number) => void
    itemHeight?: number
    visibleCount?: number
    width?: number
}

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n))

const WheelPicker = ({
    data,
    selectedValue,
    onChange,
    itemHeight = 44,
    visibleCount = 5,
    width,
}: WheelPickerProps) => {
    const scrollRef = useRef<ScrollView>(null)
    const selectedIndex = Math.max(0, data.findIndex(d => d.value === selectedValue))
    const [activeIndex, setActiveIndex] = useState(selectedIndex)

    const containerHeight = itemHeight * visibleCount
    const padding = (containerHeight - itemHeight) / 2

    // Reposiciona la rueda cuando cambia el valor desde afuera (ej. el día al cambiar de mes).
    useEffect(() => {
        scrollRef.current?.scrollTo({ y: selectedIndex * itemHeight, animated: false })
        setActiveIndex(selectedIndex)
    }, [selectedValue, data.length])

    const indexFromEvent = (e: NativeSyntheticEvent<NativeScrollEvent>) =>
        clamp(Math.round(e.nativeEvent.contentOffset.y / itemHeight), 0, data.length - 1)

    const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
        const idx = indexFromEvent(e)
        if (idx !== activeIndex) setActiveIndex(idx)
    }

    const handleSettle = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
        const idx = indexFromEvent(e)
        setActiveIndex(idx)
        const v = data[idx]?.value
        if (v !== undefined && v !== selectedValue) onChange(v)
    }

    return (
        <View style={[styles.container, { height: containerHeight, width }]}>
            <ScrollView
                ref={scrollRef}
                showsVerticalScrollIndicator={false}
                snapToInterval={itemHeight}
                decelerationRate="fast"
                scrollEventThrottle={16}
                contentOffset={{ x: 0, y: selectedIndex * itemHeight }}
                onScroll={handleScroll}
                onMomentumScrollEnd={handleSettle}
                onScrollEndDrag={handleSettle}
                contentContainerStyle={{ paddingVertical: padding }}
            >
                {data.map((item, i) => (
                    <View key={item.value} style={[styles.itemWrap, { height: itemHeight }]}>
                        <Text style={[styles.item, i === activeIndex && styles.itemActive]}>
                            {item.label}
                        </Text>
                    </View>
                ))}
            </ScrollView>
            <View pointerEvents="none" style={[styles.highlight, { top: padding, height: itemHeight }]} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        overflow: "hidden",
    },
    itemWrap: {
        justifyContent: "center",
        alignItems: "center",
    },
    item: {
        fontSize: 20,
        color: "#555",
        fontWeight: "500",
    },
    itemActive: {
        color: "#ffffff",
        fontWeight: "700",
        fontSize: 22,
    },
    highlight: {
        position: "absolute",
        left: 0,
        right: 0,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: "#0dcf5e",
        backgroundColor: "rgba(13,207,94,0.07)",
    },
})

export default WheelPicker
