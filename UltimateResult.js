import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, LogBox, ActivityIndicator } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';

// 모든 경고 메시지 무시
LogBox.ignoreAllLogs(true);
const limits_json = require('./성분별한계량.json');
const ingredients_json = require('./최종_영양제_함량정보.json');
const ocr_json = require('./ocr_result.json');

const health_concern_data = {
    '1': '피로감',
    '2': '눈건강',
    '3': '피부건강',
    '4': '체지방',
    '5': '혈관혈액순환',
    '6': '간건강',
    '7': '장건강',
    '8': '스트레스&수면',
    '9': '면역기능',
    '10': '혈중콜레스테롤',
    '11': '뼈건강',
    '12': '노화&향산화',
    '13': '여성건강',
    '14': '소화&위식도건강',
    '15': '남성건강',
    '16': '혈압',
    '17': '운동능력&근육량',
    '18': '두뇌활동',
    '19': '혈당',
    '20': '혈중중성지방',
    '21': '치아잇몸&잇몸건강',
    '22': '임산부&태아건강',
    '23': '탈모&손톱건강',
    '24': '관절건강',
    '25': '여성갱년기',
    '26': '호흡기건강',
    '27': '갑상선건강',
    '28': '빈혈'
}

const health_ingredient = {
    '피로감': ['비타민B7'],
    '눈건강': ['비타민E'],
    '피부건강': ['비타민B7'],
    '체지방': ['비타민B5'],
    '혈관혈액순환': ['오메가3(EPA+DHA)'],
    '간건강': ['비타민B2'],
    '장건강': ['아연'],
    '스트레스&수면': ['마그네슘'],
    '면역기능': ['아연'],
    '혈중콜레스테롤': ['비타민E'],
    '뼈건강': ['아연'],
    '노화&향산화': ['비타민C'],
    '여성건강': ['마그네슘'],
    '소화&위식도건강': ['아연'],
    '남성건강': ['아연'],
    '혈압': ['칼륨'],
    '운동능력&근육량': ['비타민B2'],
    '두뇌활동': ['오메가3(EPA+DHA)'],
    '혈당': ['크롬'],
    '혈중중성지방': ['오메가3(EPA+DHA)'],
    '치아&잇몸': ['칼슘', '비타민C'],
    '임산부&태아건강': ['마그네슘'],
    '탈모&손톱건강': ['비타민B5'],
    '관절건강': ['비타민D'],
    '여성갱년기': [],
    '호흡기건강': ['비타민C'],
    '갑상선건강': ['요오드'],
    '빈혈': ['비타민B9']
}

const diseases = {
    "고혈압": {
        "금지": ["칼륨", "아르기닌", "은행잎추출물", "감마리놀렌산"],
        "과다 섭취 주의": ["칼슘"],
        "이미 치료제 복용 시 주의": ["나이아신"]
    },
    "당뇨": {
        "금지": ["글루코사민"],
        "과다 섭취 주의": ["비타민B3"],
        "이미 치료제 복용 시 주의": ["크롬", "홍삼"]
    },
    "고지혈증": {
        "금지": [],
        "과다 섭취 주의": ["효소", "식이섬유"],
        "이미 치료제 복용 시 주의": []
    },
    "폐질환": {
        "금지": [],
        "과다 섭취 주의": [],
        "이미 치료제 복용 시 주의": []
    },
    "뇌졸중(중풍)": {
        "금지": [],
        "과다 섭취 주의": ["카페인"],
        "이미 치료제 복용 시 주의": []
    },
    "심장질환": {
        "금지": [],
        "과다 섭취 주의": ["칼슘", "비타민 D", "합성 비타민 E", "철분제"],
        "이미 치료제 복용 시 주의": []
    },
    "심혈관질환": {
        "금지": [],
        "과다 섭취 주의": ["아르기닌"],
        "이미 치료제 복용 시 주의": []
    },
    "신장질환": {
        "금지": [],
        "과다 섭취 주의": ["크롬", "감초", "비타민C", "비타민D", "크렌베리", "크레아틴", "라이신"],
        "이미 치료제 복용 시 주의": []
    },
    "간질환": {
        "금지": [],
        "과다 섭취 주의": ["가르시니아", "녹차추출물", "강황추출물"],
        "이미 치료제 복용 시 주의": []
    },
    "저혈압": {
        "금지": ["아르기닌"],
        "과다 섭취 주의": ["칼륨"],
        "이미 치료제 복용 시 주의": []
    },
    "빈혈": {
        "금지": [],
        "과다 섭취 주의": [],
        "이미 치료제 복용 시 주의": []
    },
    "치주질환": {
        "금지": [],
        "과다 섭취 주의": [],
        "이미 치료제 복용 시 주의": []
    },
    "갑상선질환": {
        "금지": ["요오드"],
        "과다 섭취 주의": [],
        "이미 치료제 복용 시 주의": []
    },
    "임신, 수유": {
        "금지": ["바나바잎추출물", "은행잎추출물", "옥타코사놀", "루테인"],
        "과다 섭취 주의": [],
        "이미 치료제 복용 시 주의": []
    },
    "흡연": {
        "금지": ["베타카로틴", "비타민B6", "비타민B12", "루테인"],
        "과다 섭취 주의": [],
        "이미 치료제 복용 시 주의": []
    }
}


const UltimateResultScreen = ({ setCurrentScreen, finalResult, user }) => {

    console.log("user: ", user)
    console.log("finalResult: ", finalResult)
    const ocrItems = ['안국건강 안국 루테인 지아잔틴 미니', '암웨이 뉴트리라이트 밸런스 위드인 365 프로바이오틱스']

    const dummy_user = {
        'gender': 0,
        'age': 29,
        'condition': 0,
        'preference_category': [6, 7, 8],
        'disease': '고혈압',
    }

    const dummy_finalResult = [
        [['커클랜드_데일리 멀티 비타민&미네랄(국내)', '레이크에비뉴뉴트리션_마그네슘 비스글리시네이트 킬레이트 200mg'], 20.0],
        [['세노비스_마그네슘', '센트룸_우먼(국내)'], 19.6],
        [['블루보넷뉴트리션_킬레이트 칼슘 마그네슘', '커클랜드_데일리 멀티 비타민&미네랄(국내)'], 18.299999999999997],
        [['블루보넷뉴트리션_킬레이트 칼슘 마그네슘', '센트룸_우먼(국내)'], 17.6],
        [['세노비스_마그네슘', '나우푸드_데일리 비츠 (캡슐)'], 16.6],
        [['블루보넷뉴트리션_버퍼드 킬레이트 마그네슘', '센트룸_우먼(국내)'], 15.4],
        [['세노비스_마그네슘', '솔가_프리네이탈 종합비타민&미네랄'], 13.900000000000002],
        [['나우푸드_데일리 비츠 (캡슐)', '21세기센트리_마그네슘 250mg'], 13.6],
        [['쏜리서치_칼슘 마그네슘 말레이트', '나우푸드_데일리 비츠 (캡슐)'], 8.0],
        [['대웅제약_임팩타민 파워', '유사나_마그네칼D'], 6.3],
        [['대웅제약_임팩타민 파워', '네이처스웨이_얼라이브 칼슘 마그네슘 비타민D (국내)'], 6.3]
    ];

    const elements = finalResult.map(item => item[0]);

    // console.log(top3Elements);

    const uniqueItems = [...new Set(elements)]
    // console.log(uniqueItems);

    // ingredients_json에서 일치하는 값 찾기
    const matchedItems = uniqueItems.map(itemList => {
        // console.log(itemList);
        return itemList.map(item => {
            return ingredients_json.find(ingredient => ingredient.브랜드명_제품명 === item);
        }).filter(Boolean).concat(ocr_json);
    });


    console.log("matchedItems :", matchedItems)

    // const list = ['비타민E', '아연', '마그네슘']

    // // 원래 리스트에서 age만 추출해서 새로운 리스트 만들기
    // const ingredientList = matchedItems.map(itemList => {
    //     return itemList.map(item => {
    //         return { "비타민E": item.비타민E, '아연': item.아연, '마그네슘': item.마그네슘 }
    //     })
    // });

    // console.log(ingredientList);

    // 필터링 함수
    function filterDiseaseIngredientJson(data, keys) {
        return data.map(sublist =>
            sublist
                .filter(json =>
                    keys.every(key =>
                        Object.keys(json).some(k => k.includes(key))
                    )
                )
                .map(json => {
                    let filteredJson = {};
                    Object.keys(json).forEach(k => {
                        if (keys.some(key => k.includes(key) && json[k] !== null)) {
                            filteredJson[k] = json[k];
                            return sublist
                        }
                    });
                    if (Object.keys(filteredJson).length === 0) {
                        return null
                    } else {
                        return filteredJson;
                    }
                })
        );
    }

    function filterDiseaseJson(data, keys) {
        return data.filter(sublist =>
            sublist.some(json =>
                keys.some(key =>
                    Object.keys(json).some(k => k.includes(key) && json[k] !== null)
                )
            )
        );
    }

    // 여러 필드를 기준으로 필터링 (예시에서는 'value'와 'other' 필드)
    const 금지 = filterDiseaseJson(matchedItems, diseases[user['disease']]["금지"]);
    const 주의 = filterDiseaseJson(matchedItems, diseases[user['disease']]["과다 섭취 주의"]);
    const 치료제_주의 = filterDiseaseJson(matchedItems, diseases[user['disease']]["이미 치료제 복용 시 주의"]);

    console.log("금지 : ", 금지)
    console.log("주의 : ", 주의)
    console.log("치료제_주의 : ", 치료제_주의)

    const filteredElements = matchedItems.filter(element => {
        return !금지.some(item => JSON.stringify(item) === JSON.stringify(element));
    });
    console.log("filteredElements :", filteredElements);

    const top3Elements = filteredElements.slice(0, 3);
    console.log("top3Elements : ", top3Elements)

    const 금지_성분 = filterDiseaseIngredientJson(top3Elements, diseases[user['disease']]["금지"]);
    const 주의_성분 = filterDiseaseIngredientJson(top3Elements, diseases[user['disease']]["과다 섭취 주의"]);
    const 치료제_주의_성분 = filterDiseaseIngredientJson(top3Elements, diseases[user['disease']]["이미 치료제 복용 시 주의"]);

    console.log(금지_성분);
    console.log(주의_성분);
    console.log(치료제_주의_성분);

    function filterJson(data) {
        return data.map(sublist =>
            sublist
                .map(json => {
                    let filteredJson = {};
                    Object.keys(json).forEach(k => {
                        if (json[k] !== null) {
                            filteredJson[k] = json[k];
                            return sublist
                        }
                    });
                    return filteredJson;
                })
        );
    }

    const filteredTop3 = filterJson(top3Elements)

    console.log("filteredTop3 :", filteredTop3)


    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.header} onPress={() => setCurrentScreen('Home')}>
                <Text style={styles.headerText}>뒤로 가기</Text>
            </TouchableOpacity>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Text style={styles.title}>{'\n'}{'\n'}✨최종 조합 결과입니다!✨</Text>
                <Text style={styles.description}>
                    최종 조합은 개개인의 성별, 연령에 따른 필요량만큼 {'\n'}
                    건강고민별 필수 영양소를 포함하고 {'\n'}
                    영양소 과다 섭취를 막기 위해 {'\n'}
                    개개인의 성별, 연령에 따른 영양소별 상한 값을 넘기지 않으며 {'\n'}
                    나와 비슷한 건강 고민, 원하는 효능 정보를 가진 유저들의 구매 패턴, {'\n'}
                    유저가 원하는 영양제 취향을 고려한 조합 결과입니다
                </Text>
                <View style={styles.combinationsContainer}>
                    {
                        filteredTop3.map((comb, combIndex) => (
                            <View key={combIndex} style={styles.combination}>
                                <Text style={styles.combinationTitle}>
                                    {combIndex == 0 ? '🥇' : combIndex == 1 ? '🥈' : '🥉'}
                                    {combIndex + 1}순위 조합</Text>
                                {comb.map((element, elementIndex) => (
                                    <Text key={elementIndex} style={styles.elementText}>{element["브랜드명_제품명"]}</Text>
                                ))}
                                <Text style={styles.text}>{'\n'}❗ 유저의 유의 질환 정보를 고려한 복용 시 주의 사항입니다 ❗{'\n'} </Text>
                                {
                                    주의_성분[combIndex].map((ingred, ingredIndex) => {
                                        if (ingred) {
                                            const key = Object.keys(ingred)[0]; // 객체의 첫 번째 키를 가져옴
                                            return (
                                                <Text key={`${combIndex}-${ingredIndex}`} style={styles.text}>
                                                    {key}를 포함하고 있는 {comb[ingredIndex]["브랜드명_제품명"]}
                                                </Text>
                                            );
                                        }
                                        return null;
                                    })
                                }
                                <Text style={styles.text}>영양제를 복용 시 주의하세요!{'\n'}</Text>
                                <Text style={styles.text}>{'\n'} 특히 관련 치료제를 복용 중이실 시에는 </Text>
                                {
                                    치료제_주의_성분[combIndex].map((ingred, ingredIndex) => {
                                        if (ingred) {
                                            const key = Object.keys(ingred)[0]; // 객체의 첫 번째 키를 가져옴
                                            return (
                                                <Text key={`${combIndex}-${ingredIndex}`} style={styles.text}>
                                                    {key}를 포함하고 있는 {comb[ingredIndex]["브랜드명_제품명"]}
                                                </Text>
                                            );
                                        }
                                        return null;
                                    })
                                }
                                <Text style={styles.text}>영양제를 복용 시 주의하세요!{'\n'}</Text>
                            </View>
                        ))
                    }
                </View>
            </ScrollView>
        </View>
    )
};

const styles = StyleSheet.create({
    header: {
        borderColor: '#82FFF2',
        borderBottomWidth: 3,
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    headerText: {
        color: '#08222D',
        fontSize: 15,
    },
    container: {
        flex: 1,
        marginTop: 20,
        padding: 20
    },
    scrollContainer: {
        alignItems: 'center'
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center'
    },
    description: {
        fontSize: 12,
        textAlign: 'center',
        marginBottom: 20
    },
    combinationsContainer: {
        width: '100%',
        alignItems: 'center'
    },
    combination: {
        marginBottom: 20,
        width: '100%',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#03ffe5',
        borderRadius: 10,
        padding: 10,
        marginHorizontal: 20,
    },
    combinationTitle: {
        fontSize: 15,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center'
    },
    elementText: {
        fontSize: 14,
        textAlign: 'center'
    },
    text: {
        fontSize: 12,
        textAlign: 'center'
    }
});

export default UltimateResultScreen;