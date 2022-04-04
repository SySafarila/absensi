import { useRecoilState } from "recoil";
import AuthController from "../components/AuthController";
import { UserState } from "../components/RecoilState";
import { collection, addDoc, getFirestore } from "firebase/firestore";
import Link from "next/link";

export default function Home() {
  const [user, setUser] = useRecoilState(UserState);

  const Auth = AuthController();
  const db = getFirestore();

  const addData = async () => {
    const docRef = await addDoc(collection(db, "cities"), {
      name: "Tokyo",
      country: "Japan",
    });

    console.log(`Document written with ID : ${docRef.id}`);
  };

  const Classes = () => {
    if (user) {
      return (
        <>
          <Link href="/classes/create">Buat Kelas</Link>
          <span> | </span>
          <Link href="/classes">Kelas</Link>
        </>
      );
    } else {
      return null;
    }
  };

  return (
    <>
      <p>
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Aliquam iste
        nam amet aperiam beatae. Et perspiciatis, sint architecto odio
        assumenda, modi libero pariatur veniam minus placeat non rerum explicabo
        ipsum.
      </p>
      {!user ? <button onClick={Auth.login}>Login</button> : ""}
      {user ? <button onClick={Auth.logout}>Logout</button> : ""}
      {/* <button onClick={Auth.checkAuth}>Check Login</button> */}
      <button onClick={() => console.log(user)}>User</button>

      <Classes />
    </>
  );
}
