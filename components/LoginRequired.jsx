// import { useEffect } from "react";
import { useRecoilValue } from "recoil";
import UserDetail from "./middlewares/UserDetail";
import { UserState } from "./RecoilState";

const LoginRequired = (props) => {
  const user = useRecoilValue(UserState);

  if (user) {
    return <UserDetail>{props.children}</UserDetail>;
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
