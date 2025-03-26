<template>
    <div v-if="!componentCode && !isLoading"
        class="w-full h-[500px] rounded-lg border border-dashed border-border flex flex-col items-center justify-center p-8 text-center"
        v-motion :initial="{ opacity: 0 }" :enter="{ opacity: 1 }" :transition="{ duration: 400 }">
        <div class="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 8V16M8 12H16" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round" />
            </svg>
        </div>
        <h3 class="text-lg font-medium mb-1">No Documentation Yet</h3>
        <p class="text-sm text-muted-foreground max-w-md">
            Enter your Vue component code and a description, then click "Generate Documentation" to create the
            documentation.
        </p>
    </div>

    <div v-else class="w-full border border-border rounded-lg overflow-hidden bg-card" v-motion
        :initial="{ opacity: 0, y: 20 }" :enter="{ opacity: 1, y: 0 }" :transition="{ duration: 400 }">

        <div class="p-8 flex flex-col items-center justify-center h-[400px]" v-if="isLoading">
            <div class="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
            <p class="text-sm text-muted-foreground">Generating documentation...</p>
        </div>

        <div v-else class="p-6">
            {{ componentCode }}
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    componentCode: {
        type: String,
        default: ''
    },

    isLoading: {
        type: Boolean,
        default: false
    }
});
</script>