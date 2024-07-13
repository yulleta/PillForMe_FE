import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';

// 효능 정보 및 영양제 특성 정보
const all_health = ['스트레스&수면_긴장완화', '치아&잇몸_치아건강', '여성건강_생리전증후군&생리통개선', '장건강_유익균유해균균형도움', '장건강_배변활동', '임산부&태아건강', '뼈건강_칼슘흡수촉진', '갑상선건강', '혈당_인슐린작용개선', '혈중콜레스테롤_콜레스테롤흡수억제', '면역기능', '호흡기건강', '눈건강_안구건조개선', '피부건강_피부손상보호', '눈건강_야맹증개선'];
const efficacy = { '스트레스&수면_긴장완화': ['피로 개선', '눈 떨림 개선', '수면질 개선', '근육통 완화'], '치아&잇몸_치아건강': ['피로 개선', '감기 덜 걸림', '눈 떨림 개선', '수면질 개선'], /* ... 나머지 효능 정보 ... */ };

const goods = [['양이 넉넉하여 장기간 복용 가능', '수면 질 개선', '체력과 피부 상태를 개선함', '알약 크기가 크고 냄새가 강함', '장 활동 촉진', '안전한 보관을 위한 갈색병 제공'], ['딸기맛', '멀티비타민 보충 가능', '눈떨림 개선', '알약 크기가 적당하고 무취', '가격이 저렴', '우수한 성분'], ['무향', '속에서 냄새가 올라오는 부작용', '휴대성', '운동 후 피로감 개선', '맛과 향이 좋아 먹기 쉬움', '아침에 쉬워짐'], ['맛과 향 좋음', '휴대하기 편리', '눈의 피로 줄임', '알약 크기가 적당하고 먹기 편함', '면역력 증가', '피로감 감소']];
const bads = [['비싼 영양제 값', '효과 미흡', '대용량', '맛과 향', '섭취 불편함', '효능 정보 부족', '속쓰림', '가격', '맛이 좋지 않음', '섭취 불편', '냄새가 강함', '졸음', '해외직구로 구매하는 번거로움', '더운 곳에 보관 시 덩어리가 될 수 있음', '속이 부룩함', '엽산 함량 부족', '소화불량 가능성', '효과 미비', '알약이 많아서 한 번에 섭취하기 어려움', '향이 좋지 않음', '비타민 D 함량 부족', '부담감', '배송 지연 및 품질 불신', '목넘김이 불편함']];

const splitArrayIntoChunks = (array, chunkSize) => {
    let result = [];
    for (let i = 0; i < array.length; i += chunkSize) {
        result.push(array.slice(i, i + chunkSize));
    }
    return result;
};

const ChatScreen = ({ setCurrentScreen }) => {
    const initialMessages = [
        {
            _id: 1, // 고유한 메시지 ID
            text: '다음 선택지들 중에 원하는 효능 정보를 골라주세요!', // 메시지 텍스트
            createdAt: new Date(), // 메시지 생성 시간
            user: {
                _id: 2, // 시스템 또는 봇의 사용자 ID
                name: 'Pilly', // 사용자 이름 또는 별명
                avatar: require('./assets/img/pilly.png'), // 사용자 아바타 URL (선택적)
            },
        },
    ];

    const [messages, setMessages] = useState(initialMessages);
    const [healthChunks, setHealthChunks] = useState([]);
    const [selectedHealth, setSelectedHealth] = useState([]);
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        const chunks = splitArrayIntoChunks(all_health, 4);
        setHealthChunks(chunks);
    }, []);

    const handleHealthSelection = (health) => {
        setSelectedHealth([...selectedHealth, health]);
        if (currentStep < healthChunks.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            // 모든 효능 정보를 선택한 후
            setMessages((prevMessages) => [
                ...prevMessages,
                {
                    _id: prevMessages.length + 1,
                    text: `선택한 효능 정보: ${selectedHealth.join(', ')}`,
                    createdAt: new Date(),
                    user: { _id: 2, name: 'Chatbot', avatar: require('./assets/img/pilly.png') },
                },
            ]);
        }
    };

    const renderBubble = (props) => {
        return (
            <Bubble
                {...props}
                wrapperStyle={{
                    right: {
                        backgroundColor: '#69FFEF',
                    },
                }}
            />
        );
    };

    const renderHealthOptions = () => {
        if (currentStep >= healthChunks.length) return null;
        return (
            <View style={styles.optionsContainer}>
                {healthChunks[currentStep].map((health, index) => (
                    <TouchableOpacity key={index} style={styles.optionButton} onPress={() => handleHealthSelection(health)}>
                        <Text style={styles.optionText}>{health}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        );
    };

    return (
        <>
            <View style={{ marginTop: 50 }}>
                <TouchableOpacity style={styles.header} onPress={() => setCurrentScreen('Home')}>
                    <Text style={styles.headerText}>뒤로 가기</Text>
                </TouchableOpacity>
            </View>
            <GiftedChat
                renderBubble={renderBubble}
                style={{ margin: 20, backgroundColor: '#69FFEF' }}
                messages={messages}
                onSend={(messages) => setMessages(GiftedChat.append(messages))}
                user={{ _id: 1 }}
            />
            {renderHealthOptions()}
        </>
    );
};

const styles = StyleSheet.create({
    header: {
        borderColor: '#82FFF2',
        borderBottomWidth: 3,
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginVertical: 20,
    },
    headerText: {
        color: '#08222D',
        fontSize: 15,
    },
    button: {
        backgroundColor: '#69FFEF',
        padding: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: '#08222D',
        fontSize: 14,
    },
    optionsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        padding: 10,
    },
    optionButton: {
        backgroundColor: '#69FFEF',
        padding: 10,
        margin: 5,
        borderRadius: 5,
    },
    optionText: {
        color: '#08222D',
        fontSize: 14,
    },
});

export default ChatScreen;