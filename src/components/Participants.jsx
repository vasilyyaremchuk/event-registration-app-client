import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ParticipantDelete from "./ParticipantDelete";
import { getAuthClient } from "../utils/auth";
import serverConfig from "../config/config";

const serverConfiguration = serverConfig();

const auth = getAuthClient();

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
 * @param {string} id
 *   UUID of the event.
 * @param drupal_internal__nid
 *   Drupal node.nid of the event.
 * @param {string} title
 *   Title of the event.
 * @param {string} field_eventdate
 *   field_eventdate of the event, contains HTML.
 * @param {array} contentList
 *   Complete list of events.
 * @param {function} updateContent
 *   useState function to update contentList.
 */
const ParticipantItem = ({id, drupal_internal__id, field_first_name, field_last_name, field_email, field_interests, contentList, updateContent}) => {
/*  const [showAdminOptions, setShowAdminOptions] = useState(false);

  function handleClick(event) {
    event.preventDefault();
    setShowAdminOptions(!showAdminOptions)
  }

  function onEditSuccess(data) {
    // Replace the edited item in the list with updated values.
    const idx = contentList.findIndex(item => item.id === data.id);
    console.log('index', {idx, data, content: contentList});
    contentList[idx] = data;
    updateContent([...contentList]);
  }*/

  function onDeleteSuccess(id) {
    // Remove the deleted item from the list.
    const list = contentList.filter(item => item.id !== id);
    updateContent([...list]);
  }
/*
  // Show the item with admin options.
  if (showAdminOptions) {
    return (
      <div>
        <hr/>
        Admin options for {title}
        <NodeEdit
          id={id}
          title={title}
          field_eventdate={field_eventdate}
          onSuccess={onEditSuccess}
        />
        <hr/>
        <button onClick={handleClick}>
          cancel
        </button>
        <NodeDelete
          id={id}
          title={title}
          onSuccess={onDeleteSuccess}
        />
        <hr/>
      </div>
    );
  }*/

  // Show just the item. // TBD: delete function
  return (
    <div>
      {field_first_name}
      {" -- "}
      {field_last_name}
      {" -- "}
      {field_email}
      {" -- "}
      {field_interests}
      {" -- "}
      <ParticipantDelete
          id={id}
          field_first_name={field_first_name}
          field_last_name={field_last_name}
          onSuccess={onDeleteSuccess}
        />
    </div>
  );
};

/**
 * Component to render when there are no participants to display.
 */
const NoParticipants = () => (
  <div>No participants found.</div>
);

/**
 * Display a list of Drupal event nodes.
 *
 * Retrieves events from Drupal's JSON:API and then displays them along with
 * admin features to create, update, and delete events.
 */

const Participants = () => {
  const [content, updateContent] = useState([]);
  const [filter, setFilter] = useState(null);

  const { eid } = useParams(); // TBD: use that approach

  useEffect(() => {

    // https://stackoverflow.com/questions/58235681/react-routers-useparams-cause-useeffect-to-rerun
    /*getData(eid);
    if (eid !== undefined) {
      getGroup({ eid });
    }*/
    // This should point to your local Drupal instance. Alternatively, for React
    // applications embedded in a Drupal theme or module this could also be set
    // to a relative path.
    const url = `/jsonapi/participant/event_participant?fields[participant--event_participant]=id,drupal_internal__id,field_event,field_first_name,field_last_name,field_email,field_interests,field_event&filter[field_event]=`
    + eid + `&sort=-created&page[limit]=100`;
    console.log(url);
    //const url = `/jsonapi/participant/event_participant?fields[participant--event_participant]=id,drupal_internal__id,field_event,field_first_name,field_last_name,field_email,field_interests,field_event&sort=-created&page[limit]=100`;
    const headers = new Headers({
      Accept: 'application/vnd.api+json',
    });

    auth.fetchWithAuthentication(url, {headers})
      .then((response) => response.json())
      .then((data) => {
        if (isValidData(data)) {
          // Initialize the list of content with data retrieved from Drupal.
          updateContent(data.data);
        }
      })
      .catch(err => console.log('There was an error accessing the API', err));
    }, [eid]);

  return (
    <div>
      <h2>Participants</h2>
      {content.length ? (
        <>
          <label htmlFor="filter">Type to filter:</label>{" "}
          <input
            type="text"
            name="filter"
            placeholder="Find the Participant"
            onChange={(event => setFilter(event.target.value.toLowerCase()))}
          />
          <hr/>
          {
            // If there's a `filter` apply it to the list of nodes.
            content.filter((item) => {
              if (filter) {
                const field_first_name = item.attributes.field_first_name ? item.attributes.field_first_name.toLowerCase() : '';
                const field_last_name = item.attributes.field_last_name ? item.attributes.field_last_name.toLowerCase() : '';
                const field_email = item.attributes.field_email ? item.attributes.field_email.toLowerCase() : '';
                const field_interests = item.attributes.field_interests ? item.attributes.field_interests.toLowerCase() : '';
                return (field_first_name.includes(filter) || field_last_name.includes(filter) || field_email.includes(filter) || field_interests.includes(filter)) ? item : false;
              }

              return item;
            }).map((item) => (
              <ParticipantItem
                key={item.id}
                id={item.id}
                updateContent={updateContent}
                contentList={content}
                {...item.attributes}
              />
            ))
          }
          <hr/>
          <a href={ serverConfiguration.base + '/participants/' + eid } target="_blank" rel="noopener noreferrer">Export CSV</a>
        </>
      ) : (
        <NoParticipants />
      )}
    </div>
  );
};

export default Participants;
