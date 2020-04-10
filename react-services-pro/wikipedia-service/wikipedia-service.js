import React from "react";
import {
  generateDomainStore,
  getServiceInjector,
  getServiceHOC,
} from "../service-service/service-service";
import axios from "axios";

const testHtml = (title) => {
  var expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
  var regex = new RegExp(expression);
  return title && title.match(regex);
};

export const Wikipedia = ({
  children,
  notificationDomainStore,
  offlineStorage,
  SERVER,
  transform,
  ...rest
}) => {
  const modelName = "wikipedia";
  const myActions = (props) => {
    return {
      wikipediaFetchModel: () => {
        return props.self.state;
      },
      fetchPageByTopic: (topic) => {
        console.log("topic", topic, "HELLO");
        return offlineStorage.getItem("jwtToken").then((token) => {
          return axios({
            url: `${SERVER.wikipedia.host}`,
            method: "get",
            params: {
              action: "opensearch",
              format: "json",
              search: topic,
              origin: "*",
            },
          })
            .then((res) => {
              return transform
                ? props.self.setSuccess(transform(res.data))
                : props.self.setSuccess(
                    res.data
                      .map((d) => {
                        if (Array.isArray(d)) {
                          if (testHtml(d[0])) {
                            return d;
                          }
                        }
                        return;
                      })
                      .filter((d) => d)[0],
                    "Query successfully run"
                  );
            })
            .catch((err) => {
              return props.self.setError(err);
            });
        });
      },
      fetchImagesByTopic: (topic) => {
        return offlineStorage.getItem("jwtToken").then((token) => {
          return axios({
            url: `${SERVER.wikimedia.host}`,
            method: "get",
            params: {
              action: "query",
              prop: "images",
              format: "json",
              origin: "*",
              imlimit: 500,
              redirects: 1,
              titles: topic,
            },
          })
            .then((res) => {
              return Object.keys(res.data.query.pages).map((pageKey) => {
                const page = res.data.query.pages[pageKey];
                return page.images.map(
                  (image) =>
                    `https://commons.wikimedia.org/wiki/Special:FilePath/ ${image.title}`
                );
              })[0];
            })
            .catch((err) => {
              return props.self.setError(err);
            });
        });
      },
    };
  };
  const getWikipediaDomainStore = generateDomainStore({
    modelName,
    myActionGenerator: myActions,
  });
  const domainStore = getWikipediaDomainStore({
    notificationDomainStore,
    offlineStorage,
    SERVER,
    transform,
  });
  const WikipediaServiceInjector = getServiceInjector({
    modelName,
    domainStore,
    myActions: myActions(),
  });
  const WikipediaHOC = getServiceHOC({
    modelName,
    domainStore,
    serviceInjector: WikipediaServiceInjector,
    children,
  });
  return <WikipediaHOC {...rest} />;
};
