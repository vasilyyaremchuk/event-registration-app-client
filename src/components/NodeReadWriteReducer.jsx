import React, { useEffect, useReducer, useState } from "react";
import NodeAdd from "./NodeAdd";
import NodeEdit from "./NodeEdit";
import NodeDelete from "./NodeDelete";

/**
 * Reducer function to manage list of events being displayed.
 */
function contentReducer(state, action) {
  let { list } = state;
  switch (action.type) {
    case 'initialize':
      return { list: action.data };

    case 'add':
      // Add a new item to the content list.
      list.unshift(action.data);
      return { ...state, list: list };

    case 'update':
      // Update an existing item in the list.
      const idx = list.findIndex(item => item.id === action.data.id);
      list[idx] = action.data;
      return { ...state, list: list };

    case 'delete':
      // Delete an item from the content list.
      list = list.filter(item => item.id !== action.data);
      return { ...state, list: list };

    default:
      throw new Error('Unknown action.type');
  }
}

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
 *   Date of the event, Date format.
 * @param {function} dispatchContentAction
 *   Dispatcher for contentReducer(), use to update the content state when
 *   changes are made that modify an event.
 */
const NodeItem = ({id, drupal_internal__nid, title, field_eventdate, dispatchContentAction}) => {
  const [showAdminOptions, setShowAdminOptions] = useState(false);

  const handleClick = (event) => {
    event.preventDefault();
    setShowAdminOptions(!showAdminOptions)
  };

  if (showAdminOptions) {
    return (
      <div>
        <hr/>
        Admin options for {title}
        <NodeEdit
          id={id}
          title={title}
          field_eventdate={field_eventdate.value}
          onSuccess={data => dispatchContentAction({ type: 'update', data })}
        />
        <hr/>
        <button onClick={handleClick}>
          cancel
        </button>
        <NodeDelete
          id={id}
          title={title}
          onSuccess={id => dispatchContentAction({ type: 'delete', data: id })}
        />
        <hr/>
      </div>
    );
  }

  return (
    <div>
      <a href={`/node/${drupal_internal__nid}`}>{title}</a> <span>{field_eventdate.value}</span>
      {" -- "}
      <button onClick={handleClick}>
        edit
      </button>
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
  const initialState = { list: [] };
  const [content, dispatchContentAction] = useReducer(contentReducer, initialState);
  const [filter, setFilter] = useState(null);
  const [showNodeAdd, setShowNodeAdd] = useState(false);

  useEffect(() => {
    // This should point to your local Drupal instance. Alternatively, for React
    // applications embedded in a Drupal theme or module this could also be set
    // to a relative path.
    const API_ROOT = '/jsonapi/';
    const url = `${API_ROOT}node/event?fields[node--event]=id,drupal_internal__nid,title,field_eventdate&sort=-created&page[limit]=10`;

    const headers = new Headers({
      Accept: 'application/vnd.api+json',
    });

    fetch(url, {headers})
      .then((response) => response.json())
      .then((data) => {
        if (isValidData(data)) {
          dispatchContentAction({ type: 'initialize', data: data.data });
        }
      })
      .catch(err => console.log('There was an error accessing the API', err));
  }, []);

  return (
    <div>
      <h2>Site content</h2>
      {content.list.length ? (
        <>
          <label htmlFor="filter">Type to filter:</label>
          <input
            type="text"
            name="filter"
            placeholder="Find the Event"
            onChange={(event => setFilter(event.target.value.toLowerCase()))}
          />
          <hr/>
          {
            content.list.filter((item) => {
              if (!filter) {
                return item;
              }

              if (filter && (item.attributes.title.toLowerCase().includes(filter) || item.attributes.field_eventdate.value.toLowerCase().includes(filter))) {
                return item;
              }
            }).map((item) => <NodeItem key={item.id} id={item.id} dispatchContentAction={dispatchContentAction} {...item.attributes}/>)
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
            onSuccess={data => dispatchContentAction({ type: 'add', data: data })}
          />
        </>
      ) : (
        <p>
          Don't see what you're looking for?
          <button onClick={() => setShowNodeAdd(true)}>Add a node</button>
        </p>
      )}
    </div>
  );
};

export default NodeReadWrite;
