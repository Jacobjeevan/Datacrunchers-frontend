import React, { useContext } from "react";
import Resourcesform from "./Resourcesform";
import {
  useGetResources,
  addResource,
  deleteResource,
  updateResource,
} from "./resourcesAPI";
import "./resources.css";
import { useState } from "react";
import { mutate } from "swr";
import LinkButton from "../common/LinkButton";
import { useRouteMatch } from "react-router-dom";
import { AuthContext } from "../Auth/Auth";
import { ToastAlerts } from "../Main/Notifications";

const defaultFormValues = {
  title: "",
  description: "",
};

const defaultFormDisplay = {
  createForm: false,
  editForm: false,
};

export default function Resources() {
  const { isAuthenticated } = useContext(AuthContext);
  const [displayForm, setdisplayForm] = useState(defaultFormDisplay);
  const [formValues, setformValues] = useState(defaultFormValues);
  const { isLoading, data, error } = useGetResources();
  let { url } = useRouteMatch();

  if (isLoading) {
    return <span>Loading...</span>;
  }

  if (error) {
    return <span>Error</span>;
  }

  function toggleCreateForm() {
    setdisplayForm((old) => ({ ...old, createForm: !displayForm.createForm }));
  }

  function toggleEditForm(keepOpened = true) {
    if (displayForm.editForm & keepOpened) return;
    setdisplayForm((old) => ({ ...old, editForm: !displayForm.editForm }));
  }

  async function handleDelete(id) {
    let data = await deleteResource(id);
    ToastAlerts(data);
    mutate("resourceData");
  }

  async function handleAdd(formValues) {
    let data = await addResource(formValues);
    ToastAlerts(data);
    mutate("resourceData");
  }

  async function handleEdit(formValues) {
    let data = await updateResource(formValues);
    ToastAlerts(data);
    mutate("resourceData");
    toggleEditForm(false);
  }

  function handleEditButton(resource) {
    setformValues({
      id: resource._id,
      title: resource.title,
      description: resource.description,
    });
    toggleEditForm();
  }

  return (
    <div>
      <h2 className="component-title">Resources</h2>
      {isAuthenticated() && (
        <button onClick={toggleCreateForm} className="submitBtn">
          Add Resource
        </button>
      )}

      {isAuthenticated() && displayForm.createForm ? (
        <Resourcesform toggle={toggleCreateForm} onSubmit={handleAdd} />
      ) : null}
      {isAuthenticated() && displayForm.editForm ? (
        <Resourcesform
          toggle={toggleEditForm.bind(null, false)}
          onSubmit={handleEdit}
          initialFormValues={formValues}
        />
      ) : null}

      <div className="resource-container">
        {data.map((resource) => (
          <div key={resource._id} className="resource">
            <div className="resource-meta">
              <div className="resource-title">{resource.title}</div>
            </div>
            <div className="cardBtn-container">
              <LinkButton
                to={`${url}/${resource._id}`}
                className="viewBtn cardBtn"
              >
                View Details
              </LinkButton>
              {isAuthenticated() && (
                <div className="adminBtn-container">
                  <button
                    className="editBtn cardBtn"
                    onClick={handleEditButton.bind(this, resource)}
                  >
                    Edit
                  </button>
                  <button
                    onClick={handleDelete.bind(this, resource._id)}
                    className="deleteBtn cardBtn"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
