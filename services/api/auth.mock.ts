// // services/api/auth.mock.ts
// import { AuthResponse, LoginCredentials, RegisterCredentials, User } from '@/types/auth';

// const MOCK_USER: User = {
//   id: '1',
//   name: 'Usuário Desenvolvedor',
//   email: 'admin@admin.admin',
// };

// export const authMockService = {
//   login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
//     await new Promise(resolve => setTimeout(resolve, 1000));
    
//     if (credentials.email === 'admin@admin.admin' && credentials.senha === 'admin') {
//       return {
//         token: 'mock_token_' + Date.now(),
//         user: MOCK_USER,
//       };
//     }
//     throw { response: { data: { message: 'Credenciais inválidas' } } };
//   },

//   validateToken: async (): Promise<boolean> => {
//     await new Promise(resolve => setTimeout(resolve, 500));
//     return true;
//   },

//   register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
//     await new Promise(resolve => setTimeout(resolve, 1000));
//     return {
//       token: 'mock_token_' + Date.now(),
//       user: { 
//         id: '2',
//         name: credentials.nome,
//         email: credentials.email 
//       },
//     };
//   },

//   resetPassword: async (email: string): Promise<void> => {
//     await new Promise(resolve => setTimeout(resolve, 1000));
//   },

//   refreshToken: async (refreshToken: string): Promise<{ token: string }> => {
//     return { token: 'mock_refreshed_token_' + Date.now() };
//   },
// };