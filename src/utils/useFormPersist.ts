import { useEffect, useRef } from "react";
import type { FormInstance } from "antd";

type Options = {
  exclude?: string[];
  debounceMs?: number;
};


export function useFormPersist<T extends Record<string, any>>(
  storageKey: string,
  form: FormInstance<T>,
  options: Options = {}
) {
  const { exclude = [], debounceMs = 300 } = options;
  const timeoutRef = useRef<number | null>(null);
  const excludeRef = useRef(exclude);
  excludeRef.current = exclude;

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const saved = JSON.parse(raw);
        if (saved && typeof saved === "object") {
          form.setFieldsValue(saved);
        }
      }
    } catch {
    }
    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, [storageKey]);

  const onValuesChange = (_changed: Partial<T>, all: T) => {
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => {
      try {
        const toSave: Record<string, any> = { ...all };
        excludeRef.current.forEach((field) => {
          delete toSave[field];
        });
        Object.keys(toSave).forEach((k) => {
          if (toSave[k] === undefined || toSave[k] === "") delete toSave[k];
        });
        if (Object.keys(toSave).length === 0) {
          localStorage.removeItem(storageKey);
        } else {
          localStorage.setItem(storageKey, JSON.stringify(toSave));
        }
      } catch {
      }
    }, debounceMs);
  };

  const clear = () => {
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    localStorage.removeItem(storageKey);
  };

  return { onValuesChange, clear };
}
