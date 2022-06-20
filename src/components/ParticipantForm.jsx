import React, {useState} from "react";
import serverConfig from "../config/config";

const serverConfiguration = serverConfig();

const ParticipantForm = ({id}) => {
  const [isSubmitting, setSubmitting] = useState(false);

  const [result, setResult] = useState({
    success: null,
    error: null,
    message: '',
  });

  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [interests, setInterests] = useState('');

  const handleSubmit = (event) => {
    setSubmitting(true);
    event.preventDefault();

    const fetchUrl = serverConfiguration.base + `/jsonapi/participant/event_participant`; // TBD: use ECK instead Node
    //const fetchUrl = serverConfiguration.base + `/jsonapi/node/participant`;

    let data = {
      "data": {
        "type": "participant--event_participant",
        "attributes": {
          "field_event": `${id}`,
          "field_first_name": `${first_name}`,
          "field_last_name": `${last_name}`,
          "field_email": `${email}`,
          "field_interests": `${interests}`
        }
      }
    };
    const fetchOptions = {
      // HTTP POST to create new events.
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
      fetch(fetchUrl, fetchOptions)
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
          else {
            setResult({
              success: true,
              message: <div className="messages messages--status">Your participation request was sent!</div>,
            });
          }
        })
        .catch((error) => {
          console.log('Error while contacting API', error);
          setSubmitting(false);
        });
    } catch (error) {
      console.log('Error while contacting API', error);
      setSubmitting(false);
    }
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
          onChange={(e) => setFirstName(e.target.value)}
        />
        <br/>
        <input
          name="last_name"
          type="text"
          placeholder="Last Name"
          onChange={(e) => setLastName(e.target.value)}
        />
        <br/>
        <input
          name="email"
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <br/>
        <input
          name="interests"
          type="text"
          placeholder="Interests"
          onChange={(e) => setInterests(e.target.value)}
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
