export const generatePrompt = async (name, description, code, tags = []) => {
  return `
        Genera documentación completa para el siguiente componente Vue.

        **Nombre del Componente:** ${name}  
        **Descripción:** ${description}  
        **Etiquetas:** ${tags.join(", ")}  

        **Código:**  
        \`\`\`vue
        ${code}
        \`\`\`

        **Formato:**  
        - Descripción general del componente  
        - Instrucciones de instalación  
        - Ejemplos de uso  
        - Documentación de props (nombre, tipo, valor por defecto, descripción)  
        - Documentación de eventos  
        - Documentación de slots (si aplica)  
        - Ejemplos mostrando diferentes configuraciones  

        La documentación debe estar completamente en **español** y en **formato Markdown**.
      `;
}

/**
* Genera documentación de ejemplo cuando la API de OpenAI no está disponible
*/
/**
 * Genera documentación de ejemplo cuando la API de OpenAI no está disponible
 */
// export const generateFallbackDocumentation = (name, description, code, tags = []) => {
//   const extractMatches = (regex, text) => (text.match(regex) || []).map(match => match.replace(regex, '$1'));

//   const propsMatch = code.match(/props:\s*{([^}]*)}/s);
//   const emitsMatch = extractMatches(/\$emit\(['"](.+?)['"]\)/g, code);
//   const slotsMatch = extractMatches(/<slot(?: name=["'](.+?)["'])?/g, code).map(s => s || 'default');

//   const props = propsMatch
//     ? [...propsMatch[1].matchAll(/(\w+):\s*{\s*type:\s*(\w+).*?(required:\s*(true|false))?.*?(default:\s*(['"\`]?[^,'"\`]*['"\`]|\d+|true|false))?/gs)]
//       .map(([, name, type = 'Any', , required = 'false', , defaultValue]) => ({
//         name,
//         type,
//         required: required === 'true',
//         default: defaultValue?.replace(/['"\`]/g, '') || undefined
//       }))
//     : [];

//   const events = [...new Set(emitsMatch)];
//   const slots = [...new Set(slotsMatch.length ? slotsMatch : ['default'])];

//   const formatTable = (headers, rows) =>
//     `| ${headers.join(' | ')} |\n| ${headers.map(() => '---').join(' | ')} |\n${rows.map(row => `| ${row.join(' | ')} |`).join('\n')}`;

//   const getDescription = key => ({
//     disabled: 'Desactiva el componente cuando es verdadero',
//     type: 'Define el tipo visual del componente',
//     size: 'Define el tamaño del componente',
//     color: 'Define el color principal del componente',
//     class: 'Clases CSS adicionales para el componente',
//     style: 'Estilos CSS inline adicionales',
//     id: 'ID HTML para el componente',
//     icon: 'Ícono a mostrar en el componente',
//     block: 'Si es verdadero, el componente ocupará todo el ancho disponible',
//     item: 'Datos a mostrar en el componente',
//     data: 'Datos a mostrar en el componente'
//   }[key] || `Configura el comportamiento de ${key} en el componente`);

//   const propTable = props.length
//     ? formatTable(['Nombre', 'Tipo', 'Requerido', 'Valor por defecto', 'Descripción'],
//       props.map(p => [p.name, p.type, p.required ? 'Sí' : 'No', p.default || '-', getDescription(p.name)]))
//     : '';

//   const eventTable = events.length
//     ? formatTable(['Nombre', 'Parámetros', 'Descripción'],
//       events.map(e => [e, e.includes('update') ? 'value: any' : 'event', `Se emite cuando ocurre ${e}`]))
//     : '';

//   const slotTable = slots.length
//     ? formatTable(['Nombre', 'Props pasados', 'Descripción'],
//       slots.map(s => [s, '-', `Contenido para ${s}`]))
//     : '';

//   return `# ${name}

// ## Descripción
// ${description}

// ${tags.length ? `## Etiquetas\n${tags.map(tag => `- ${tag}`).join('\n')}\n` : ''}

// ## Instalación
// \`\`\`bash
// npm install ${name.toLowerCase()}  # o yarn add ${name.toLowerCase()}
// \`\`\`

// ## Uso
// \`\`\`javascript
// import ${name} from '@/components/${name}';

// export default {
//   components: { ${name} }
// };
// \`\`\`

// ## API
// ${propTable ? `### Props\n\n${propTable}\n` : ''}
// ${eventTable ? `### Eventos\n\n${eventTable}\n` : ''}
// ${slotTable ? `### Slots\n\n${slotTable}\n` : ''}

// ## Ejemplo básico
// \`\`\`vue
// <template>
//   <${name} ${props.slice(0, 2).map(p => `${p.name}="${p.default || 'ejemplo'}"`).join('\n    ')} />
// </template>
// \`\`\`

// ## Código fuente del componente
// \`\`\`vue
// ${code}
// \`\`\`
// `;
// };



/**
 * Genera documentación de ejemplo cuando la API de OpenAI no está disponible
 */
export const generateFallbackDocumentation = (name, description, code, tags) => {
  // Extraer props, eventos y slots del código (de manera muy básica)
  const propsMatch = code.match(/props:\s*{([^}]*)}/s);
  const emitsMatch = code.match(/emits:\s*\[(.*?)\]/s) || code.match(/\$emit\(['"](.+?)['"]/g);
  const slotsMatch = code.match(/<slot.*?>/g);

  let props = [];
  let events = [];
  let slots = [];

  // Procesamiento básico de props
  if (propsMatch && propsMatch[1]) {
    const propsText = propsMatch[1];
    const propNames = propsText.match(/(\w+):/g) || [];

    props = propNames.map(p => {
      const name = p.replace(':', '');
      const typeMatch = propsText.match(new RegExp(`${name}:[\s\n]*{[\s\n]*type:[\s\n]*([\w\d]+)`));
      const requiredMatch = propsText.match(new RegExp(`${name}:[\s\n]*{[\s\n]*.*required:[\s\n]*(true|false)`));
      const defaultMatch = propsText.match(new RegExp(`${name}:[\s\n]*{[\s\n]*.*default:[\s\n]*(['"].*?['"]|\d+|true|false)`));
      
      return {
        name,
        type: typeMatch ? typeMatch[1] : 'Any',
        required: requiredMatch ? requiredMatch[1] === 'true' : false,
        default: defaultMatch ? defaultMatch[1] : undefined
      };
    });
  }

  // Procesamiento básico de eventos
  if (emitsMatch) {
    events = Array.isArray(emitsMatch)
      ? emitsMatch.map(e => e.match(/\$emit\(['"](.+?)['"]/)?.[1] || '').filter(Boolean)
      : emitsMatch[1].split(',').map(e => e.trim().replace(/['"]/g, '')).filter(Boolean);
  }

  // Procesamiento básico de slots
  if (slotsMatch) {
    slots = slotsMatch.map(slot => {
      const nameMatch = slot.match(/name=["'](.+?)["']/);
      return nameMatch ? nameMatch[1] : 'default';
    });
  }

  // Si no hay slots detectados, asumimos que hay un slot default
  if (slots.length === 0) slots.push('default');

  // Eliminar duplicados
  slots = [...new Set(slots)];
  events = [...new Set(events)];

  // Generar documentación básica en formato markdown
  return `# ${name}

## Descripción

${description}

${tags.length > 0 ? `## Etiquetas

${tags.map(tag => `- ${tag}`).join('\n')}` : ''}

## Instalación

\`\`\`bash
# Si usas npm
npm install ${name.toLowerCase()}

# Si usas yarn
yarn add ${name.toLowerCase()}
\`\`\`

## Uso

Este componente debe ser importado y registrado en tu aplicación Vue.

### Importación

\`\`\`javascript
import ${name} from '@/components/${name}';

export default {
  components: { ${name} }
};
\`\`\`

### Uso global

\`\`\`javascript
import { createApp } from 'vue';
import App from './App.vue';
import ${name} from '@/components/${name}';

const app = createApp(App);
app.component('${name}', ${name});
app.mount('#app');
\`\`\`

## API

${props.length > 0 ? `### Props

| Nombre | Tipo | Requerido | Valor por defecto |
|--------|------|-----------|-------------------|
${props.map(p => `| ${p.name} | ${p.type} | ${p.required ? 'Sí' : 'No'} | ${p.default || '-'} |`).join('\n')}` : ''}

${events.length > 0 ? `### Eventos

| Nombre |
|--------|
${events.map(e => `| ${e} |`).join('\n')}` : ''}

${slots.length > 0 ? `### Slots

| Nombre |
|--------|
${slots.map(s => `| ${s} |`).join('\n')}` : ''}

## Código fuente del componente

\`\`\`vue
${code}
\`\`\`
  `;
};
