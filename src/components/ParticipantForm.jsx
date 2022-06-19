import React, {useState} from "react";
import { getAuthClient } from '../utils/auth';
import serverConfig from "../config/config";

const auth = getAuthClient();

const ParticipantForm = ({id, drupal_internal__nid}) => {

  const [isSubmitting, setSubmitting] = useState(false);

  const [result, setResult] = useState({
    success: null,
    error: null,
    message: '',
  });

/*  const defaultValues = {
    title: title ? title : '',
    field_eventdate: field_eventdate ? field_eventdate : now.toAPI(),
  };

  const [startDate, setStartDate] = useState(new Date(defaultValues.field_eventdate));

  const [values, setValues] = useState(defaultValues);*/

  /*const handleInputChange = (event) => {
    const {name, value} = event.target;
    setValues({...values, [name]: value});
  };*/

  const handleSubmit = (event) => {
    setSubmitting(true);
    event.preventDefault();

/*    const fetchUrl = id ? `/jsonapi/node/event/${id}` : `/jsonapi/node/event`;

    let data = {
      "data": {
        "type": "node--event",
        "attributes": {
          "title": `${values.title}`,
          "field_eventdate": `${startDate.toAPI()}`
        }
      }
    };

    const fetchOptions = {
      // Use HTTP PATCH for edits, and HTTP POST to create new events.
      method: 'POST',
      headers: new Headers({
        'Accept': 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
        'Cache': 'no-cache',
        'Access-Control-Allow-Origin': '*'
      }),
      body: JSON.stringify(data),
    };

    try {
      auth.fetchWithAuthentication(fetchUrl, fetchOptions)
        .then((response) => response.json())
        .then((data) => {
          // We're done processing.
          setSubmitting(false);

          // If there are any errors display the error and return early.
          if (data.errors && data.errors.length > 0) {
            setResult({
              success: false,
              error: true,
              message: <div className="messages messages--error">{data.errors[0].title}: {data.errors[0].detail}</div>,
            });
            return false;
          }

          // If the request was successful, remove existing form values and
          // display a success message.
          setValues(defaultValues);
          if (data.data.id) {
            setResult({
              success: true,
              message: <div className="messages messages--status">{(id ? 'Updated' : 'Added')}: <em>{data.data.attributes.title}</em></div>,
            });

            if (typeof onSuccess === 'function') {
              onSuccess(data.data);
            }
          }
        })
        .catch((error) => {
          console.log('Error while contacting API', error);
          setSubmitting(false);
        });
    } catch (error) {
      console.log('Error while contacting API', error);
      setSubmitting(false);
    }*/
  };

  // If the form is currently being processed display a spinner.
  if (isSubmitting) {
    return (
      <div>
        Processing ...
      </div>
    )
  }

  return (
    <div>
      {(result.success || result.error) &&
        <div>
          <h2>{(result.success ? 'Success!' : 'Error')}:</h2>
          {result.message}
        </div>
      }
      <form onSubmit={handleSubmit}>
        <input
          name="first_name"
          type="text"
          placeholder="First Name"
        />
        <br/>
        <input
          name="last_name"
          type="text"
          placeholder="Last Name"
        />
        <br/>
        <input
          name="email"
          type="text"
          placeholder="Email"
        />
        <br/>
        <input
          name="interests"
          type="text"
          placeholder="Interests"
        />
        <br/>
        <input
          name="submit"
          type="submit"
          value={'Submit'}
        />
      </form>
    </div>
  )
};

export default ParticipantForm;
