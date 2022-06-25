import React from "react";
import NodeForm from "./NodeForm";

const NodeEdit = ({ id, title, sticky, field_eventdate, onSuccess }) => (
  <NodeForm
    id={id}
    title={title}
    sticky={sticky}
    field_eventdate={field_eventdate}
    onSuccess={onSuccess}
  />
);

export default NodeEdit;
