import React from "react";
import Eventsform from "./private/Eventsform";
import {
  useGetEvents,
  addEvent,
  deleteEvent,
  updateEvent,
} from "../../api/events";
import "../../css/events.css";
import { useState } from "react";
import { mutate } from "swr";
import { useAuth0 } from "@auth0/auth0-react";

const defaultFormValues = {
  title: "",
  description: "",
  location: "",
  date: "",
};

const defaultFormDisplay = {
  createForm: false,
  editForm: false,
};

export default function Events() {
  const { isAuthenticated, getAccessTokenSilently, user } = useAuth0();
  const [displayForm, setdisplayForm] = useState(defaultFormDisplay);
  const [formValues, setformValues] = useState(defaultFormValues);
  const { isLoading, data, error } = useGetEvents();

  let token;

  async function getToken() {
    try {
      console.log(user);
      token = await getAccessTokenSilently({
        audience: process.env.REACT_APP_audience,
      });
    } catch (err) {
      console.log(err);
    }
  }

  if (isAuthenticated) {
    getToken();
  }

  if (isLoading) {
    return <span>Loading...</span>;
  }

  if (error) {
    return <span>Error: {error}</span>;
  }

  function toggleCreateForm() {
    setdisplayForm((old) => ({ ...old, createForm: !displayForm.createForm }));
  }

  function toggleEditForm(keepOpened = true) {
    if (displayForm.editForm & keepOpened) return;
    setdisplayForm((old) => ({ ...old, editForm: !displayForm.editForm }));
  }

  async function handleDelete(id) {
    await deleteEvent(id, token);
    mutate("eventData");
  }

  async function handleAdd(formValues) {
    await addEvent(formValues, token);
    mutate("eventData");
  }

  async function handleEdit(formValues) {
    await updateEvent(formValues, token);
    mutate("eventData");
    toggleEditForm(false);
  }

  function handleEditButton(event) {
    let date = getDateInFormat(event.date);
    setformValues({
      id: event._id,
      title: event.title,
      description: event.description,
      location: event.location,
      date,
    });
    toggleEditForm();
  }

  function getDateInFormat(date) {
    let givenDate = new Date(date);
    let month = givenDate.getMonth();
    let year = givenDate.getFullYear();
    let day = givenDate.getUTCDate();
    givenDate = month + "/" + day + "/" + year;
    return givenDate;
  }

  return (
    <div>
      {isAuthenticated && (
        <button onClick={toggleCreateForm} className="submitBtn">
          Add Event
        </button>
      )}

      {isAuthenticated && displayForm.createForm ? (
        <Eventsform toggle={toggleCreateForm} onSubmit={handleAdd} />
      ) : null}
      {isAuthenticated && displayForm.editForm ? (
        <Eventsform
          toggle={toggleEditForm.bind(null, false)}
          onSubmit={handleEdit}
          initialFormValues={formValues}
        />
      ) : null}

      <div className="event-container">
        {data.map((event) => (
          <div key={event._id} className="event">
            <div className="event-meta">
              <div className="event-title">{event.title}</div>
              <div className="event-description">{event.description}</div>
              <div className="event-location">{event.location}</div>
              <div className="event-date">
                {new Date(event.date).toDateString()}
              </div>
            </div>
            {isAuthenticated && (
              <div className="cardBtn-container">
                <button
                  className="editBtn cardBtn"
                  onClick={handleEditButton.bind(this, event)}
                >
                  Edit
                </button>
                <button
                  onClick={handleDelete.bind(this, event._id)}
                  className="deleteBtn cardBtn"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
