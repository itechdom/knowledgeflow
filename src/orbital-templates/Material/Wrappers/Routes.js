import React from "react";
import { ListItem, ListItemText } from "@material-ui/core";
const Icon = ({ children, style }) => {
  return (
    <i className="material-icons" style={style}>
      {children}
    </i>
  );
};

export const Routes = ({ onClick, currentRoute, routeList, classes }) => {
  return (
    <React.Fragment>
      {routeList.map((route, index) => {
        return (
          <ListItem
            style={{ borderRadius: "50px" }}
            selected={index === currentRoute}
            key={index}
            onClick={(event) => (!route.external ? onClick(route) : "")}
            button={route.type === "button"}
            component={route.type === "button" ? "button" : "a"}
            className={
              route.type === "button"
                ? classes.buttonListitem
                : classes.listItem
            }
          >
            <>
              <Icon style={{ marginRight: "10px" }}>{route.icon}</Icon>
              {!route.external ? (
                <ListItemText primary={route.name} />
              ) : (
                <a href={route.url} target="_blank">
                  <ListItemText primary={route.name} />
                </a>
              )}
            </>
          </ListItem>
        );
      })}
    </React.Fragment>
  );
};
