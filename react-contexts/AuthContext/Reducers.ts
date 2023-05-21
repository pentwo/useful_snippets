import { AuthStateType, AuthActionType } from "./AuthContextInterface";

export const authReducer = (state: AuthStateType, action: AuthActionType) => {
    return {
        ...state,
        ...action.payload,
    };
};

export const initialAuthState: AuthStateType = {
    id: 0,
    firstName: "",
    lastName: "",
    email: "",
    schoolCode: "",
    schoolName: "",
    role: "user",
    roleName: "",
    phone: "",
};
