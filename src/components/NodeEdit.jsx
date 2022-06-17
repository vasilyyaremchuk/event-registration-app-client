import React from "react";
import NodeForm from "./NodeForm";

const NodeEdit = ({ id, title, field_eventdate, onSuccess }) => (
  <NodeForm
    id={id}
    title={title}
    field_eventdate={field_eventdate}
    onSuccess={onSuccess}
  />
);

export default NodeEdit;
