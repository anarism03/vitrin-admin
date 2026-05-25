import axios from "axios";

type ErrorResponse = {
  message?: string | string[];
  error?: string;
};

const EN_AZ_ERRORS: Record<string, string> = {
  "Unauthorized": "Sessiya bitib və ya icazəniz yoxdur",
  "Forbidden": "Bu əməliyyata icazəniz yoxdur",
  "Not Found": "Məlumat tapılmadı",
  "Bad Request": "Daxil edilən məlumatlar yanlışdır",
  "Internal Server Error": "Sistemdə daxili xəta baş verdi",
  "User already exists": "Bu istifadəçi (email) artıq qeydiyyatdan keçib",
  "Invalid credentials": "Email və ya şifrə səhvdir",
  "User not found": "İstifadəçi tapılmadı",
  "Validation failed": "Məlumatların yoxlanışı uğursuz oldu",
  "Network Error": "Şəbəkə xətası (İnternet bağlantınızı yoxlayın)",
};

const SUBSTRINGS: [RegExp, string][] = [
  [/must be an email/gi, "düzgün email formatında olmalıdır"],
  [/must be a string/gi, "mətn formatında olmalıdır"],
  [/should not be empty/gi, "boş buraxıla bilməz"],
  [/must be longer than or equal to (\d+) characters/gi, "ən azı $1 simvol olmalıdır"],
  [/must be shorter than or equal to (\d+) characters/gi, "ən çox $1 simvol olmalıdır"],
  [/must be a valid uploaded product image path(.*)/gi, "düzgün şəkil formatında olmalıdır"],
  [/must be a URL address/gi, "düzgün link (URL) olmalıdır"],
  [/must be a positive number/gi, "müsbət rəqəm olmalıdır"],
  [/must be a number/gi, "rəqəm olmalıdır"],
  [/pageSize must not be greater than/gi, "Səhifə ölçüsü limitdən böyük olmamalıdır"],
];

function translateError(msg: string): string {
  if (!msg) return msg;
  
  if (EN_AZ_ERRORS[msg]) {
    return EN_AZ_ERRORS[msg];
  }

  let translated = msg;
  for (const [regex, replacement] of SUBSTRINGS) {
    translated = translated.replace(regex, replacement);
  }

  return translated;
}

export function getErrorMessage(err: unknown, fallback: string): string {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as ErrorResponse | undefined;

    if (Array.isArray(data?.message)) {
      return data.message.map(translateError).join(", ");
    }

    const rawMsg = typeof data?.message === 'string' ? data.message : data?.error || err.message;
    return rawMsg ? translateError(rawMsg) : fallback;
  }

  if (err instanceof Error) {
    return translateError(err.message) || fallback;
  }

  return fallback;
}

export function isEmailNotVerifiedError(err: unknown): boolean {
  if (!axios.isAxiosError(err)) return false;

  const status = err.response?.status;
  if (![400, 401, 403].includes(status || 0)) return false;

  const message = getErrorMessage(err, "").toLowerCase();

  return [
    "not verified",
    "unverified",
    "verify email",
    "email verification",
    "təsdiq",
    "təsdiqlənməyib",
  ].some((part) => message.includes(part));
}

export function unwrap<T = any>(responseData: any): T {
  return responseData?.data ?? responseData;
}

export function extractUser(responseData: any): any {
  const inner = unwrap<any>(responseData);

  if (!inner) return null;
  if (inner.user && typeof inner.user === "object") return inner.user;
  if (inner.id !== undefined || inner.email || inner.firstName) return inner;

  return null;
}
