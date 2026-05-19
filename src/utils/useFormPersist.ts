import { useEffect, useRef } from "react";
import type { FormInstance } from "antd";

type Options = {
  /** localStorage-da saxlanmayacaq sahələrin adları (məs: parol) */
  exclude?: string[];
  /** Yazma əməliyyatları arasında gecikmə (ms) — performans üçün */
  debounceMs?: number;
};

/**
 * AntD Form üçün avtomatik localStorage saxlanc.
 *
 * Necə işləyir:
 *  - Komponent yükləndikdə → localStorage-dan oxuyub form-a qoyur
 *  - Form dəyəri dəyişdikcə → localStorage-a yazır (debounce ilə)
 *  - Submit uğurlu olduqda → clear() çağıraraq sil
 *
 * İstifadə nümunəsi:
 *   const persist = useFormPersist("register-draft", form, { exclude: ["password"] });
 *   const handleSubmit = async (values) => {
 *     await api.register(values);
 *     persist.clear();   // uğurdan sonra sil
 *   };
 *   <Form onValuesChange={persist.onValuesChange} onFinish={handleSubmit}>
 */
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
