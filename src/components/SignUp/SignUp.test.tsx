import React, { MouseEventHandler } from "react";
import { render, cleanup } from "@testing-library/react";
import { screen } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
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

describe("Input form onChange Event", () => {
  it("inputの値が適正にアップデートされているか検証します", () => {
    const backToLogin: MouseEventHandler<HTMLButtonElement> | undefined =
      jest.fn();
    render(
      <Provider store={store}>
        <SignUp backToLogin={backToLogin} />
      </Provider>
    );

    const inputDisplayName: any = screen.getAllByRole("textbox")[0];
    userEvent.type(inputDisplayName, "testUser");
    expect(inputDisplayName.value).toBe("testUser");

    const inputEmail: any = screen.getAllByRole("textbox")[1];
    userEvent.type(inputEmail, "test@tsugumon.com");
    expect(inputEmail.value).toBe("test@tsugumon.com");

    const inputPassword: any = screen.getByTestId("password");
    userEvent.type(inputPassword, "tsugumonPassword");
    expect(inputPassword.value).toBe("tsugumonPassword");
  });
});
