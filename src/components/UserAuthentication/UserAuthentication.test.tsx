import React from "react";
import { render, screen } from "@testing-library/react";
import UserAuthentication from "./UserAuthentication";

describe("Rendering", () => {
  it("全ての要素が正しくレンダリングされているか確認します", () => {
    render(<UserAuthentication />);
    expect(screen.getByTestId("LockIcon")).toBeTruthy();
    expect(screen.getByTestId("title")).toBeTruthy();
    expect(screen.getByRole("form")).toBeTruthy();
    expect(screen.getByText("メールアドレス")).toBeTruthy();
    expect(screen.getAllByRole("textbox")[0]).toBeTruthy();
    expect(screen.getByTestId("error1")).toBeTruthy();
    expect(screen.getByTestId("error2")).toBeTruthy();
    expect(screen.getByText("パスワード")).toBeTruthy();
    expect(screen.getByTestId("password")).toBeTruthy();
    expect(screen.getAllByRole("button")[0]).toBeTruthy();
    expect(screen.getByTestId("VisibilityOffIcon")).toBeTruthy();
    expect(screen.queryByTestId("VisibilityOnIcon")).toBeNull();
    expect(screen.getByTestId("error3")).toBeTruthy();
    expect(screen.getByTestId("error4")).toBeTruthy();
    expect(screen.getByTestId("login_button")).toBeTruthy();
    expect(screen.getByText("アカウントをお持ちではないですか？")).toBeTruthy();
    expect(screen.getAllByRole("button")[1]).toBeTruthy();
  });
});
