import React from "react";
import theme from "Theme";
import PropTypes from "prop-types";
import Autosuggest from "react-autosuggest";
import match from "autosuggest-highlight/match";
import parse from "autosuggest-highlight/parse";
import { styles } from "./Autocomplete.styles";
import { withStyles } from "@material-ui/styles";
import { throttle } from "lodash";
import { MenuItem, Paper } from "@material-ui/core";
import * as Inputs from"../Forms/Inputs";

function renderInputComponent(inputProps) {
  const {
    classes,
    inputRef = () => {},
    inputClassName,
    ref,
    ...other
  } = inputProps;
  return (
    <Inputs.TextFieldInput
      fullWidth
      field={{ name: "" }}
      standAlone={true}
      value={"Type"}
      InputProps={{
        inputRef: node => {
          ref(node);
          inputRef(node);
        }
      }}
      {...other}
    />
  );
}

function renderSuggestion(suggestion, { query, isHighlighted }) {
  const matches = match(suggestion.name || suggestion.title, query);
  const parts = parse(suggestion.name || suggestion.title, matches);
  return (
    <MenuItem selected={isHighlighted} component="div">
      <div>
        {parts.map((part, index) =>
          part.highlight ? (
            <span key={String(index)} style={{ fontWeight: 500 }}>
              {part.text}
            </span>
          ) : (
            <strong key={String(index)} style={{ fontWeight: 300 }}>
              {part.text}
            </strong>
          )
        )}
      </div>
    </MenuItem>
  );
}

function getSuggestionValue(suggestion) {
  return suggestion.name || suggestion.title;
}

function renderSectionTitle(section) {
  return <strong>{section.modelName}</strong>;
}

function getSectionSuggestions(section) {
  return section.res;
}

class Autocomplete extends React.Component {
  state = {
    single: "",
    popper: "",
    suggestions: []
  };

  handleSuggestionsFetchRequested = ({ value }) => {
    const { loadSuggestions, isMultiple } = this.props;
    return loadSuggestions(value).then(res => {
      this.setState({ suggestions: res });
    });
  };

  handleSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  handleChange = name => (event, { newValue }) => {
    this.setState({
      [name]: newValue
    });
  };

  render() {
    const {
      classes,
      isMultiple,
      onSelect,
      placeholder,
      inputClassName,
      throttleSearch
    } = this.props;

    if (throttleSearch) {
      this.handleSuggestionsFetchRequested = throttle(
        this.handleSuggestionsFetchRequested.bind(this),
        500
      );
    }

    const autosuggestProps = {
      renderInputComponent,
      suggestions: this.state.suggestions,
      onSuggestionsFetchRequested: this.handleSuggestionsFetchRequested,
      onSuggestionsClearRequested: this.handleSuggestionsClearRequested,
      getSuggestionValue,
      renderSuggestion
    };
    return (
      <Autosuggest
        className={inputClassName}
        {...autosuggestProps}
        inputProps={{
          classes,
          placeholder: placeholder ? placeholder : "Search",
          value: this.state.single,
          onChange: this.handleChange("single")
        }}
        theme={{
          container: inputClassName ? inputClassName : classes.container,
          suggestionsContainerOpen: classes.suggestionsContainerOpen,
          suggestionsList: classes.suggestionsList,
          suggestion: classes.suggestion
        }}
        multiSection={isMultiple}
        getSectionSuggestions={getSectionSuggestions}
        renderSectionTitle={renderSectionTitle}
        renderSuggestionsContainer={options => (
          <Paper {...options.containerProps} square>
            {options.children}
          </Paper>
        )}
        onSuggestionSelected={(
          event,
          { suggestion, suggestionValue, suggestionIndex, sectionIndex, method }
        ) => {
          onSelect(suggestion);
        }}
      />
    );
  }
}

Autocomplete.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles, { defaultTheme: theme })(Autocomplete);
