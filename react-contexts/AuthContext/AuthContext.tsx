import { useLocalStorage } from "@mantine/hooks";
import { createContext, useEffect, useReducer } from "react";
import { RoleCode } from "../../interfaces/User";
import Login from "../../networking/api/Auth/Login";
import Logout from "../../networking/api/Auth/Logout";
import Identity from "../../networking/api/Auth/Identity";
import { AuthContextType, AuthStateType, AuthActionType, AuthStateResponseType } from "./AuthContextInterface";
import { authReducer, initialAuthState } from "./Reducers";

const SESSION_LENGTH = 30 * 60 * 1000; // 30 minutes

interface AuthContext {
    children: React.ReactNode;
}

export const AuthContext = createContext<AuthContextType>({
    signIn: () => {
        return new Promise((resolve) => {
            resolve({
                success: false,
            });
        });
    },
    signOut: () => {
        return new Promise((resolve) => {
            resolve({
                success: false,
            });
        });
    },
    session: () => {
        return new Promise((resolve) => {
            resolve({
                success: false,
            });
        });
    },
    checkSessionExpiry: () => false,
    // role: "user",
    authState: {} as AuthStateType,
});

export const AuthContextProvider = ({ children }: AuthContext) => {
    const [token, setToken] = useLocalStorage<string>({ key: "token", defaultValue: "" });
    const [lastLogin, setLastLogin] = useLocalStorage<string>({ key: "lastLogin", defaultValue: "" });

    const [authState, dispatch] = useReducer(authReducer, initialAuthState);

    async function fetchSignin(value: { email: string; password: string }) {
        const req = new Login();
        req.input(value);
        const res = await req.fetch();

        if (res.success) {
            const { id, token, email, first_name, last_name, school_code, school_name, role, role_name, phone } =
                res.data as unknown as AuthStateResponseType;

            if (token) setToken(token);

            setLastLogin(new Date().getTime() as unknown as string);

            dispatch({
                type: "SET_USER",
                payload: {
                    id: id,
                    firstName: first_name,
                    lastName: last_name,
                    email: email,
                    schoolCode: school_code,
                    schoolName: school_name,
                    role: role,
                    roleName: role_name,
                    phone: phone,
                },
            });

            return {
                success: true,
                data: {
                    school_code,
                    token,
                    role,
                },
            };
        } else {
            // console.log(res.message);
            return {
                success: false,
                message: res.message,
            };
        }
    }

    async function fetchSignOut() {
        const req = new Logout();
        const res = await req.fetch();

        if (res.success) {
            setToken("");
            setLastLogin("");

            return {
                success: true,
            };
        } else {
            return {
                success: false,
                message: res.message,
            };
        }
    }

    async function fetchIdentity() {
        const req = new Identity();
        const res = await req.fetch();

        if (res.success) {
            const { id, email, first_name, last_name, school_code, school_name, role, role_name, phone } =
                res.data as unknown as AuthStateResponseType;

            dispatch({
                type: "SET_USER",
                payload: {
                    id: id,
                    firstName: first_name,
                    lastName: last_name,
                    email: email,
                    phone: phone,
                    schoolCode: school_code,
                    schoolName: school_name,
                    role: role,
                    roleName: role_name,
                },
            });

            return {
                success: true,
            };
        } else {
            return {
                success: false,
                message: res.message,
            };
        }
    }

    function checkSessionExpiry() {
        const currentTime = new Date().getTime();

        if (!lastLogin) {
            return false;
        }

        const elapsedTime = currentTime - parseInt(lastLogin);

        if (elapsedTime > SESSION_LENGTH) {
            return true;
        }

        return false;
    }

    useEffect(() => {
        if (token) {
            fetchIdentity();
        }
    }, [token]);

    return (
        <AuthContext.Provider
            value={{
                signIn: fetchSignin,
                signOut: fetchSignOut,
                session: fetchIdentity,
                checkSessionExpiry,
                authState,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
