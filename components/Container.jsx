import { useEffect } from "react";
import AuthController from "./AuthController";

const Container = (props) => {

  const Auth = AuthController();

  useEffect(() => {
    Auth.checkAuth();
  }, []);

  return <>{props.children}</>;
};

export default Container;
