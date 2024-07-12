// ChatScreen.js
import React, { useState } from 'react';
import { GiftedChat, Bubble, Avatar, Time } from 'react-native-gifted-chat';
// import axios from 'axios';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function ChatScreen({ setCurrentScreen }) {
    const initialMessages = [
        {
            _id: 1, // 고유한 메시지 ID
            text: '🔍어떤 이미지를 찾고 싶으신가요? \n⭐"누가/어디에서/무엇을/어떻게"\n정보를 포함하여 검색하면 이미지를 더 빨리 찾을 수 있어요! \n🐝유사도를 분석해 가장 일치하는 상위 5개 이미지를 제공해 드려요.\n영어로 검색해주세요!', // 메시지 텍스트
            createdAt: new Date(), // 메시지 생성 시간
            user: {
                _id: 2, // 시스템 또는 봇의 사용자 ID
                name: 'Chatbot', // 사용자 이름 또는 별명
                avatar: require('./assets/img/pilly.png'), // 사용자 아바타 URL (선택적)
            },
        },
    ];

    const [messages, setMessages] = useState(initialMessages);

    async function onSend(newMessages = []) {
        setMessages(GiftedChat.append(messages, newMessages));
        const text = newMessages[0].text;

        try {
            // node 서버로부터 임베딩 받기
            const totalEmbeddingResponse = await axios.post('http://IP주소:3000/generate-embeddings', { text: totalText });

            const embeddings = {
                total: totalEmbeddingResponse.data,
            };

            // 모든 메시지를 결합하여 업데이트
            setMessages(previousMessages => GiftedChat.append(previousMessages, [...imageMessages, confirmMessages]));
        } catch (error) {
            console.error(error);
        }
    }





    return (
        <>
            <View style={{ marginTop: 50 }}>
                <TouchableOpacity style={styles.button} onPress={() => setCurrentScreen('Home')}>
                    <Text style={styles.buttonText}>뒤로 가기</Text>
                </TouchableOpacity>
            </View>
            <GiftedChat
                renderBubble={renderBubble}
                style={{ margin: 20, backgroundColor: '#69FFEF' }}
                messages={messages}
                onSend={messages => onSend(messages)}
                user={{ _id: 1 }}
            />
        </>
    );
}

// renderAvatar={renderAvatar}
// renderTime={renderTime} 


const styles = StyleSheet.create({
    button: {
        borderColor: '#82FFF2',
        borderBottomWidth: 3,
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#08222D',
    },
    // ... 다른 스타일 정의
});

const renderBubble = (props) => {
    return (
        <Bubble
            {...props}
            wrapperStyle={{
                right: {
                    backgroundColor: '#69FFEF',
                },
            }}
            textStyle={{
                right: {
                    color: '#08222D',
                },
            }}
        />
    );
};
