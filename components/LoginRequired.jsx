import { useEffect } from "react";
import { useRecoilValue } from "recoil";
import { UserState } from "./RecoilState";

const LoginRequired = (props) => {
  const user = useRecoilValue(UserState);

  if (user) {
    return props.children;
  } else if (user == false) {
    return (
      <>
        <p>Login page</p>
      </>
    );
  } else {
    return "loading";
  }
};

export default LoginRequired;
