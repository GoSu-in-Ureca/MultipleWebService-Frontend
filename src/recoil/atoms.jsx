import { atom } from 'recoil';

// 선택된 카테고리 상태 관리
export const selectedCategoryState = atom({
  key: 'selectedCategoryState',
  default: '전체',
});
