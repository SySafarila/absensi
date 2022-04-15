import { addDoc, collection, getFirestore } from "firebase/firestore";
import { useForm } from "react-hook-form";

const CreatePresence = ({ class_uid }) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const db = getFirestore();

  const onSubmit = async (data) => {
    // console.log({ ...data, class_uid });
    try {
      const docRef = await addDoc(collection(db, "presences"), {
        ...data,
        class_uid,
      });
      console.log(docRef.id);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <p>You can create presence for {class_uid}</p>
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