import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, View, Button, TouchableOpacity, ScrollView, Image, ActivityIndicator } from 'react-native';
// import CheckBox from '@react-native-community/checkbox';
import Checkbox from 'expo-checkbox';
import RNPickerSelect from 'react-native-picker-select';
import * as ImagePicker from 'expo-image-picker';

const health_concern_data = {
    '피로감': 1,
    '눈건강': 2,
    '피부건강': 3,
    '체지방': 4,
    '혈관혈액순환': 5,
    '간건강': 6,
    '장건강': 7,
    '스트레스&수면': 8,
    '면역기능': 9,
    '혈중콜레스테롤': 10,
    '뼈건강': 11,
    '노화&향산화': 12, // 원데이터에 오타 있어서 추가함
    '여성건강': 13,
    '소화&위식도건강': 14,
    '남성건강': 15,
    '혈압': 16,
    '운동능력&근육량': 17,
    '두뇌활동': 18,
    '혈당': 19,
    '혈중중성지방': 20,
    '치아잇몸&잇몸건강': 21, // 원데이터에 오타 있어서 추가함
    '임산부&태아건강': 22,
    '탈모&손톱건강': 23,
    '관절건강': 24,
    '여성갱년기': 25,
    '호흡기건강': 26,
    '갑상선건강': 27,
    '빈혈': 28
};

const healthConcernOptions = Object.keys(health_concern_data).map(key => ({
    label: key,
    value: health_concern_data[key],
}));

const diseaseOptions = [
    { label: '고혈압', value: '고혈압' },
    { label: '당뇨', value: '당뇨' },
    { label: '고지혈증', value: '고지혈증' },
    { label: '폐질환', value: '폐질환' },
    { label: '뇌졸중(중풍)', value: '뇌졸중(중풍)' },
    { label: '심장질환', value: '심장질환' },
    { label: '심혈관질환', value: '심혈관질환' },
    { label: '신장질환', value: '신장질환' },
    { label: '간질환', value: '간질환' },
    { label: '저혈압', value: '저혈압' },
    { label: '빈혈', value: '빈혈' },
    { label: '치주질환', value: '치주질환' },
    { label: '갑상선질환', value: '갑상선질환' },
    { label: '임신, 수유', value: '임신, 수유' },
    { label: '흡연', value: '흡연' },
];

const specialConditionOptions = [
    { label: '해당사항 없음', value: 0 },
    { label: '임신부', value: 1 },
    { label: '수유부', value: 2 },
];

export default function App({ currentScreen, setCurrentScreen, setGoods, setBads, setAllHealth, setGaOutput, setUser }) {
    const [gender, setGender] = useState('');
    const [age, setAge] = useState('');
    const [specialCondition, setSpecialCondition] = useState('');
    const [disease, setDisease] = useState('');
    const [healthConcerns, setHealthConcerns] = useState([null, null, null]);
    const [image, setImage] = useState();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setGender('');
        setAge('');
        setSpecialCondition(0)
        setDisease('');
        setHealthConcerns([null, null, null]);
        setImage(null);

    }, [])

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            // aspect: [4, 3],
            quality: 1,
        });

        console.log(result); // result 객체 출력
        console.log(result.assets[0].uri)

        if (result) {
            setImage(result.assets[0].uri);
        } else {
            console.log('Image selection was cancelled or failed');
        }
    };

    const moveToChat = async () => {
        // 이미지 처리 후 채팅 화면으로 전환
        setIsLoading(true);  // 로딩 상태 시작
        user = {
            'gender': parseInt(gender),
            'age': parseInt(age),
            'condition': parseInt(specialCondition),
            'preference_category': healthConcerns,
            'disease': disease,
        }

        setUser(user)

        try {
            const response = await fetch('http://127.0.0.1:5000/ga_result', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ user: user })  // 필요한 데이터를 여기에 추가
            });

            console.log(response)

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log(data);  // 서버로부터 받은 데이터를 처리

            // ga_result = data["ga_result"]
            // setGaResult(ga_result)

            // 로딩 상태 해제 후 채팅 화면으로 전환
            setIsLoading(false);
            setGoods(data["goods"]);
            setBads(data["bads"]);
            setAllHealth(data["all_health"]);
            setGaOutput(data["ga_output"]);
            setCurrentScreen('Chat');
        } catch (error) {
            console.error('Error:', error);
            setIsLoading(false);
        }
    };

    // useEffect(() => {
    //     if (!isLoading) {
    //         setCurrentScreen('Chat');
    //     }
    // }, [currentScreen])

    console.log(isLoading);

    return (
        <>
            {isLoading ?
                <>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <ActivityIndicator size="large" color='#69FFEF' />
                        <Text style={styles.reminderText}> {'\n'}{'\n'}입력해주신 정보들을 바탕으로 {'\n'}영양제 조합 후보들을 구하고 있어요! {'\n'} 30초 정도만 기다려주세요! </Text>
                    </View>
                </>
                :
                <>
                    <View style={{ marginTop: 20 }}>
                        <TouchableOpacity style={styles.button} onPress={() => setCurrentScreen('Home')}>
                            <Text style={styles.buttonText}>뒤로 가기</Text>
                        </TouchableOpacity>
                    </View>
                    <ScrollView contentContainerStyle={styles.container}>
                        <Text style={styles.headerText}>✨ 먼저 기본 인적 사항/건강 고민 정보를 입력해 주세요!</Text>
                        <Text style={styles.label}>🔹 성별</Text>
                        <RNPickerSelect
                            onValueChange={(value) => setGender(value)}
                            placeholder={{ label: '성별을 선택하세요', value: null }}
                            items={[
                                { label: '남성', value: '1' },
                                { label: '여성', value: '0' },
                            ]}
                        />
                        <Text style={styles.label}>🔹 나이</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="나이를 입력하세요"
                            keyboardType="numeric"
                            onChangeText={setAge}
                            value={age}
                        />
                        <Text style={styles.label}>🔹 특수 상태</Text>
                        <RNPickerSelect
                            onValueChange={(value) => setSpecialCondition(value)}
                            items={specialConditionOptions}
                            placeholder={{ label: '특수 상태를 선택하세요', value: null }}
                            value={specialCondition}
                        />

                        <Text style={styles.label}>🔹 유의 질병 사항</Text>
                        <RNPickerSelect
                            onValueChange={(value) => setDisease(value)}
                            items={diseaseOptions}
                            placeholder={{ label: '질병을 선택하세요', value: null }}
                            value={disease}
                        />

                        <Text style={styles.label}>🔹 건강 고민 정보</Text>
                        {healthConcerns.map((concern, index) => (
                            <RNPickerSelect
                                key={index}
                                onValueChange={(value) => {
                                    const newConcerns = [...healthConcerns];
                                    newConcerns[index] = value;
                                    setHealthConcerns(newConcerns);
                                }}
                                items={healthConcernOptions}
                                placeholder={{ label: `건강 고민 ${index + 1} 선택`, value: null }}
                                value={healthConcerns[index]}
                            />
                        ))}

                        <TouchableOpacity style={styles.button2} onPress={pickImage}>
                            <Text style={styles.buttonText}>현재 먹고 있는 영양제 정보 추가하기</Text>
                        </TouchableOpacity>
                        <Text style={styles.reminderText}>영양제 성분함량 정보를 사진으로 찍어 갤러리에서 선택해주세요!</Text>
                        {image && (
                            <View style={styles.imageContainer}>
                                <Text style={styles.imageText}>선택된 이미지:</Text>
                                <Image source={{ uri: image }} style={styles.image} />
                            </View>
                        )}

                        <TouchableOpacity style={styles.button3} onPress={moveToChat}>
                            <Text style={styles.buttonText}>✨ 필리와 채팅하며 맞춤 조합을 찾아봐요!</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </>
            }
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 15,
        backgroundColor: '#fff',
    },
    label: {
        fontSize: 16,
        marginBottom: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 10,
        marginBottom: 15,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    checkboxLabel: {
        marginLeft: 8,
    },
    button: {
        borderColor: '#82FFF2',
        borderBottomWidth: 3,
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginVertical: 20,
    },
    button2: {
        backgroundColor: '#69FFEF',
        padding: 10,
        borderRadius: 150,
        alignItems: 'center',
        marginVertical: 2,
        marginTop: 20,
    },
    button3: {
        alignItems: 'center',
        backgroundColor: 'white',
        borderColor: '#69FFEF',
        padding: 10,
        margin: 30,
        borderWidth: 3,
        borderRadius: 150,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    headerText: {
        color: '#08222D',
        fontSize: 15,
        marginBottom: 20,
    },
    buttonText: {
        color: '#08222D',
        fontSize: 15,
    },
    reminderText: {
        textAlign: 'center', // 중앙 정렬 추가
        marginVertical: 0,
        fontSize: 12,
    },
    imageText: {
        textAlign: 'center',
        marginTop: 10,
        fontSize: 16,
    },
    imageContainer: {
        alignItems: 'center',
        marginVertical: 10,
    },
    imageText: {
        fontSize: 16,
        textAlign: 'center',
    },
    image: {
        width: 200,
        height: 200,
        resizeMode: 'cover',
    },
});
