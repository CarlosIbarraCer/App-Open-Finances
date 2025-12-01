const API_BASE_URL = 'https://roberta-dreary-carolynn.ngrok-free.dev/api';

const jsonHeaders = {
  'Content-Type': 'application/json',
};

const REGISTER_PATH = '/auth/register/';
const LOGIN_PATH = '/auth/login/';

async function request<T = unknown>(path: string, options: RequestInit = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      ...jsonHeaders,
      ...(options.headers ?? {}),
    },
    ...options,
  });
  const body = await response.json().catch(() => null);
  if (!response.ok) {
    const detail = (body && (body.detail || body.error || body.message)) || 'Ocurrió un error inesperado';
    throw new Error(detail);
  }
  return body as T;
}

export type LoginResponse = {
  access: string;
  refresh: string;
  expires_in?: number;
  token_type?: string;
};

type RegisterRequest = {
  name: string;
  email: string;
  phone_number: string;
  password: string;
  age: number;
};

export async function registerUser(payload: RegisterRequest) {
  const normalizedEmail = payload.email.trim().toLowerCase();
  const cleanedName = payload.name.trim() || 'Cliente Open Finances';
  const nameParts = cleanedName.split(/\s+/).filter(Boolean);
  const firstName = nameParts.shift() ?? 'Cliente';
  const lastName = nameParts.join(' ') || firstName;

  await request(REGISTER_PATH, {
    method: 'POST',
    body: JSON.stringify({
      username: normalizedEmail,
      email: normalizedEmail,
      first_name: firstName,
      last_name: lastName,
      password: payload.password,
      password2: payload.password,
    }),
  });
}

export async function loginUser(payload: { email: string; password: string }) {
  const tokens = await request<LoginResponse>(LOGIN_PATH, {
    method: 'POST',
    body: JSON.stringify({
      username: payload.email.trim().toLowerCase(),
      password: payload.password,
    }),
  });
  if (!tokens || !tokens.access) {
    throw new Error('El backend no devolvió credenciales válidas.');
  }
  return tokens;
}
