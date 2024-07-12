import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Image } from 'react-native';
// import * as MediaLibrary from 'expo-media-library';
// import * as FileSystem from 'expo-file-system';
// import * as ImageManipulator from 'expo-image-manipulator';
// import axios from 'axios';

// 


export default function HomeScreen({ setCurrentScreen }) {
    useEffect(() => {

    }, []);

    const moveToChat = () => {
        // 이미지 처리 후 채팅 화면으로 전환
        setCurrentScreen('Profile');
    }

    return (
        // https://ibb.co/vJ6RND8
        <View style={styles.container}>
            <>
                <Image source={require('./assets/img/PillForMe.png')} style={styles.image} />
                <TouchableOpacity style={styles.button} onPress={moveToChat}>
                    <Text style={styles.buttonText}>✨ 나를 위한 {'\n'} 맞춤 영양제 조합 찾기!</Text>
                </TouchableOpacity>
            </>
        </View>
    );
}

const styles = StyleSheet.create({
    image: {
        width: '100%', // 이미지의 너비
        height: 380, // 이미지의 높이
        resizeMode: 'contain', // 이미지의 비율 유지
        margin: 10
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    button: {
        backgroundColor: 'white',
        borderColor: '#69FFEF',
        padding: 10,
        margin: 5,
        borderWidth: 5,
        borderRadius: 150,
        width: 240,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    buttonText: {
        color: '#08222D',
        textAlign: 'center',
        fontSize: 18
    }
});

