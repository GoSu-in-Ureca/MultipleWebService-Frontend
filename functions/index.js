import functions from 'firebase-functions';
import admin from 'firebase-admin';
import axios from 'axios';
import cors from 'cors';

// Firebase Admin SDK 초기화
admin.initializeApp();

// CORS 미들웨어 설정
const corsHandler = cors({ origin: true });

export const createCustomToken = functions.region('asia-northeast3').https.onRequest((req, res) => {
  // CORS 미들웨어 처리
  corsHandler(req, res, async () => {
    if (req.method === 'OPTIONS') {
      res.set('Access-Control-Allow-Origin', '*');
      res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      res.set('Access-Control-Allow-Headers', 'Content-Type');
      res.set('Access-Control-Max-Age', '3600');
      return res.status(204).send('');  // Preflight 요청 성공 처리
    }

    if (req.method !== 'POST') {
      return res.status(405).send('Method Not Allowed');
    }

    const kakaoAuthCode = req.body.code;

    if (!kakaoAuthCode) {
      return res.status(400).send('Bad Request: Missing "code" in request body');
    }

    try {
      const clientid = functions.config().kakao.client_id;
      const redirect = functions.config().kakao.redirect_uri;

      // Kakao 인증 코드로 Access Token 요청
      const tokenResponse = await axios.post('https://kauth.kakao.com/oauth/token', null, {
        params: {
          grant_type: 'authorization_code',
          client_id: clientid,
          redirect_uri: redirect,
          code: kakaoAuthCode,
        },
      });

      const kakaoAccessToken = tokenResponse.data.access_token;

      // Kakao 사용자 정보 가져오기
      const kakaoUser = await axios.get('https://kapi.kakao.com/v2/user/me', {
        headers: {
          Authorization: `Bearer ${kakaoAccessToken}`,
        },
      });

      const uid = `kakao:${kakaoUser.data.id}`;
      const customToken = await admin.auth().createCustomToken(uid);

      // 클라이언트로 Custom Token 반환
      res.set('Access-Control-Allow-Origin', '*');  // 모든 도메인 허용
      return res.status(200).json({ token: customToken });
    } catch (error) {
      console.error('Error creating custom token:', error);
      res.set('Access-Control-Allow-Origin', '*');  // 모든 도메인 허용
      return res.status(500).send('Internal Server Error');
    }
  });
});
