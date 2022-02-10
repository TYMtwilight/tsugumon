import React from "react";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import UserAuthentication from "./UserAuthentication";

afterEach(() => {
  cleanup();
});

describe("Rendering", () => {
  it("全ての要素が正しくレンダリングされているか確認します", () => {
    render(<UserAuthentication />);
    expect(screen.getByTestId("LockIcon")).toBeTruthy();
    expect(screen.getByTestId("title")).toBeTruthy();
    expect(screen.getByRole("form")).toBeTruthy();
    expect(screen.getByText("メールアドレス")).toBeTruthy();
    expect(screen.getByRole("textbox")).toBeTruthy();
    expect(screen.getByTestId("error1")).toBeTruthy();
    expect(screen.getByTestId("error2")).toBeTruthy();
    expect(screen.getByText("パスワード")).toBeTruthy();
    expect(screen.getByTestId("password")).toBeTruthy();
    expect(screen.getAllByRole("button")[0]).toBeTruthy();
    expect(screen.getByTestId("VisibilityOffIcon")).toBeTruthy();
    expect(screen.queryByTestId("VisibilityOnIcon")).toBeNull();
    expect(screen.getByTestId("error3")).toBeTruthy();
    expect(screen.getByTestId("error4")).toBeTruthy();
    expect(screen.getByTestId("loginButton")).toBeTruthy();
    expect(screen.getByText("アカウントをお持ちではないですか？")).toBeTruthy();
    expect(screen.getAllByRole("button")[1]).toBeTruthy();
  });
});

describe("Input form onChange Event", () => {
  it("inputの値が適正にアップデートされているか検証します", () => {
    render(<UserAuthentication />);
    const inputEmail: HTMLInputElement = screen.getByRole("textbox");
    userEvent.type(inputEmail, "test@tsugumon.com");
    expect(inputEmail.value).toBe("test@tsugumon.com");

    const inputPassword: HTMLInputElement = screen.getByTestId("password");
    userEvent.type(inputPassword, "tsugumonPassword");
    expect(inputPassword.value).toBe("tsugumonPassword");
  });
});

describe("Icon Switch properly", () => {
  it("VisibilityOffIconをクリックしたらVisibilityOnIconに切り替わるか検証します", () => {
    render(<UserAuthentication />);
    userEvent.click(screen.getByTestId("VisibilityOffIcon"));
    expect(screen.queryByTestId("VisibilityOffIcon")).toBeNull();
    expect(screen.getByTestId("VisibilityIcon")).toBeTruthy();
  });
});

// FIX >> 以下のテストコードを実行すると、failedになります。login()が１回呼ばれることを期待しているのですが、
//        実際は０回しか呼ばれていません。

// describe("Should trigger login function propery", () => {
//   it("メールアドレスとパスワードの両方が入力されている場合、login()が実行されるか検証します", async() => {
//     const login = jest.fn();
//     render(<UserAuthentication />);
//     const inputEmail: HTMLInputElement = screen.getByRole("textbox");
//     await userEvent.type(inputEmail, "test@tsugumon.com");
//     expect(inputEmail.value).toBe("test@tsugumon.com");
//     const inputPassword: HTMLInputElement = screen.getByTestId("password");
//     await userEvent.type(inputPassword, "tsugumonPassword");
//     expect(inputPassword.value).toBe("tsugumonPassword");
//     userEvent.click(screen.getByTestId("loginButton"));
//     expect(login).toHaveBeenCalledTimes(1);
//   });
// });
