import { addDoc, collection, getFirestore } from "firebase/firestore";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";

const CreatePresence = () => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();
  const db = getFirestore();
  const router = useRouter();
  const { uid } = router.query;

  useEffect(() => {
    console.count("<CreatePresence />");
  }, []);

  const onSubmit = async (data) => {
    // console.log({ ...data, class_uid });
    try {
      const docRef = await addDoc(collection(db, "presences"), {
        ...data,
        class_uid: uid,
        created_at: new Date().getTime(),
      });
      reset({
        message: null,
      });
      console.log(`Presence stored with ID : ${docRef.id}`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <p>You can create presence for {uid} / this class</p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <textarea
          name="message"
          id="message"
          cols="30"
          rows="2"
          placeholder="message"
          {...register("message", { required: true })}
        ></textarea>
        <br />
        <button type="submit">Post</button>
      </form>
    </div>
  );
};

export default CreatePresence;
