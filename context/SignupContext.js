import { createContext, useEffect, useReducer } from "react";


export const SignupContext = createContext()


export const signupReducer = (state, action) => {
    console.log(action);
    switch (action.type) {
        case 'SET_DATA':
            return {
                ...state,
                ...action.payload
            }
        default: return state
    }
}





export const SignupContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(signupReducer, {
        firstName: null,
        lastName: null,
        birthDate: null,
        phone: null
    });

    return (
        <SignupContext.Provider value={{ ...state, dispatch }}>
            {children}
        </SignupContext.Provider>
    );
}
