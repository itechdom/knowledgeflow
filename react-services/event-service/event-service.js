import React from "react";
import { Crud } from "../crud-service/crud-service";
import { RRule } from "rrule";
import moment from "moment";

let getRecurringInstances = event => {
  if (event) {
    return event.map(ev => {
      if (ev.recurringRule) {
        if (typeof ev.recurringRule === "string") {
          let recurringRule = RRule.fromString(ev.recurringRule);
          ev.recurringRuleValue = recurringRule.toText();
          ev.instances = recurringRule.all();
        }
      }
      return ev;
    });
  }
  return event;
};
let saveRecurringRule = event => {
  if (event.isRecurring) {
    let recurringRule = new RRule({
      freq: RRule[event.recurringRule],
      dtstart: moment(event.startDateTime)
        .utc()
        .toDate(),
      until: moment(event.endDateTime)
        .utc()
        .toDate()
    });
    event.recurringRule = recurringRule.toString();
    return event;
  }
  return event;
};

const injectProps = (props, child) => {
  let {
    events_getModel,
    events_createModel,
    events_updateModel,
    events_deleteModel
  } = props;
  let injected = {
    ...props,
    ...child.props,
    events_getModel: query =>
      events_getModel(query, data => {
        getRecurringInstances(data);
      }),
    events_createModel: event => {
      events_createModel(saveRecurringRule(event));
    },
    events_updateModel: (event, updateValues) =>
      events_updateModel(event, updateValues),
    events_deleteModel: event => events_deleteModel(event)
  };
  return injected;
};

export class Event extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {}
  componentWillReceiveProps() {}
  render() {
    let { children } = this.props;
    const childrenWithProps = React.Children.map(children, child => {
      let injectedProps = injectProps(this.props, child);
      return React.cloneElement(child, injectedProps);
    });
    return <>{childrenWithProps}</>;
  }
}

export const EventWithCrud = ({ crudDomainStore, ...props }) => {
  return (
    <Crud
      crudDomainStore={crudDomainStore}
      modelName="events"
      transform={data => {
        console.log("data", data);
        return getRecurringInstances(data);
      }}
    >
      <Event {...props} />
    </Crud>
  );
};
