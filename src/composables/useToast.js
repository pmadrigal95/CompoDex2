import { ref } from 'vue';

export function useToast() {
  
  const toasts = ref([]);
  let toastId = 0;

  const addToast = (toast) => {
    const id = toastId++;
    toasts.value.push({
      id,
      ...toast,
    });
    
    setTimeout(() => {
      removeToast(id);
    }, toast.duration || 5000);
    
    return id;
  };
  
  const removeToast = (id) => {
    const index = toasts.value.findIndex(toast => toast.id === id);
    if (index !== -1) {
      toasts.value.splice(index, 1);
    }
  };
  
  const success = (toast) => addToast({ type: 'success', ...toast });
  const error = (toast) => addToast({ type: 'error', ...toast });
  const info = (toast) => addToast({ type: 'info', ...toast });
  const warning = (toast) => addToast({ type: 'warning', ...toast });
  
  return { toasts, addToast, removeToast, success, error, info, warning };
}
