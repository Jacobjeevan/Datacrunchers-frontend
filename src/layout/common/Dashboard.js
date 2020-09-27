import React, { Component } from "react";
import Officers from "../components/Officers";
import { Switch, Route } from "react-router-dom";
import "../../css/dashboard.css";
import Container from "react-bootstrap/Container";
import EventDashboard from "./EventDashboard";
import ProjectDashboard from "./ProjectDashboard";
import CareerDashboard from "./CareerDashboard";
import ResourceDashboard from "./ResourceDashboard";

export default class Dashboard extends Component {
  render() {
    return (
      <Container className="dashboard">
        <div className="dashboard-body">
          <Switch>
            <Route exact path="/">
              <Officers />
            </Route>
            <Route path="/events">
              <EventDashboard />
            </Route>
            <Route path="/projects">
              <ProjectDashboard />
            </Route>
            <Route path="/career-prep">
              <CareerDashboard />
            </Route>
            <Route path="/resources">
              <ResourceDashboard />
            </Route>
          </Switch>
        </div>
      </Container>
    );
  }
}
