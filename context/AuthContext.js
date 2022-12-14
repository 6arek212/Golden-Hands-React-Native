import { createContext, useEffect, useReducer } from "react";


export const AuthContext = createContext()
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthRepository from "../repository/AuthRepository";
import UserRepository from "../repository/UsersRepository";


export const authReducer = (state, action) => {
    // console.log(action);
    switch (action.type) {
        case 'LOGIN':
            return {
                ...action.payload
            }

        case 'UPDATE_USER':
            AsyncStorage.setItem('user', JSON.stringify(action.payload.user))
            return {
                ...state,
                ...action.payload
            }

        case 'UPDATE_USER_IMAGE':
            AsyncStorage.setItem('user_image', action.payload)
            const data = { ...state }
            data.user.image = action.payload
            return data


        case 'LOGOUT':
            const { logout } = AuthRepository()
            logout()
            return { user: null, token: null }

        default: return state
    }
}


const getUserProfile = async (dispatch, id) => {

    try {
        const { getUser } = UserRepository()
        const data = await getUser(id)
        await AsyncStorage.setItem('user', JSON.stringify(data.user))
        await AsyncStorage.setItem('user_image', data.user.image)

        dispatch({
            type: 'UPDATE_USER',
            payload: {
                user: data.user
            }
        })

    } catch (e) {

    }
}


const getAuthDataFromLoaclStorage = async (dispatch) => {
    try {
        const token = await AsyncStorage.getItem('token')
        const refreshToken = await AsyncStorage.getItem('refreshToken')
        const expireDate = await AsyncStorage.getItem('expireDate')
        const userJson = await AsyncStorage.getItem('user')
        const image = await AsyncStorage.getItem('user_image')
        const user = userJson != null ? JSON.parse(userJson) : null;
        user.image = image
        const isTokenExpired = new Date(expireDate) < new Date()

        dispatch({
            type: 'LOGIN',
            payload: !isTokenExpired ? {
                user,
                token,
                refreshToken,
                expireDate
            } : null
        })

        if (user && !isTokenExpired){
            getUserProfile(dispatch, user._id)
        }
    } catch (e) {
        console.log(e);
    }
}



export const AuthContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, {
        user: null,
        token: null,
        refreshToken: null,
        expireDate: null,
    });

    useEffect(() => {
        getAuthDataFromLoaclStorage(dispatch)
    }, [])

    return (
        <AuthContext.Provider value={{ ...state, dispatch }}>
            {children}
        </AuthContext.Provider>
    );
}
