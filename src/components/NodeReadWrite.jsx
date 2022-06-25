import React, { useEffect, useState } from "react";
import NodeAdd from "./NodeAdd";
import NodeEdit from "./NodeEdit";
import NodeDelete from "./NodeDelete";
import { getAuthClient } from "../utils/auth";

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
 * @param {bulian} sticky
 *   Is Active?
 * @param {string} field_eventdate
 *   field_eventdate of the event, contains HTML.
 * @param {array} contentList
 *   Complete list of events.
 * @param {function} updateContent
 *   useState function to update contentList.
 */
const NodeItem = ({id, drupal_internal__nid, title, sticky, field_eventdate, contentList, updateContent}) => {
  const [showAdminOptions, setShowAdminOptions] = useState(false);

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
  }

  function onDeleteSuccess(id) {
    // Remove the deleted item from the list.
    const list = contentList.filter(item => item.id !== id);
    updateContent([...list]);
  }

  // Show the item with admin options.
  if (showAdminOptions) {

    return (
      <div>
        <hr/>
        Admin options for {title}
        <NodeEdit
          id={id}
          title={title}
          sticky={sticky}
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
          sticky={sticky}
          onSuccess={onDeleteSuccess}
        />
        <hr/>
      </div>
    );
  }

  // Show just the item.
  return (
    <div>
      {title}
      {" -- "}
      <span>{field_eventdate.split('T')[0]}</span>
      {" -- "}
      <button onClick={handleClick}>
        edit
      </button>
      {" -- "}
      <a href={`/participants/${id}`}>List of Participants</a>
    </div>
  );
};

/**
 * Component to render when there are no events to display.
 */
const NoData = () => (
  <div>No events found.</div>
);

/**
 * Display a list of Drupal event nodes.
 *
 * Retrieves events from Drupal's JSON:API and then displays them along with
 * admin features to create, update, and delete events.
 */
const NodeReadWrite = () => {
  const [content, updateContent] = useState([]);
  const [filter, setFilter] = useState(null);
  const [showNodeAdd, setShowNodeAdd] = useState(false);

  //auth.login('admin', 'admin');

  useEffect(() => {
    // This should point to your local Drupal instance. Alternatively, for React
    // applications embedded in a Drupal theme or module this could also be set
    // to a relative path.
    const url = `/jsonapi/node/event?fields[node--event]=id,drupal_internal__nid,title,sticky,field_eventdate&sort=-created&page[limit]=10`;
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
    }, []);

  // Handle updates to state when a node is added.
  function onNodeAddSuccess(data) {
    // Add the new item to the top of the list.
    content.unshift(data);
    // Note the use of [...content] here, this is because we're
    // computing new state based on previous state and need to use a
    // functional update. https://reactjs.org/docs/hooks-reference.html#functional-updates
    // [...content] syntax creates a new array with the values of
    // content, and updates the state to that new array.
    updateContent([...content]);
  }

  return (
    <div>
      <h2>Events</h2>
      {content.length ? (
        <>
          <label htmlFor="filter">Type to filter:</label>{" "}
          <input
            type="text"
            name="filter"
            placeholder="Find the Event"
            onChange={(event => setFilter(event.target.value.toLowerCase()))}
          />
          <hr/>
          {
            // If there's a `filter` apply it to the list of nodes.
            content.filter((item) => {
              if (filter) {
                const title = item.attributes.title ? item.attributes.title.toLowerCase() : '';
                const field_eventdate = item.attributes.field_eventdate ? item.attributes.field_eventdate : '';
                return (title.includes(filter) || field_eventdate.includes(filter)) ? item : false;
              }

              return item;
            }).map((item) => (
              <NodeItem
                key={item.id}
                id={item.id}
                updateContent={updateContent}
                contentList={content}
                {...item.attributes}
              />
            ))
          }
        </>
      ) : (
        <NoData />
      )}
      <hr />
      {showNodeAdd ? (
        <>
          <h3>Add a new event</h3>
          <NodeAdd
            onSuccess={onNodeAddSuccess}
          />
        </>
      ) : (
        <p>
          Do you have something new?
          {" "}
          <button onClick={() => setShowNodeAdd(true)}>Add Event</button>
        </p>
      )}
    </div>
  );
};

export default NodeReadWrite;
