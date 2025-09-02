// import React, { useState } from "react";
// import { useParams } from "react-router-dom";
// import {
//   Container,
//   Row,
//   Col,
//   Card,
//   Tab,
//   Nav,
//   Button,
//   Modal,
// } from "react-bootstrap";
// import { useQuery, useMutation, useQueryClient } from "react-query";
// import { Conference } from "../../../types/conference";
// import { showConferenceById } from "../../../apis/conference";

// const ConferenceDetailPage: React.FC = () => {
//   const { id } = useParams<{ id: string }>();
//   const queryClient = useQueryClient();

//   const { data, isLoading, error } = useQuery<{ conference: Conference }>(
//     ["conference", id],
//     () => showConferenceById(id),
//     { enabled: !!id }
//   );

//   const [tabKey, setTabKey] = useState<"attendees" | "speakers">("attendees");
//   const [showRemoveModal, setShowRemoveModal] = useState(false);
//   const [removeTarget, setRemoveTarget] = useState<{
//     id: string;
//     type: "speaker" | "attendee";
//     name: string;
//   } | null>(null);

//   // Mutations for removing speaker or attendee
//   const deleteSpeakerMutation = useMutation(deleteSpeaker, {
//     onSuccess() {
//       queryClient.invalidateQueries(["conference", id]);
//       setShowRemoveModal(false);
//     },
//   });

//   const deleteAttendeeMutation = useMutation(deleteAttendee, {
//     onSuccess() {
//       queryClient.invalidateQueries(["conference", id]);
//       setShowRemoveModal(false);
//     },
//   });

//   if (isLoading)
//     return <Container className="text-center py-5">Loading...</Container>;
//   if (error || !data)
//     return (
//       <Container className="text-center py-5">
//         Failed to load conference details.
//       </Container>
//     );

//   const conference = data.conference;

//   const handleRemoveClick = (
//     type: "speaker" | "attendee",
//     userId: string,
//     name: string
//   ) => {
//     setRemoveTarget({ type, id: userId, name });
//     setShowRemoveModal(true);
//   };

//   const handleConfirmRemove = () => {
//     if (!removeTarget) return;
//     if (removeTarget.type === "speaker") {
//       deleteSpeakerMutation.mutate(removeTarget.id);
//     } else {
//       deleteAttendeeMutation.mutate(removeTarget.id);
//     }
//   };

//   return (
//     <Container className="py-4">
//       <Card className="mb-4">
//         <Card.Body>
//           <h2>{conference.title}</h2>
//           <p>
//             <strong>Location:</strong> {conference.location}
//           </p>
//           <p>
//             <strong>Start:</strong>{" "}
//             {new Date(conference.start_time).toLocaleString()}
//           </p>
//           <p>
//             <strong>End:</strong>{" "}
//             {new Date(conference.end_time).toLocaleString()}
//           </p>
//           <p>{conference.description}</p>
//         </Card.Body>
//       </Card>

//       <Card>
//         <Card.Header>
//           <Nav
//             variant="tabs"
//             activeKey={tabKey}
//             onSelect={(k) => typeof k === "string" && setTabKey(k)}
//           >
//             <Nav.Item>
//               <Nav.Link eventKey="attendees">
//                 Attendees ({conference.attendees?.length || 0})
//               </Nav.Link>
//             </Nav.Item>
//             <Nav.Item>
//               <Nav.Link eventKey="speakers">
//                 Speakers ({conference.speakers?.length || 0})
//               </Nav.Link>
//             </Nav.Item>
//           </Nav>
//         </Card.Header>
//         <Card.Body>
//           <Tab.Content>
//             <Tab.Pane active={tabKey === "attendees"}>
//               <div className="d-flex justify-content-between align-items-center mb-3">
//                 <h5>Attendees</h5>
//                 <Button
//                   variant="success"
//                   size="sm"
//                   onClick={() => alert("Add Attendee modal here")}
//                 >
//                   Add Attendee
//                 </Button>
//               </div>
//               <Table striped bordered hover responsive>
//                 <thead>
//                   <tr>
//                     <th>Avatar</th>
//                     <th>Name</th>
//                     <th>Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {conference.attendees.length === 0 && (
//                     <tr>
//                       <td colSpan={3} className="text-center">
//                         No attendees yet.
//                       </td>
//                     </tr>
//                   )}
//                   {conference.attendees.map((a: ConferenceAttendee) => (
//                     <tr key={a.lname + a.fname}>
//                       <td>
//                         <img
//                           src={getMediaUrl(a.avatar)}
//                           alt={`${a.fname} ${a.lname}`}
//                           style={{
//                             width: 40,
//                             height: 40,
//                             objectFit: "cover",
//                             borderRadius: "50%",
//                           }}
//                         />
//                       </td>
//                       <td>
//                         {a.fname} {a.lname}
//                       </td>
//                       <td>
//                         <Button
//                           size="sm"
//                           variant="danger"
//                           onClick={() =>
//                             handleRemoveClick(
//                               "attendee",
//                               a.lname + a.fname,
//                               `${a.fname} ${a.lname}`
//                             )
//                           }
//                         >
//                           Remove
//                         </Button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </Table>
//             </Tab.Pane>

//             <Tab.Pane active={tabKey === "speakers"}>
//               <div className="d-flex justify-content-between align-items-center mb-3">
//                 <h5>Speakers</h5>
//                 <Button
//                   variant="success"
//                   size="sm"
//                   onClick={() => alert("Add Speaker modal here")}
//                 >
//                   Add Speaker
//                 </Button>
//               </div>
//               <Table striped bordered hover responsive>
//                 <thead>
//                   <tr>
//                     <th>Avatar</th>
//                     <th>Name</th>
//                     <th>Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {conference.speakers.length === 0 && (
//                     <tr>
//                       <td colSpan={3} className="text-center">
//                         No speakers yet.
//                       </td>
//                     </tr>
//                   )}
//                   {conference.speakers.map((s: ConferenceSpeaker) => (
//                     <tr key={s.lname + s.fname}>
//                       <td>
//                         <img
//                           src={getMediaUrl(s.avatar)}
//                           alt={`${s.fname} ${s.lname}`}
//                           style={{
//                             width: 40,
//                             height: 40,
//                             objectFit: "cover",
//                             borderRadius: "50%",
//                           }}
//                         />
//                       </td>
//                       <td>
//                         {s.fname} {s.lname}
//                       </td>
//                       <td>
//                         <Button
//                           size="sm"
//                           variant="danger"
//                           onClick={() =>
//                             handleRemoveClick(
//                               "speaker",
//                               s.lname + s.fname,
//                               `${s.fname} ${s.lname}`
//                             )
//                           }
//                         >
//                           Remove
//                         </Button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </Table>
//             </Tab.Pane>
//           </Tab.Content>
//         </Card.Body>
//       </Card>

//       {/* Remove Confirmation Modal */}
//       <Modal
//         show={showRemoveModal}
//         onHide={() => setShowRemoveModal(false)}
//         centered
//       >
//         <Modal.Header closeButton>
//           <Modal.Title>Confirm Removal</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           Are you sure you want to remove {removeTarget?.name} from{" "}
//           {removeTarget?.type}?
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowRemoveModal(false)}>
//             Cancel
//           </Button>
//           <Button
//             variant="danger"
//             onClick={() => {
//               if (!removeTarget) return;
//               // if (removeTarget.type === "speaker") {
//               //   deleteSpeakerMutation.mutate(removeTarget.id);
//               // } else {
//               //   deleteAttendeeMutation.mutate(removeTarget.id);
//               // }
//             }}
//           >
//             Remove
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </Container>
//   );
// };

// export default ConferenceDetailPage;

import React from "react";

const Page = () => {
  return <div></div>;
};

export default Page;
