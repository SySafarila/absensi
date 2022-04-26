import { useEffect } from "react";
import AuthController from "./AuthController";

const Container = (props) => {
  const Auth = AuthController();

  useEffect(() => {
    Auth.checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <>{props.children}</>;
};

export default Container;
