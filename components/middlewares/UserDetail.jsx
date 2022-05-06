import { useEffect, useState } from "react";
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
  const [type, setType] = useState(null);

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
    console.log({ ...data, type: type });
    try {
      await setDoc(doc(db, "users", user.uid), { ...data, type: type });
      setUserDetail(data);
    } catch (err) {
      // setUserDetail(false);
    }
  };

  const Forms = () => {
    if (type == "mahasiswa") {
      return <MahasiswaForm />;
    } else if (type == "dosen") {
      return <DosenForm />;
    } else {
      return null;
    }
  };

  const MahasiswaForm = () => {
    return (
      <div>
        <div>
          <label htmlFor="name">name</label>
          <input
            type="text"
            name="name"
            id="name"
            {...register("name", { required: true })}
          />
        </div>
        <div>
          <label htmlFor="nim">nim</label>
          <input
            type="text"
            name="nim"
            id="nim"
            {...register("nim", { required: true })}
          />
        </div>
      </div>
    );
  };

  const DosenForm = () => {
    return (
      <div>
        <div>
          <label htmlFor="name">name</label>
          <input
            type="text"
            name="name"
            id="name"
            {...register("name", { required: true })}
          />
        </div>
        <div>
          <label htmlFor="identifier">identifier</label>
          <input
            type="text"
            name="identifier"
            id="identifier"
            {...register("identifier", { required: true })}
          />
        </div>
      </div>
    );
  };

  if (userDetail == null) {
    return "loading";
  } else if (userDetail == false) {
    return (
      <>
        <p>user detail required</p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <input
              type="radio"
              name="type"
              id="type"
              value={"mahasiswa"}
              onClick={() => setType("mahasiswa")}
            />
            <label htmlFor="type" onClick={() => setType("mahasiswa")}>
              mahasiswa
            </label>
          </div>
          <div>
            <input
              type="radio"
              name="type"
              id="type2"
              value={"mahasiswa"}
              onClick={() => setType("dosen")}
            />
            <label htmlFor="type2" onClick={() => setType("dosen")}>
              dosen
            </label>
          </div>
          <Forms />
          {type != null ? <button type="submit">submit</button> : ""}
        </form>
      </>
    );
  } else {
    return props.children;
  }
};

export default UserDetail;
