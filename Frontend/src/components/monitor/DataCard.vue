<template>
    <div>
        <h2 class="text-xl font-bold pb-4">{{ title }}</h2>
        <p class="text-4xl font-bold" :style="{ color: color }">{{ data }} {{ unit }}</p>
    </div>
</template>

<script setup lang="ts">
defineProps({
    title: {
        type: String,
        default: ''
    },
    data: {
        type: Number,
        default: 0
    },
    unit: {
        type: String,
        default: ''
    },
    color: {
        type: String,
        default: 'black'
    }
})

</script>