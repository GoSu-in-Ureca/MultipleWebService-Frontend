import { atom } from 'recoil';

// 새로운 사용자의 초기 설정
// export const newUserState = atom({
  
// });

// 선택된 카테고리 상태 관리
export const selectedCategoryState = atom({
  key: 'selectedCategoryState',
  default: '전체',
});
