// function Cell({
//   content,
//   bold,
//   outerStyle,
//   innerStyle,
// }: {
//   content: string;
//   bold: boolean;
//   outerStyle: StyleProp<ViewStyle>;
//   innerStyle: StyleProp<TextStyle>;
// }) {
//   return (
//     <View style={outerStyle}>
//       <Text style={innerStyle}>{content}</Text>
//     </View>
//   );
// }
// export function RowManual({
//   row,
//   bold,
// }: {
//   row: [string, string, string, string, string];
//   bold: boolean;
// }) {
//   return (
//     // <View
//     //   style={{
//     //     flex: 1,
//     //     backgroundColor: "#fff",
//     //     alignItems: "center",
//     //     justifyContent: "center",
//     //   }}
//     // >
//     <View
//       style={{
//         display: "flex",
//         alignSelf: "stretch",
//         flexDirection: "row",
//       }}
//     >
//       <Cell
//         content={row[0]}
//         bold={bold}
//         outerStyle={styles._2}
//         innerStyle={{ fontWeight: bold ? "bold" : "normal" }}
//       ></Cell>
//       <Cell
//         content={row[1]}
//         bold={bold}
//         outerStyle={styles._2}
//         innerStyle={{ fontWeight: bold ? "bold" : "normal" }}
//       ></Cell>
//       <Cell
//         content={row[2]}
//         bold={bold}
//         outerStyle={styles._2}
//         innerStyle={{ fontWeight: bold ? "bold" : "normal" }}
//       ></Cell>
//       <Cell
//         content={row[3]}
//         bold={bold}
//         outerStyle={styles._2}
//         innerStyle={{ fontWeight: bold ? "bold" : "normal" }}
//       ></Cell>
//       <Cell
//         content={row[4]}
//         bold={bold}
//         outerStyle={styles._2}
//         innerStyle={{ fontWeight: bold ? "bold" : "normal" }}
//       ></Cell>
//     </View>
//     // </View>
//   );
// }
// export function TableManual({
//   rowHeader,
//   rows,
// }: {
//   rowHeader: [string, string, string, string, string];
//   rows: [string, string, string, string, string][];
// }) {
//   return (
//     <View style={styles._0}>
//       <RowManual row={rowHeader} bold={true} />
//       {rows.map((row) => {
//         return <RowManual row={row} bold={false}></RowManual>;
//       })}
//     </View>
//   );
// }
