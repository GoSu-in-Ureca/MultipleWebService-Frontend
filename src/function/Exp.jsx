import { db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

// 경험치 구간 정의 (레벨 1~7)
const LEVEL_EXP_REQUIREMENTS = [0, 10, 20, 40, 80, 160, 320];

// 경험치 증가 및 레벨 업 함수
export const increaseExpAndLevel = async (userId, expGain) => {
  try {
    const userRef = doc(db, "users", userId); // Firestore의 사용자 문서 참조
    const userSnapshot = await getDoc(userRef);

    if (userSnapshot.exists()) {
      const userData = userSnapshot.data();
      let { user_exp, user_level } = userData;

      // 전달받은 경험치 증가량만큼 증가
      user_exp += expGain;

      // 레벨 업 체크
      while (user_level < LEVEL_EXP_REQUIREMENTS.length - 1 && user_exp >= LEVEL_EXP_REQUIREMENTS[user_level]) {
        user_level += 1; // 레벨 증가
      }

      // Firestore에 경험치와 레벨 업데이트
      await updateDoc(userRef, {
        user_exp: user_exp,
        user_level: user_level,
      });

    }
  } catch (error) {
    console.error("경험치 및 레벨 업데이트 중 오류 발생:", error);
  }
};
