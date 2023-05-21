import { RoleCode } from "../../interfaces/User";

export interface AuthResponses {
    success: boolean;
    message?: string;
    data?: {
        school_code?: string;
        token?: string;
        role?: RoleCode;
    };
}

export interface AuthContextType {
    signIn: (value: { email: string; password: string }) => Promise<AuthResponses>;
    signOut: () => Promise<AuthResponses>;
    session: () => Promise<AuthResponses>;
    checkSessionExpiry: () => boolean;
    // role: RoleCode;
    authState: AuthStateType;
}

export interface AuthStateType {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    schoolCode: string;
    schoolName: string;
    role: RoleCode;
    roleName: string;
    phone: string;
}

export interface AuthStateResponseType {
    id: number;
    token?: string;
    email: string;
    first_name: string;
    last_name: string;
    phone: string;
    mobile: string;
    school_code: string;
    school_name: string;
    role: RoleCode;
    role_name: string;
}

// export interface AuthStateWithTokenResponseType extends AuthStateResponseType {
//     token: string;
// }

export interface AuthActionType {
    type: string;
    payload: Partial<AuthStateType>;
}
