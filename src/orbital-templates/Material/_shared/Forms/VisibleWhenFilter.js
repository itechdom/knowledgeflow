export const visibleWhenFilter = (field, visibleKeys, criterias, values) => {
  const makeADecision = (fieldValue, criteria) => {
    if (fieldValue === undefined) {
      return !criteria;
    } else {
      return fieldValue === criteria;
    }
  };

  let decisions = visibleKeys.map((vKey, index) => {
    //what to do when values is undefined
    if (field && field[vKey]) {
      if (Array.isArray(field[vKey])) {
        let falseDecisionArray = field[vKey]
          .map(visibleWhenKey => {
            return values[visibleWhenKey];
          })
          .map(fieldValue => {
            let d = makeADecision(fieldValue, criterias[index]);
            return d;
          })
          .filter(fieldValue => fieldValue === false);
        if (falseDecisionArray.length > 0) {
          return false;
        }
        return true;
      } else {
        let visibleWhenKey = field[vKey];
        let d = makeADecision(values[visibleWhenKey], criterias[index]);
        return d;
      }
    }
    return true;
  });
  return decisions.filter(d => d === false);
};