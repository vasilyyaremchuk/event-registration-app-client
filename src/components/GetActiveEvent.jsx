import React, { useEffect, useState } from "react";
import ParticipantForm from "./ParticipantForm";
import serverConfig from "../config/config";

const serverConfiguration = serverConfig();

/**
 * Helper function to validate data retrieved from JSON:API.
 */
function isValidData(data) {
  if (data === null) {
    return false;
  }
  if (data.data === undefined ||
    data.data === null ||
    data.data.length === 0 ) {
    return false;
  }
  return true;
}

/**
 * Component for displaying an individual event, with optional admin features.
 *
 * @param {string} title
 *   Title of the event.
 * @param {string} field_eventdate
 *   field_eventdate of the event, contains HTML.
 */
const NodeItem = ({title, field_eventdate}) => (
  <div>
    <h2>{title} -- {field_eventdate.split('T')[0]}</h2>
  </div>
);

/**
 * Component to render when there are no events to display.
 */
const NoData = () => (
  <div>No active events found.</div>
);

/**
 * Display a list of Drupal event nodes.
 *
 * Retrieves events from Drupal's JSON:API and then displays them along with
 * admin features to create, update, and delete events.
 */
const GetActiveEvent = () => {
  const [content, setContent] = useState(false);

  useEffect(() => {
    const url = serverConfiguration.base + `/jsonapi/node/event?fields[node--event]=id,drupal_internal__nid,title,field_eventdate,sticky&sort=-sticky&page[limit]=1`;

    const headers = new Headers({
      Accept: 'application/vnd.api+json',
    });

    fetch(url, {headers})
      .then((response) => response.json())
      .then((data) => {
        if (isValidData(data)) {
          setContent(data.data)
        }
      })
      .catch(err => console.log('There was an error accessing the API', err));
  }, []);
  return (
    <div>
      {content ? (
        <>
          <NodeItem key={content[0].id} {...content[0].attributes}/>
          <ParticipantForm id={content[0].id} />
        </>
      ) : (
        <NoData />
      )}
    </div>
  );
};

export default GetActiveEvent;
