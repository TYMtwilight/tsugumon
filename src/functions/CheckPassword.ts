import React from "react";

export const checkPassword = (event: React.ChangeEvent<HTMLInputElement>) => {
  const checkedResults: {
    lengthCheck: boolean;
    patternCheck: boolean;
    input: string;
  } = {
    lengthCheck: true,
    patternCheck: true,
    input: "",
  };
  // NOTE >> lengthCheckとpatternCheckの両方がtrueのとき、approvalをtrueにします
  const checkApproval = () => {
    if (checkedResults.lengthCheck && checkedResults.patternCheck) {
      checkedResults.input = event.target.value;
    } else {
      checkedResults.input = "";
    }
  };
  // NOTE >> 入力文字数をチェックします
  const length = event.target.value.length;
  if ((length > 0 && length < 8) || length > 20) {
    checkedResults.lengthCheck = false;
  } else {
    checkedResults.lengthCheck = true;
    checkApproval();
  }
  // NOTE >> 入力文字のパターンをチェックします
  const regex = /^[a-z|A-Z|0-9|_]+$/;
  if (length === 0) {
    checkedResults.patternCheck = true;
  } else {
    checkedResults.patternCheck = regex.test(event.target.value);
    checkApproval();
  }
  return checkedResults;
};
