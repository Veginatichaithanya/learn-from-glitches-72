import { useRef } from "react";
import Toaster, { ToasterRef } from "@/components/ui/toast";

export const useToast = () => {
  const toasterRef = useRef<ToasterRef>(null);

  const toast = (props: {
    title?: string;
    description?: string;
    message?: string;
    variant?: 'default' | 'success' | 'error' | 'warning' | 'destructive';
    duration?: number;
  }) => {
    const mappedVariant = props.variant === 'destructive' ? 'error' : (props.variant || 'default');
    toasterRef.current?.show({
      title: props.title,
      message: props.description || props.message || '',
      variant: mappedVariant as 'default' | 'success' | 'error' | 'warning',
      duration: props.duration,
    });
  };

  return {
    toast,
    toasterRef,
  };
};

// Create a global toaster ref for standalone usage
let globalToasterRef: ToasterRef | null = null;

export const setGlobalToasterRef = (ref: ToasterRef) => {
  globalToasterRef = ref;
};

export const toast = (props: {
  title?: string;
  description?: string;
  message?: string;
  variant?: 'default' | 'success' | 'error' | 'warning' | 'destructive';
  duration?: number;
}) => {
  const mappedVariant = props.variant === 'destructive' ? 'error' : (props.variant || 'default');
  globalToasterRef?.show({
    title: props.title,
    message: props.description || props.message || '',
    variant: mappedVariant as 'default' | 'success' | 'error' | 'warning',
    duration: props.duration,
  });
};
