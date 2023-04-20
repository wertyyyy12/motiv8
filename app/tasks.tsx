import { Field, Form, Formik } from "formik";
// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const analytics = getAnalytics(app);
import { Link, useSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Row, Rows, Table } from "react-native-table-component";
import Button from "../components/Button";
import CustomModal from "../components/CustomModal";
import ImageTaker from "../components/ScreenshotTaker";
import {
  Task,
  addTask,
  evaluateProof,
  getTaskData,
  getUser,
  uploadImage,
} from "./firebase";

function UploadButton({
  taskId,
  onUpload,
}: {
  taskId: string;
  onUpload: () => void;
}) {
  const [uploadingProof, setUploadingProof] = useState(false);

  return (
    <>
      {uploadingProof && (
        <ImageTaker
          onScreenshotTaken={async (dataURL) => {
            console.log(dataURL);
            uploadImage(dataURL, taskId);
            await onUpload();
            setUploadingProof(false);
          }}
        ></ImageTaker>
      )}
      {!uploadingProof && (
        <Button
          label={"+ Upload Proof"}
          onPress={() => {
            setUploadingProof(true);
          }}
        ></Button>
      )}
    </>
    // <Button
    //   label={"+ Upload Proof"}
    //   onPress={async () => {
    //     const result = await ImagePicker.launchImageLibraryAsync({
    //       allowsEditing: true,
    //       base64: true,
    //       quality: 1,
    //     });
    //     if (!result.canceled) {
    //       const r = doc(db, "tasks", taskId);
    //       // await updateDoc(ref, {
    //       //   proof: result.assets[0].uri,
    //       // });
    //       //

    //       const storageRef = ref(storage, taskId);
    //       const snapshot = await uploadString(
    //         storageRef,
    //         result.assets[0].uri,
    //         "data_url"
    //       );
    //       const imgSrc = await getDownloadURL(ref(storage, taskId));
    //       await updateDoc(r, {
    //         proof: imgSrc,
    //         timestamp: Date.now(),
    //       });
    //       await onUpload();
    //       console.log(result);
    //     }
    //   }}
    // ></Button>
  );
}

function ApprovalButtons({
  taskId,
  onResolve,
}: {
  taskId: string;
  onResolve: () => void; //approval == true if approved, else false
}) {
  const { uid, gid } = useSearchParams() as { uid: string; gid: string };
  return (
    <>
      <Button
        label={"Approve Proof"}
        onPress={async () => {
          // throw "not implemented yet";
          evaluateProof(taskId, uid, true);
          await onResolve();
        }}
      ></Button>
      <Button
        label={"Reject Proof"}
        onPress={async () => {
          // throw "not implemented yet";
          evaluateProof(taskId, uid, false);
          await onResolve();
        }}
      ></Button>
    </>
  );
}

const ps = (thing: Object) => {
  return JSON.parse(JSON.stringify(thing));
};
export default function tasks() {
  const [isVisible, setVisible] = useState(false);
  const [tasks, setTasks] = useState<Task[] | null>(null);
  const [tableData, setTable] = useState<(TaskTableRow | [])[]>([[]]);
  const { uid, gid } = useSearchParams() as {
    uid: string;
    gid: string;
  };
  // Import the functions you need from the SDKs you need
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyDI0pdNScooOr1zG1HpQ_EFsEZOcynq8LE",
    authDomain: "motiv8-9a647.firebaseapp.com",
    projectId: "motiv8-9a647",
    storageBucket: "motiv8-9a647.appspot.com",
    messagingSenderId: "621039869296",
    appId: "1:621039869296:web:f286b99432801c619543b5",
    measurementId: "G-0QMMZSKPG5",
  };

  // Initialize Firebase

  type TaskTableRow = readonly [
    Task["taskName"],
    string, //creatorName
    Task["deadline"],
    React.ReactElement, //proofElement
    Task["timestamp"],
    React.ReactElement //approvalElement
  ];

  const refreshTaskData = async () => {
    //syncs tableData state with database
    // throw "not implemented yet";
    const tableData = await getTaskData(gid);
    console.log("the table data fetched = ", tableData);
    setTasks(tableData);
  };
  useEffect(() => {
    refreshTaskData();
  }, []);

  useEffect(() => {
    const setTableData = async () => {
      let finalData: (TaskTableRow | [])[] = [];
      if (tasks) {
        for (const task of tasks) {
          let proofElement = <></>;
          const taskCreator = await getUser(task.creatorId);
          // const taskEvaluator = getUser(task.)
          if (task.proof) {
            proofElement = <Link href={task.proof}>{task.proof}</Link>;
          } else {
            proofElement = (
              <UploadButton taskId={task.id} onUpload={refreshTaskData} />
            );
          }

          let approvalElement = <></>;
          if (task.evaluations === null) {
            if (task.creatorId != uid) {
              approvalElement = (
                <ApprovalButtons taskId={task.id} onResolve={refreshTaskData} />
              );
            }
          } else {
            approvalElement = (
              <>
                {task.creatorId != uid && (
                  <ApprovalButtons
                    taskId={task.id}
                    onResolve={refreshTaskData}
                  />
                )}
                {task.evaluations != null &&
                  task.evaluations.map(async (evaluation) => {
                    const evaluator = await getUser(evaluation.evaluatorId);
                    return (
                      <Text>
                        {`${evaluation.approved ? "Approved" : "Rejected"} by ${
                          evaluator.name
                        }`}
                      </Text>
                    );
                  })}
              </>
            );
            // for (const evaluation of task.evaluations) {
            // }
          }
          finalData.push([
            task.taskName,
            taskCreator.name,
            task.deadline,
            proofElement,
            task.timestamp ? new Date(task.timestamp).toString() : null,
            approvalElement,
          ]);
        }
      } else {
        finalData = [[]];
      }
      console.log("refreshing  table to", ps(finalData));
      setTable(finalData);
    };
    setTableData();
    /*
 tasks.map((task) => {
                  let imgSrc = "";
                  if (task.proof) {
                    imgSrc = await getDownloadURL(ref(storage, task.id));
                  }
                  return [
                    task.taskName,
                    task.creatorName,
                    task.deadline,
                    task.proof ? (
                      <ImageViewer src={imgSrc} />
                    ) : (
                      <UploadButton
                        taskId={task.id}
                        onUpload={async () => {
                          setTasks(await getTableData());
                        }}
                      />
                    ),
                    task.timestamp,
                    task.approved,
                  ];
                })
              : [[]]
 */
  }, [tasks]);

  return (
    <View style={styles._0}>
      <CustomModal
        isVisible={isVisible}
        onClose={() => {
          setVisible(false);
        }}
        title={"Add new task"}
      >
        <>
          <Formik
            initialValues={{
              taskName: "",
              deadline: "",
              deadlineTime: "23:59",
            }}
            onSubmit={async (values) => {
              // await new Promise((resolve) => setTimeout(resolve, 500));
              const [year, month, day] = values.deadline.split("-");
              const [hour, minute] = values.deadlineTime.split(":");
              const v = {
                ...values,
                deadline: new Date(
                  Number(year),
                  Number(month) - 1,
                  Number(day),
                  Number(hour),
                  Number(minute)
                ).toString(),
                creatorId: uid,
              };
              addTask(v);
              await refreshTaskData();
              console.log(ps(v));
              alert(JSON.stringify(v, null, 2));
            }}
          >
            <Form>
              <Field name="taskName" placeholder="Task name" type="text" />
              <Field name="deadline" type="date" />
              <Field name="deadlineTime" type="time" />
              {/* <Field name="creatorName" type="text" /> */}
              <button type="submit">Submit</button>
            </Form>
          </Formik>
        </>
        {/* <Text>some stuff here</Text> */}
      </CustomModal>
      <Button label={"+ New Task"} onPress={() => setVisible(true)}></Button>
      <Table borderStyle={{ borderWidth: 2, borderColor: "#c8e1ff" }}>
        <Row
          data={[
            "Task",
            "Creator Name",
            "Deadline",
            "Proof",
            "Timestamp",
            "Approved?",
          ]}
          style={styles.head}
          textStyle={styles.text}
        />
        <Rows data={tableData} textStyle={styles.text} />
      </Table>
      {/* <Table
        rowHeader={}
        rows={[["hi", "hii", "hiii", "hiii", "hiiii"]]}
      ></Table> */}
    </View>
  );
}
const styles = StyleSheet.create({
  _0: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  _1: {
    alignSelf: "stretch",
    flexDirection: "row",
  },
  _2: {
    alignSelf: "stretch",
    padding: "10px",
  },
  head: { height: 40, backgroundColor: "#f1f8ff" },
  text: { margin: 10 },
});
