<template>
    <div class="w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8" v-motion :initial="{ opacity: 0 }" :enter="{ opacity: 1 }"
            :transition="{ duration: 500 }">
            <div class="space-y-6">
                <div class="space-y-4" v-motion :initial="{ opacity: 0, y: 20 }" :enter="{ opacity: 1, y: 0 }"
                    :transition="{ duration: 400 }">
                    <div>
                        <h2 class="text-2xl font-semibold tracking-tight mb-1">Component Code</h2>
                        <p class="text-muted-foreground text-sm">
                            Enter your Vue component code below for documentation generation
                        </p>
                    </div>

                    <div class="space-y-2">
                        <label for="description" class="text-sm font-medium">
                            Component Name
                        </label>
                        <input id="name" v-model="componentName" type="text"
                            placeholder="Enter the name of your component..."
                            class="w-full p-3 bg-secondary/50 rounded-lg border-[1.5px] border-border focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none transition-all" />
                    </div>

                    <div class="space-y-2">
                        <label for="description" class="text-sm font-medium">
                            Component Description
                        </label>
                        <textarea id="description" v-model="description"
                            placeholder="Enter a description of what your component does..."
                            class="w-full p-3 bg-secondary/50 rounded-lg border-[1.5px] border-border focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none transition-all resize-none min-h-[60px]">
              </textarea>
                    </div>

                    <CodeEditor v-model="code" class="space-y-2" />

                    <button @click="handleGenerate"
                        class="w-full bg-primary text-primary-foreground font-medium py-2.5 px-4 rounded-lg transition-all hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none"
                        :disabled="isGenerating || !code.trim() || !componentName.trim()" v-motion
                        :hover="{ scale: 1.01 }" :tap="{ scale: 0.98 }">
                        <span class="flex items-center justify-center" v-if="isGenerating">
                            <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg"
                                fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                    stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                                </path>
                            </svg>
                            Generating...
                        </span>
                        <span v-else>Generate Documentation</span>
                    </button>
                </div>
            </div>

            <div class="space-y-4">
                <div v-motion :initial="{ opacity: 0, y: 20 }" :enter="{ opacity: 1, y: 0 }"
                    :transition="{ duration: 400, delay: 100 }">
                    <h2 class="text-2xl font-semibold tracking-tight mb-1">Documentation Preview</h2>
                    <p class="text-muted-foreground text-sm mb-4">
                        {{ generatedDoc.code ? 'Generated documentation for your component' :
                            'Enter component details and click generate' }}
                    </p>

                    <DocumentationPreview :componentCode="generatedDoc" :isLoading="isGenerating" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import CodeEditor from './CodeEditor.vue';
import DocumentationPreview from './DocumentationPreview.vue';
import { toast } from 'vue3-toastify'; // Importar toast
import 'vue3-toastify/dist/index.css'; // Importar los estilos de Toastify

import { generateDocumentation } from "@/utils/geminiAIHelper";

const code = ref('');
const componentName = ref('');
const description = ref('');
const isGenerating = ref(false);
const generatedDoc = ref('');

const handleGenerate = async () => {
    if (!code.value.trim()) {
        toast.error("Please enter your Vue component code before generating documentation.");
        return;
    }

    isGenerating.value = true;

    generatedDoc.value = await generateDocumentation(componentName.value, description.value, code.value, []);

    toast.success("Your component documentation has been created successfully.");

    isGenerating.value = false;

};
</script>
