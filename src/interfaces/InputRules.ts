export interface InputRules {
  form: "password" | "username";
  lengthCheck: boolean;
  patternCheck: boolean;
  uniqueCheck?: boolean;
}
