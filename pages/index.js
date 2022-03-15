import { useRecoilState } from "recoil";
import AuthController from "../components/AuthController";
import { UserState } from "../components/RecoilState";

export default function Home() {
  const [user, setUser] = useRecoilState(UserState);

  const Auth = AuthController();
  return (
    <>
      <p>
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Aliquam iste
        nam amet aperiam beatae. Et perspiciatis, sint architecto odio
        assumenda, modi libero pariatur veniam minus placeat non rerum explicabo
        ipsum.
      </p>
      {!user ? <button onClick={Auth.login}>Login</button> : ''}
      {user ? <button onClick={Auth.logout}>Logout</button> : ''}
      {/* <button onClick={Auth.checkAuth}>Check Login</button> */}
      <button onClick={() => console.log(user)}>User</button>
    </>
  );
  }