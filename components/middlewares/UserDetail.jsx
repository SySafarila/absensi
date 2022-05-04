import { useEffect } from "react";
import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore";
import { useRecoilState, useRecoilValue } from "recoil";
import { UserState, UserDetail as UserDetailState } from "../RecoilState";
import { useForm } from "react-hook-form";

const UserDetail = (props) => {
  const db = getFirestore();
  const user = useRecoilValue(UserState);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const [userDetail, setUserDetail] = useRecoilState(UserDetailState);

  useEffect(() => {
    getX();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getX = async () => {
    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log(docSnap.data());
      setUserDetail(docSnap.data());
    } else {
      console.log("No such document!");
      setUserDetail(false);
    }
  };

  const onSubmit = async (data) => {
    console.log(data);
    try {
      await setDoc(doc(db, "users", user.uid), data);
      setUserDetail(data);
    } catch (err) {
      // setUserDetail(false);
    }
  };

  if (userDetail == null) {
    return "loading";
  } else if (userDetail == false) {
    return (
      <>
        <p>user detail required</p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            type="text"
            {...register("name", { required: true })}
            placeholder="name"
            required
          />
          <input
            type="number"
            {...register("nim", { required: true })}
            placeholder="nim"
            required
          />
          <input
            type="number"
            {...register("semester", { required: true })}
            placeholder="semester"
            required
          />
          <button type="submit">submit</button>
        </form>
      </>
    );
  } else {
    return props.children;
  }
};

export default UserDetail;
