import functions from 'firebase-functions';
import admin from 'firebase-admin';
import axios from 'axios';

// Firebase Admin SDK 초기화
admin.initializeApp();

export const createCustomToken = functions.https.onRequest(async (req, res) => {
  const kakaoAccessToken = req.body.token;

  try {
    const kakaoUser = await axios.get('https://kapi.kakao.com/v2/user/me', {
      headers: {
        Authorization: `Bearer ${kakaoAccessToken}`,
      },
    });

    const uid = `kakao:${kakaoUser.data.id}`;
    const customToken = await admin.auth().createCustomToken(uid);

    res.status(200).json({ token: customToken });
  } catch (error) {
    console.error('Error creating custom token:', error);
    res.status(500).send('Internal Server Error');
  }
});
