export const Wrap = props => {
  return (
    <Crud
      modelName="volunteers"
      SERVER={config.SERVER}
      offlineStorage={{
        getItem: () => {
          return new Promise((resolve, reject) => {
            resolve("resolved");
          });
        },
        setItem: () => {
          return new Promise((resolve, reject) => {
            resolve("resolved");
          });
        }
      }}
      notificationDomainStore={rootStore.notificationDomainStore}
      crudDomainStore={rootStore.crudDomainStore}
    >
      <Notification notificationDomainStore={rootStore.notificationDomainStore}>
        <MainWrapper
          routeList={routeList}
          classes={{}}
          {...props}
        ></MainWrapper>
      </Notification>
    </Crud>
  );
};
