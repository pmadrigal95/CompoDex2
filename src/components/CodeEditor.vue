<template>
    <div class="w-full mt-2" v-motion :initial="{ opacity: 0, y: 20 }" :enter="{ opacity: 1, y: 0 }"
        :transition="{ duration: 400 }">
        <div class="flex justify-between items-center mb-2">
            <label for="code-editor" class="text-sm font-medium text-foreground">
                {{ label }}
            </label>
            <span class="text-xs text-muted-foreground">
                Vue Component
            </span>
        </div>

        <!-- Editor de código -->
        <Codemirror v-model:value="code" :options="cmOptions" border :placeholder="placeholder" :height="300"
            @change="handleChange" />

        <div class="flex justify-between items-center mt-2">
            <div class="flex items-center space-x-2">
                <div :class="`h-2 w-2 rounded-full ${code.length > 0 ? 'bg-green-500' : 'bg-muted'}`"></div>
                <span class="text-xs text-muted-foreground">
                    {{ code.length }} characters
                </span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import Codemirror from 'codemirror-editor-vue3';

// Importar dependencias de Codemirror
import 'codemirror/addon/display/placeholder.js'; // Placeholder
import 'codemirror/mode/javascript/javascript.js'; // Modo de lenguaje JavaScript
import 'codemirror/theme/dracula.css'; // Tema

// Definir propiedades de entrada (props)
const props = defineProps({
    modelValue: {
        type: String,
        default: ''
    },
    placeholder: {
        type: String,
        default: '<!-- Enter your Vue component code here -->'
    },
    label: {
        type: String,
        default: 'Code Editor'
    }
});

// Emitir eventos
const emit = defineEmits(['update:modelValue']);

// Definir variables reactivas
const code = ref(props.modelValue); // Inicializar con modelValue

// Opciones para Codemirror
const cmOptions = ref({
    mode: 'text/javascript', // Modo de lenguaje
    theme: 'dracula', // Tema
});

// Función para manejar el cambio de código
const handleChange = (newValue) => {
    code.value = newValue; // Actualiza el valor del código
    emit('update:modelValue', newValue); // Emite el nuevo valor al padre
};

// Observar cambios en modelValue (propiedad externa)
watch(() => props.modelValue, (newValue) => {
    code.value = newValue; // Sincronizar el valor con modelValue
});

// Opcional: Ajuste de la altura del editor, en caso de ser necesario
watch(code, (newCode) => {
    // Puedes manejar el auto-resize si es necesario
});
</script>