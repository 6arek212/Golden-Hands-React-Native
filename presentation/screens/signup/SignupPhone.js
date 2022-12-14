import { useEffect } from "react";
import { View, TextInput, Text, TouchableWithoutFeedback, Keyboard, SafeAreaView, Platform } from "react-native";
import useAuthContext from "../../../hooks/useAuthContext";
import getString from "../../../localization";
import BackButton from "../../components/BackButton";
import DefaultButton from "../../components/DefaultButton";
import Opt from "../../components/Opt";
import Spacer from "../../components/Spacer";
import TextInputIcon from "../../components/TextInputIcon";
import Title from "../../components/Title";
import { globalStyles } from "../../styles/global";
import SignupViewModel from "./SignupViewModel";
import { AntDesign } from '@expo/vector-icons';
import Loader from "../../components/Loader";


const SignupPhone = ({ navigation }) => {
    const { phone, phoneError, onInputChanged, showCode, sendAuthVerification, signup, hideCode } = SignupViewModel()
    const { user } = useAuthContext()

    useEffect(() => {
        if (user) {
            navigation.reset({
                index: 0,
                routes: [{ name: 'ImageUpload' }],
            })
        }
    }, [user])

    return (
        <TouchableWithoutFeedback style={{ flex: 1 }} onPress={Keyboard.dismiss}>
            <View style={{ padding: 8, flex: 1 }}>
                <Loader />
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <BackButton onPress={navigation.goBack} />
                    <Spacer space={6} />
                    <Title text={getString.t('signup')} />
                </View>

                <Spacer style={{ flex: 1 }} />
                <View style={{ flex: 1, justifyContent: 'center' }}>

                    <View style={{ alignItems: 'flex-start' }}>
                        <Text style={globalStyles.font}>{getString.t('phone')}</Text>
                    </View>

                    {!showCode &&
                        <TextInputIcon
                            iconStart={<AntDesign name="phone" size={24} color="black" />}
                            onChangeText={(s) => { onInputChanged('phone', s) }}
                            value={phone}
                            keyboardType='numeric' />
                    }
                    <Text style={{ ...globalStyles.inputError, ...globalStyles.txtDirection }}>{phoneError}</Text>

                    {showCode &&
                        <Opt number={4} callback={signup} goBack={hideCode} sendAgain={sendAuthVerification} />
                    }
                </View>
                <Spacer style={{ flex: 1 }} />
                {!showCode &&
                    <DefaultButton
                        buttonStyles={{ paddingVertical: Platform.OS === 'android' ? 10 : 12 }}
                        text={showCode ? getString.t('next') : getString.t('check_phone')}
                        onPress={() => {
                            if (!showCode) {
                                sendAuthVerification()
                            }
                        }} />
                }
                <SafeAreaView />
            </View>
        </TouchableWithoutFeedback>
    );
}

export default SignupPhone;