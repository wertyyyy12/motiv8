import { useRouter, useSearchParams } from "expo-router";
import { Field, Form, Formik } from "formik";
import Button from "../components/Button";
import { getGroupIdFromCode } from "./firebase";

export default function navigateToGroup() {
  const router = useRouter();
  const { uid } = useSearchParams() as { uid: string };
  return (
    <>
      <Button
        label="Create group"
        onPress={() => {
          router.push("/createGroup");
          router.setParams({
            uid,
          });
        }}
      />
      <Formik
        initialValues={{
          groupCode: "",
        }}
        onSubmit={async (values) => {
          router.push("/tasks");
          const id = await getGroupIdFromCode(values.groupCode);
          router.setParams({
            groupId: id,
          });
        }}
      >
        <Form>
          <Field
            name="groupCode"
            placeholder="Join or navigate to group code"
            type="text"
          />
          <button type="submit" title="Submit">
            Submit
          </button>
        </Form>
      </Formik>
    </>
  );
}
