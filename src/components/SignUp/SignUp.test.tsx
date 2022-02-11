import React, { MouseEventHandler } from "react";
import { render, screen, cleanup } from "@testing-library/react";
import SignUp from "./SignUp";
import { store } from "../../app/store";
import { Provider } from "react-redux";

afterEach(() => {
  cleanup();
});

describe("rendering", () => {
  it("SignUpの各要素が適正にレンダリングされているか検証します", () => {
    const backToLogin: MouseEventHandler<HTMLButtonElement> | undefined =
      jest.fn();
    render(
      <Provider store={store}>
        <SignUp backToLogin={backToLogin} />
      </Provider>
    );
    expect(screen.getByRole("img")).toBeTruthy();
    expect(screen.getByTestId("labelForAvatar")).toBeTruthy();
    expect(screen.getByTestId("AddAPhotoIcon")).toBeTruthy();
    expect(screen.getByTestId("selectAvatarImage")).toBeTruthy();
    expect(screen.getAllByRole("button")[0]).toBeTruthy();
    expect(screen.getByText("ユーザー登録")).toBeTruthy();
    expect(screen.getByRole("form")).toBeTruthy();
    expect(screen.getByText("会社名・個人名")).toBeTruthy();
    expect(screen.getAllByRole("textbox")[0]).toBeTruthy();
    expect(screen.getByText("メールアドレス")).toBeTruthy();
    expect(screen.getAllByRole("textbox")[1]).toBeTruthy();
    expect(screen.getByTestId("error1")).toBeTruthy();
    expect(screen.getByTestId("error2")).toBeTruthy();
    expect(screen.getByText("パスワード")).toBeTruthy();
    expect(screen.getByTestId("password")).toBeTruthy();
    expect(screen.getByTestId("showPasswordButton")).toBeTruthy();
    expect(screen.getByTestId("VisibilityOffIcon")).toBeTruthy();
    expect(
      screen.getByText(
        "パスワードは8文字以上20文字以下の文字数で設定してください。"
      )
    ).toBeTruthy();
    expect(
      screen.getByText(
        "パスワードに入力できる文字は英語大文字、英語小文字、数字の3種類です。"
      )
    ).toBeTruthy();
    expect(screen.getByTestId("error3")).toBeTruthy();
    expect(screen.getByTestId("error4")).toBeTruthy();
    expect(screen.getByTestId("signUpButton")).toBeTruthy();
    expect(screen.getAllByRole("button")[1]).toBeTruthy();
  });
});
