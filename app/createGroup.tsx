import { useRouter, useSearchParams } from "expo-router";
import { Field, Form, Formik } from "formik";
import { View } from "react-native";
import { addGroup } from "./firebase";

export default function createGroup() {
  const router = useRouter();
  const { uid } = useSearchParams() as { uid: string };
  return (
    <>
      <View>
        <Formik
          initialValues={{
            groupName: "",
          }}
          onSubmit={async (values) => {
            const created = await addGroup(values.groupName);
            console.log("param uid = ", uid);
            router.replace("/tasks");
            router.setParams({
              uid,
              gid: created.id,
            });

            // toast("created group");
            // let toast = Toast.show("Created group", {
            //   duration: Toast.durations.LONG,
            // });
            console.log(created);
          }}
        >
          <Form>
            <Field name="groupName" placeholder="Group name" type="text" />
            <button type="submit" title="Submit">
              Submit
            </button>
          </Form>
        </Formik>
      </View>
    </>
  );
}
