<script setup>
import { ref } from "vue";
import { generateDocumentation } from "@/utils/openaiHelper.js";

const componentName = ref("ButtonComponent");
const description = ref("Un botón reutilizable con variantes de tamaño y color.");
const code = ref(`<template><button :class="buttonClass">{{ label }}</button></template>`);
const tags = ref(["Vue", "UI", "Reusable"]);
const documentation = ref("");

const generateDoc = async () => {
  documentation.value = "Generando documentación...";
  documentation.value = await generateDocumentation(componentName.value, description.value, code.value, tags.value);
};
</script>

<template>
  <div class="container">
    <h1>Generador de Documentación</h1>
    <button @click="generateDoc">Generar Documentación</button>
    <pre>{{ documentation }}</pre>
  </div>
</template>

<style scoped>
.container {
  max-width: 600px;
  margin: auto;
  text-align: center;
}

button {
  background: #42b883;
  color: white;
  padding: 10px;
  border: none;
  cursor: pointer;
}

pre {
  background: #f5f5f5;
  padding: 10px;
  text-align: left;
}
</style>
