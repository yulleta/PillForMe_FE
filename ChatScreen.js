import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, LogBox, ActivityIndicator } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';

// 모든 경고 메시지 무시
LogBox.ignoreAllLogs(true);

// 효능 정보 및 영양제 특성 정보
const efficacy = {
    "간건강": ["피로 개선", "감기 덜 걸림", "숙취 감소", "구내염 개선"],
    "갑상선건강": ["피로 개선", "감기 덜 걸림", "스트레스 감소", "수면질 개선"],
    "관절건강": ["관절염 완화", "근육통 완화", "붓기 개선", "골밀도 증가"],
    "남성건강_전립선건강": ["감기 덜 걸림", "발기부전 개선", "정액량 증가", "피부염 감소"],
    "남성건강_정자운동성향상": ["운동 능력 증가", "피로 개선", "근육통 완화", "수면질 개선"],
    "노화&향산화": ["감기 덜 걸림", "얼굴색 좋아짐", "수면질 개선", "구내염 개선"],
    "눈건강_눈피로감개선": ["눈 피로감 개선", "안구건조증 개선", "피로 개선", "수면질 개선"],
    "눈건강_안구건조개선": ["피로 개선", "눈 피로감 개선", "감기 덜 걸림", "스트레스 감소"],
    "눈건강_야맹증개선": ["피로 개선", "감기 덜 걸림", "눈 피로감 개선", "스트레스 감소"],
    "눈건강_황반색소유지": ["눈 피로감 개선", "안구건조증 개선", "시력 개선", "야맹증 개선"],
    "두뇌활동": ["피로 개선", "콜레스테롤 수치 개선", "수면질 개선", "얼굴색 좋아짐"],
    "면역기능": ["피로 개선", "감기 덜 걸림", "구내염 개선", "수면질 개선"],
    "빈혈_혈액생성": ["피로 개선", "감기 덜 걸림", "구내염 개선", "스트레스 감소"],
    "뼈건강": ["피로 개선", "감기 덜 걸림", "눈 떨림 개선", "수면질 개선"],
    "뼈건강_칼슘흡수촉진": ["피로 개선", "감기 덜 걸림", "구내염 개선", "수면질 개선"],
    "소화&위식도건강_담즙분비촉진": ["피로 개선", "감기 덜 걸림", "구내염 개선", "근육통 완화"],
    "소화&위식도건강_소화기능보조": ["피로 개선", "숙취 감소", "간 수치 개선", "소화 개선"],
    "소화&위식도건강_위식도점막보호": ["속쓰림 완화", "소화 개선", "더부룩함 완화", "위염/위궤양 개선"],
    "소화&위식도건강_헬리코박터균억제": ["속쓰림 완화", "소화 개선", "더부룩함 완화", "복부 가스 덜 참"],
    "스트레스&수면_긴장완화": ["피로 개선", "눈 떨림 개선", "수면질 개선", "근육통 완화"],
    "스트레스&수면_수면질개선": ["피로 개선", "감기 덜 걸림", "구내염 개선", "수면질 개선"],
    "스트레스&수면_우울감개선": ["피로 개선", "콜레스테롤 수치 개선", "수면질 개선", "눈 피로감 개선"],
    "여성갱년기": ["혈압 수치 개선", "수면질 개선", "얼굴색 좋아짐", "피부결 개선"],
    "여성건강_생리전증후군&생리통개선": ["피로 개선", "눈 떨림 개선", "수면질 개선", "근육통 완화"],
    "여성건강_요로건강개선": ["방광염 덜 걸림", "방광염 증상 완화", "질염 발생 빈도 감소", "PMS 개선"],
    "여성건강_질염개선": ["질염 발생 빈도 감소", "변비 개선", "복부 가스 덜 참", "아랫배 통증 완화"],
    "운동능력&근육량_근육량증가": ["근육량 증가", "운동 능력 증가", "피로 개선", "식욕 감소"],
    "운동능력&근육량_운동능력개선": ["운동 능력 증가", "피로 개선", "근육통 완화", "근육량 증가"],
    "임산부&태아건강": ["피로 개선", "변비 개선", "복부 가스 덜 참", "감기 덜 걸림"],
    "장건강_배변활동": ["변비 개선", "복부 가스 덜 참", "설사 빈도 감소", "아랫배 통증 완화"],
    "장건강_유익균유해균균형도움": ["변비 개선", "복부 가스 덜 참", "설사 빈도 감소", "아랫배 통증 완화"],
    "체지방_지방대사촉진": ["체지방 감소", "체중 감소", "식욕 감소", "붓기 개선"],
    "체지방_지방흡수억제": ["피로 개선", "콜레스테롤 수치 개선", "혈당 수치 개선", "체지방 감소"],
    "체지방_탄수화물지방전환억제": ["변비 개선", "식욕 감소", "복부 가스 덜 참", "체중 감소"],
    "치아&잇몸_치아건강": ["피로 개선", "감기 덜 걸림", "눈 떨림 개선", "수면질 개선"],
    "치아잇몸&잇몸건강": ["감기 덜 걸림", "피로 개선", "구내염 개선", "수면질 개선"],
    "탈모&손톱건강": ["탈모 개선", "모발 끊어짐 개선", "손톱 강화", "건조한 모발 개선"],
    "피로감": ["피로 개선", "감기 덜 걸림", "구내염 개선", "수면질 개선"],
    "피부건강_면역과민피부개선": ["생리전증후군(PMS) 개선", "생리통 완화", "변비 개선", "뾰루지 감소"],
    "피부건강_피부보습유지": ["피부 보습력 증가", "피부 탄력 개선", "뾰루지 감소", "피부 잡티 개선"],
    "피부건강_피부손상보호": ["피로 개선", "감기 덜 걸림", "스트레스 감소", "수면질 개선"],
    "피부건강_피부재생": ["피로 개선", "감기 덜 걸림", "구내염 개선", "스트레스 감소"],
    "혈관혈액순환_혈액순환개선": ["피로 개선", "콜레스테롤 수치 개선", "수면질 개선", "눈 피로감 개선"],
    "혈관혈액순환_호모시스테인균형": ["피로 개선", "감기 덜 걸림", "구내염 개선", "스트레스 감소"],
    "혈당_소화속도조절": ["아랫배 통증 완화", "변비 개선", "체중 감소", "설사 빈도 감소"],
    "혈당_인슐린작용개선": ["피로 개선", "감기 덜 걸림", "스트레스 감소", "수면질 개선"],
    "혈압_체액농도밸런스개선": ["피로 개선", "붓기 개선", "감기 덜 걸림", "근육통 완화"],
    "혈압_혈관내부압력조절": ["콜레스테롤 수치 개선", "혈압 수치 개선", "피로 개선", "LDL 수치 개선"],
    "혈압_혈압호르몬조절": ["피로 개선", "혈압 수치 개선", "수면질 개선", "얼굴색 좋아짐"],
    "혈중중성지방_중성지방재흡수억제": ["아랫배 통증 완화", "변비 개선", "체중 감소", "설사 빈도 감소"],
    "혈중중성지방_중성지방합성억제": ["피로 개선", "콜레스테롤 수치 개선", "눈 피로감 개선", "수면질 개선"],
    "혈중콜레스테롤_콜레스테롤합성조절": ["콜레스테롤 수치 개선", "피로 개선", "생리전증후군(PMS) 개선", "생리통 완화"],
    "혈중콜레스테롤_콜레스테롤흡수억제": ["변비 개선", "복부 가스 덜 참", "피로 개선", "콜레스테롤 수치 개선"],
    "호흡기건강": ["피로 개선", "감기 덜 걸림", "구내염 개선", "수면질 개선"]
}


const splitArrayIntoChunks = (array, chunkSize) => {
    let result = [];
    for (let i = 0; i < array.length; i += chunkSize) {
        result.push(array.slice(i, i + chunkSize));
    }
    return result;
};

const random = {
    sample: (array, num) => {
        const shuffled = array.slice();
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled.slice(0, num);
    }
};

const playMatch = (player1, player2) => {
    // 이 함수는 임의로 승자를 결정합니다. 실제 구현에서는 원하는 로직을 사용할 수 있습니다.
    return Math.random() > 0.5 ? player1 : player2;
};

const ChatScreen = ({ setCurrentScreen, finalResult, setFinalResult, goods, bads, allHealth, gaOutput }) => {

    const goodss = [...goods];
    const badss = [...bads];

    const all_health = allHealth

    const initialMessages = [
        {
            _id: 1, // 고유한 메시지 ID
            text: '다음 선택지들 중에 원하는 효능 정보를 골라주세요!', // 메시지 텍스트
            createdAt: new Date(), // 메시지 생성 시간
            user: {
                _id: 2, // 시스템 또는 봇의 사용자 ID
                name: 'Chatbot', // 사용자 이름 또는 별명
                avatar: require('./assets/img/pilly.png'), // 사용자 아바타 URL (선택적)
            },
        },
    ];

    const handleSend = (newMessages = []) => {
        setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages));
        if (giftedChatRef.current) {
            giftedChatRef.current.scrollToBottom(); // 메시지 전송 시 스크롤 다운
        }
    };

    const [messages, setMessages] = useState(initialMessages);
    const giftedChatRef = useRef(null); // 참조 생성
    const [healthChunks, setHealthChunks] = useState([]);

    const [selectedHealth, setSelectedHealth] = useState([]);
    const [selectedGoods, setSelectedGoods] = useState([]);
    const [selectedBads, setSelectedBads] = useState([]);

    const [currentStep, setCurrentStep] = useState(0);
    const [efficacyDone, setEfficacyDone] = useState(false);
    const [goodsDone, setGoodsDone] = useState(false);
    const [goodsTDone, setGoodsTDone] = useState(false);
    const [badsDone, setBadsDone] = useState(false);
    const [badsTDone, setBadsTDone] = useState(false);

    const [tournament, setTournament] = useState({ matches: [], currentMatch: 0 });

    const [glRecResult, setGLRecResult] = useState([])
    const [isGlRecDone, setGLRecDone] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const selectedEfficacy = new Set();

        all_health && all_health.forEach(health => {
            if (efficacy[health]) {
                efficacy[health].forEach(effect => selectedEfficacy.add(effect));
            }
        });

        const selectedEfficacyList = Array.from(selectedEfficacy);
        const chunks = splitArrayIntoChunks(selectedEfficacyList, 5);
        setHealthChunks(chunks);
    }, []);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch('http://127.0.0.1:5000/final_result', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ glRecResult: glRecResult, selectedGoods: selectedGoods, selectedBads: selectedBads, gaOutput: gaOutput })
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                setFinalResult(data["final_result"]);
                setIsLoading(false);
            } catch (error) {
                console.error('Error:', error);
            }
        }
        if (isGlRecDone & badsTDone) {
            fetchData()
        }
    }, [isGlRecDone, badsTDone]);

    useEffect(() => {
        async function fetchData() {
            if (efficacyDone && !isGlRecDone) {
                try {
                    const response = await fetch('http://127.0.0.1:5000/glrec_result', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ efficacy: selectedHealth, gaOutput: gaOutput })  // 필요한 데이터를 여기에 추가
                    });

                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }

                    const data = await response.json();
                    // console.log(data);  // 서버로부터 받은 데이터를 처리

                    setGLRecResult(data["glrec_result"]);
                    setGLRecDone(true);
                } catch (error) {
                    console.error('Error:', error);
                    // setIsLoading(false);
                }
            }
        }
        fetchData();
    }, [efficacyDone, glRecResult]);

    // console.log("glRecResult : ", glRecResult);
    // console.log("loading", isLoading)
    // console.log("glRecDone", isGlRecDone)
    // console.log("badsTDone", badsTDone)

    useEffect(() => { setMessages(messages) }, [messages])

    useEffect(() => {
        if (!efficacyDone && currentStep !== 0 && currentStep === healthChunks.length) {
            // 모든 효능 정보를 선택한 후
            setMessages((prevMessages) => [
                ...prevMessages,
                {
                    _id: prevMessages.length + 1,
                    text: `선택한 효능 정보들: ${selectedHealth.join(', ')}`,
                    createdAt: new Date(),
                    user: { _id: 2, name: 'Chatbot', avatar: require('./assets/img/pilly.png') },
                },
                {
                    _id: prevMessages.length + 1,
                    text: '다음 선택지들 중에서 더 선호하는 영양제 특성을 골라주세요!',
                    createdAt: new Date(),
                    user: { _id: 2, name: 'Chatbot', avatar: require('./assets/img/pilly.png') },
                },
            ]);
            setCurrentStep(0);
            setEfficacyDone(true);
        }
        else if (!goodsDone && currentStep !== 0 && currentStep === 6) {
            setCurrentStep(0);
            startTournament(selectedGoods);
            setGoodsDone(true)
        } else if (goodsDone && !goodsTDone && currentStep === 7) {
            setCurrentStep(0);
            setGoodsTDone(true);
        } else if (goodsDone && goodsTDone && !badsDone && currentStep !== 0 && currentStep === 6) {
            setCurrentStep(0);
            startTournament(selectedBads);
            setBadsDone(true);
        } else if (goodsDone && goodsTDone && badsDone && !badsTDone && currentStep === 7) {
            setCurrentStep(0);
            setBadsTDone(true);
            setIsLoading(true);
        }
    }, [currentStep]);

    // console.log("goodsDone : ", goodsDone)
    // console.log("goodsTDone : ", goodsTDone);
    // console.log("badsDone : ", badsDone)
    // console.log("badsTDone : ", badsTDone);
    // console.log("currentStep: ", currentStep);
    // console.log("currentRound: ", tournament.currentRound)
    // console.log(messages)


    const handleHealthSelection = (health) => {
        setSelectedHealth([...selectedHealth, health]);
        if (currentStep < healthChunks.length) {
            setCurrentStep(currentStep + 1);
            setMessages((prevMessages) => [
                ...prevMessages,
                {
                    _id: prevMessages.length + 1,
                    text: `선택한 효능 정보: \n ${health}`,
                    createdAt: new Date(),
                    user: { _id: 1 },
                },
            ]);
        }
    };

    const handleGoodsSelection = (good) => {
        setSelectedGoods([...selectedGoods, good]);
        if (currentStep < goodss.length) {
            setCurrentStep(currentStep + 1);
            setMessages((prevMessages) => [
                ...prevMessages,
                {
                    _id: prevMessages.length + 1,
                    text: `선택한 긍정 특성 정보: \n ${good}`,
                    createdAt: new Date(),
                    user: { _id: 1 },
                },
            ]);
        }
    };

    const handleBadsSelection = (bad) => {
        setSelectedBads([...selectedBads, bad]);
        if (currentStep < bads.length) {
            setCurrentStep(currentStep + 1);
            setMessages((prevMessages) => [
                ...prevMessages,
                {
                    _id: prevMessages.length + 1,
                    text: `선택한 부정 특성 정보: \n ${bad}`,
                    createdAt: new Date(),
                    user: { _id: 1 },
                },
            ]);
        }
    };

    const startTournament = (players) => {
        const selectedPlayers = random.sample(players, 2);

        players = players.filter(player => !selectedPlayers.includes(player));
        const round1 = random.sample(players, 2);
        players = players.filter(player => !round1.includes(player));

        // 초기 상태 설정
        setTournament({
            matches: [{ players: round1 }, { players }],
            currentMatch: 0,
            results: {},
            selectedPlayers,
            roundWinners: [],
            round1Losers: [],
            round2Losers: [],
            currentRound: 1,
        });
    };


    const renderHealthOptions = () => {
        if (currentStep >= healthChunks.length) return null;
        return (
            <View style={styles.optionsContainer}>
                {healthChunks[currentStep].map((health, index) => (
                    <TouchableOpacity key={Math.random()} style={styles.optionButton} onPress={() => handleHealthSelection(health)}>
                        <Text style={styles.optionText}>{health}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        );
    };

    // console.log("goods: ", goodss);
    // console.log("bads : ", badss)

    const renderGoodsOptions = () => {
        if (currentStep >= goodss.length) return null;
        return (
            <View style={styles.optionsContainer}>
                {goodss[currentStep].map((good, index) => (
                    <TouchableOpacity key={Math.random()} style={styles.optionButton} onPress={() => handleGoodsSelection(good)}>
                        <Text style={styles.optionText}>{good}</Text>
                    </TouchableOpacity>
                ))
                }
            </View >
        );
    };

    const renderBadsOptions = () => {
        if (currentStep >= badss.length) return null;
        return (
            <View style={styles.optionsContainer}>
                {badss[currentStep].map((bad, index) => (
                    <TouchableOpacity key={Math.random()} style={styles.optionButton} onPress={() => handleBadsSelection(bad)}>
                        <Text style={styles.optionText}>{bad}</Text>
                    </TouchableOpacity>
                ))
                }
            </View >
        );
    };

    const handleTournamentSelection = (player) => {
        const { matches, currentMatch, results, selectedPlayers, roundWinners, round1Losers, round2Losers, currentRound } = tournament;

        const updateState = (newWinners, newLosers, newRound, newMatches) => {
            setTournament({
                ...tournament,
                roundWinners: newWinners,
                round1Losers: currentRound === 1 ? newLosers : round1Losers,
                round2Losers: currentRound === 2 ? newLosers : round2Losers,
                currentRound: newRound,
                matches: newMatches,
                currentMatch: 0,
            });
        };

        if (currentRound === 1) {
            const newWinners = [...roundWinners, player];
            const loser = matches[currentMatch].players.find(p => p !== player);
            const newLosers = [...round1Losers, loser];

            if (newWinners.length === 2) {
                updateState(newWinners, newLosers, 2, [
                    { players: [newWinners[0], selectedPlayers[0]] },
                    { players: [newWinners[1], selectedPlayers[1]] }
                ]);
            } else {
                setTournament({
                    ...tournament,
                    roundWinners: newWinners,
                    round1Losers: newLosers,
                    currentMatch: currentMatch + 1,
                });
            }
            setCurrentStep(currentStep + 1);
            setMessages((prevMessages) => [
                ...prevMessages,
                {
                    _id: prevMessages.length + 1,
                    text: !goodsTDone ? `선택한 긍정 특성 정보: \n ${player}` : `선택한 부정 특성 정보: \n ${player}`,
                    createdAt: new Date(),
                    user: { _id: 1 },
                },
            ]);
        } else if (currentRound === 2) {
            const newWinners = [...roundWinners, player];
            const loser = matches[currentMatch].players.find(p => p !== player);
            const newLosers = [...round2Losers, loser];

            if (newWinners.length === 4) {
                updateState(newWinners, newLosers, 3, [
                    { players: [newWinners[2], newWinners[3]] },
                    { players: [newLosers[0], newLosers[1]] }
                ]);
            } else {
                setTournament({
                    ...tournament,
                    roundWinners: newWinners,
                    round2Losers: newLosers,
                    currentMatch: currentMatch + 1,
                });
            }
            setCurrentStep(currentStep + 1);
            setMessages((prevMessages) => [
                ...prevMessages,
                {
                    _id: prevMessages.length + 1,
                    text: !goodsTDone ? `선택한 긍정 특성 정보: \n ${player}` : `선택한 부정 특성 정보: \n ${player}`,
                    createdAt: new Date(),
                    user: { _id: 1 },
                },
            ]);
        } else if (currentRound === 3) {
            const newWinners = [...roundWinners, player];
            const loser = matches[currentMatch].players.find(p => p !== player);

            if (matches[0].players.includes(player)) {
                setTournament({
                    ...tournament,
                    results: {
                        ...results,
                        final_winner: player,
                        final_loser: loser,
                    },
                    currentRound: 4,
                    matches: [{ players: [round2Losers[0], round2Losers[1]] }],
                    currentMatch: 0,
                });
            } else {
                setTournament({
                    ...tournament,
                    results: {
                        ...results,
                        third_place_match: player,
                        fourth_place: loser,
                    },
                    currentRound: 4,
                    matches: [{ players: [round2Losers[0], round2Losers[1]] }],
                    currentMatch: 0,
                });
            }
            setCurrentStep(currentStep + 1);
            setMessages((prevMessages) => [
                ...prevMessages,
                {
                    _id: prevMessages.length + 1,
                    text: !goodsTDone ? `선택한 긍정 특성 정보: \n ${player}` : `선택한 부정 특성 정보: \n ${player}`,
                    createdAt: new Date(),
                    user: { _id: 1 },
                },
            ]);
        } else if (currentRound === 4) {
            const loser = matches[currentMatch].players.find(p => p !== player);
            if (matches[0].players.includes(player)) {
                setTournament({
                    ...tournament,
                    results: {
                        ...results,
                        third_place_match: player,
                        fourth_place: loser,
                    },
                    currentRound: 5,
                    matches: [{ players: [round1Losers[0], round1Losers[1]] }],
                    currentMatch: 0,
                });
            } else {
                setTournament({
                    ...tournament,
                    results: {
                        ...results,
                        fifth_place_match: player,
                        sixth_place: loser,
                    },
                    currentMatch: 0,
                });
            }
            setCurrentStep(currentStep + 1);
            setMessages((prevMessages) => [
                ...prevMessages,
                {
                    _id: prevMessages.length + 1,
                    text: !goodsTDone ? `선택한 긍정 특성 정보: \n ${player}` : `선택한 부정 특성 정보: \n ${player}`,
                    createdAt: new Date(),
                    user: { _id: 1 },
                },
            ]);
        } else if (currentRound === 5) {
            const loser = matches[currentMatch].players.find(p => p !== player);
            setTournament({
                ...tournament,
                results: {
                    ...results,
                    fifth_place_match: player,
                    sixth_place: loser,
                },
                currentMatch: 0,
            });

            const winners = [
                results["final_winner"],
                results["final_loser"],
                results["third_place_match"],
                results['fourth_place'],
                player,
                loser
            ];

            // console.log(winners)
            !goodsTDone ?
                setMessages((prevMessages) => [
                    ...prevMessages,
                    {
                        _id: prevMessages.length + 1,
                        text: `선택한 긍정 특성 정보: \n ${player}`,
                        createdAt: new Date(),
                        user: { _id: 1 },
                    },
                    {
                        _id: prevMessages.length + 1,
                        text: `${winners.join(', ')}순으로 영양제 특성을 선호하시는군요!`,
                        createdAt: new Date(),
                        user: { _id: 2, name: 'Chatbot', avatar: require('./assets/img/pilly.png') },
                    },
                    {
                        _id: prevMessages.length + 1,
                        text: '다음 선택지들 중에서 가장 기피하고 싶은 영양제 특성을 골라주세요!',
                        createdAt: new Date(),
                        user: { _id: 2, name: 'Chatbot', avatar: require('./assets/img/pilly.png') },
                    }
                ])
                :
                setMessages((prevMessages) => [
                    ...prevMessages,
                    {
                        _id: prevMessages.length + 1,
                        text: `선택한 부정 특성 정보: \n ${player}`,
                        createdAt: new Date(),
                        user: { _id: 1 },
                    },
                    {
                        _id: prevMessages.length + 1,
                        text: `${winners.join(', ')}순으로 영양제 특성을 선호하지 않으시는군요!`,
                        createdAt: new Date(),
                        user: { _id: 2, name: 'Chatbot', avatar: require('./assets/img/pilly.png') },
                    },
                    {
                        _id: prevMessages.length + 1,
                        text: '이제 최종 조합 결과가 나옵니다!',
                        createdAt: new Date(),
                        user: { _id: 2, name: 'Chatbot', avatar: require('./assets/img/pilly.png') },
                    }
                ]);
            setCurrentStep(currentStep + 1);
        }
    };



    const renderTournamentOptions = () => {
        const { matches, currentMatch } = tournament;
        // if (currentMatch >= matches.length) return null;
        const match = matches[currentMatch];
        return (
            <View style={styles.optionsContainer}>
                <TouchableOpacity style={styles.optionButton} onPress={() => handleTournamentSelection(match.players[0])}>
                    <Text style={styles.optionText}>{match.players[0]}</Text>
                </TouchableOpacity>
                {match.players[1] && (
                    <TouchableOpacity style={styles.optionButton} onPress={() => handleTournamentSelection(match.players[1])}>
                        <Text style={styles.optionText}>{match.players[1]}</Text>
                    </TouchableOpacity>
                )}
            </View>
        );
    };

    const renderBubble = (props) => {
        return (
            <Bubble
                {...props}
                wrapperStyle={{
                    right: {
                        // borderWidth: 1.5,
                        // borderColor: '#69FFEF',
                        backgroundColor: '#b5fff8'
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

    const renderInputToolbar = () => {
        // Return null to hide the input toolbar
        return null;
    };

    const moveToEnd = () => {
        console.log("finalResult : ", finalResult)
        setCurrentScreen('Result');
    }


    return (
        isLoading ? (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color='#69FFEF' />
                <Text style={styles.reminderText}>
                    {'\n'}{'\n'}입력해주신 정보들을 바탕으로 {'\n'}영양제 최종 조합을 구하고 있어요! {'\n'} 30초 정도만 기다려주세요!
                </Text>
            </View>
        ) : (
            <View style={{ flex: 1 }}>
                <View style={{ marginTop: 20 }}>
                    <TouchableOpacity style={styles.header} onPress={() => setCurrentScreen('Home')}>
                        <Text style={styles.headerText}>뒤로 가기</Text>
                    </TouchableOpacity>
                </View>
                <GiftedChat
                    ref={giftedChatRef} // GiftedChat에 참조 설정
                    inverted={false}
                    renderBubble={renderBubble}
                    style={{ margin: 20, backgroundColor: '#69FFEF' }}
                    renderInputToolbar={renderInputToolbar}
                    messages={messages}
                    scrollToBottom
                    onSend={handleSend}
                    user={{ _id: 1 }}
                />
                {!efficacyDone ? renderHealthOptions() :
                    !goodsDone ? renderGoodsOptions() :
                        !goodsTDone ? renderTournamentOptions() :
                            !badsDone ? renderBadsOptions()
                                : !badsTDone ? renderTournamentOptions() : !isLoading && moveToEnd()}
            </View>
        )
    );
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