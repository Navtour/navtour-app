export interface LoginCredentials {
  email: string;
  senha: string;
}

export interface AdressCredentials {
  cep: string;
  numero: string;
  complemento: string;
}

export interface RegisterCredentials {
  nome: string;
  email: string;
  senha: string;
  cpf: string;
  telefone: string;
  data_nascimento: string;
  endereco?: AdressCredentials;
}

export interface UserResponse {
    id: string;
    nome: string;
    email: string;
    cpf: string;
}

export interface LoginResponse {
    message: string;
    token: string;
    usuario: UserResponse; 
}

export interface AuthContextData {
  user: UserResponse | null;
  loading: boolean;
  signIn: (credentials: LoginCredentials) => Promise<void>;
  signUp: (credentials: RegisterCredentials) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}
