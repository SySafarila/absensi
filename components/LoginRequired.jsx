// import { useEffect } from "react";
import { useRecoilValue } from "recoil";
import UserDetail from "./middlewares/UserDetail";
import { UserState } from "./RecoilState";
import AuthController from "./AuthController";
import LoadingScreen from "./LoadingScreen";

const LoginRequired = (props) => {
  const user = useRecoilValue(UserState);
  const Auth = AuthController();

  if (user) {
    return <UserDetail>{props.children}</UserDetail>;
  } else if (user == false) {
    return (
      <div className="flex justify-center h-screen items-center bg-gray-100">
        <button
          className="bg-white border py-2 px-4 rounded-md hover:bg-gray-50 active:bg-gray-100 text-gray-700 font-semibold"
          onClick={Auth.login}
        >
          Login With Google
        </button>
      </div>
    );
  } else {
    return <LoadingScreen />;
  }
};

export default LoginRequired;
