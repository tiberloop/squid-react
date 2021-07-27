import React, { useState } from 'react'
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import  { getUsersList } from 'utils/apiHelper';
import { makeStyles } from "@material-ui/core/styles";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

interface ISearchBarParams {
  theme: string
}

function SearchBar(props: ISearchBarParams) {

  const [myOptions, setMyOptions] = useState<string[]>([]);
  // so so ugly
  const themeStyles = props.theme === "dark" ?  {
                                                  optionFontColor: "#fff",
                                                  optionFontColorSecondary: "#666666",
                                                  optionBackgroundColor: "var(--bg-dark-mode-contrast)",
                                                  optionHover: "#fff",
                                                  optionFocused: "gray"
                                              }
                                              : {
                                                optionFontColor: "#000",
                                                optionFontColorSecondary: "#bbbbbb",
                                                optionBackgroundColor: "#000",
                                                optionHover: "#555",
                                                optionFocused: "#000"
                                              }
  /** creates the MUI styles for the AutoComplete component
   * The docs are a little confusing: https://material-ui.com/api/autocomplete/ */
  const useAutocompleteStyles = makeStyles((theme) => ({
    root: {
      '&$focused $clearIndicatorDirty': {
        visibility: 'visible',
      },
      /* Avoid double tap issue on iOS */
      '@media (pointer: fine)': {
        '&:hover $clearIndicatorDirty': {
          visibility: 'visible',
        },
      },      
    },
    inputRoot: {
      color: themeStyles.optionFontColor,
      // some of this matches default styles at https://github.com/mui-org/material-ui/blob/v4.11.3/packages/material-ui-lab/src/Autocomplete/Autocomplete.js#L90
      '&[class*="MuiOutlinedInput-root"] .MuiAutocomplete-input:first-child': {
        // Default left padding is 6px
        padding: 0,
        innerHeight: 0
      },
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: themeStyles.optionFontColorSecondary
      },
      "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: themeStyles.optionHover
      },
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: themeStyles.optionFocused
      },
      "& .MuiAutocomplete-root": {
        innerWidth: 1
      },
      "& .MuiAutocomplete-tagSizeSmall": {
        innerHeight: 0
      },
      "& .MuiInputLabel-MarginDense": {
        marginTop: 0
      }
    },
    /* Styles applied to the input element. */
    input: {
      flexGrow: 1,
      textOverflow: 'ellipsis',
      fontSize: 'small',
      label: {
        fontSize: "40px",
        color: "white"
      }
    },
    option: {
      minHeight: 32,
      display: 'flex',
      justifyContent: 'flex-start',
      flexDirection: 'row',
      alignItems: 'center',
      cursor: 'pointer',
      boxSizing: 'border-box',
      outline: '0',
      WebkitTapHighlightColor: 'transparent',
      paddingTop: 3,
      paddingBottom: 3,
      paddingLeft: 16,
      paddingRight: 16,
      fontSize: "0.9em",
      color: themeStyles.optionFontColor,
      backgroundColor: themeStyles.optionBackgroundColor,
      [theme.breakpoints.up('sm')]: {
        minHeight: 'auto',
      },
      '&[aria-selected="true"]': {
        backgroundColor: theme.palette.action.selected,
      },
      '&[data-focus="true"]': {
        backgroundColor: "gray",
      },
      '&:active': {
        backgroundColor: theme.palette.action.selected,
      },
      '&[aria-disabled="true"]': {
        opacity: theme.palette.action.disabledOpacity,
        pointerEvents: 'none',
      },
    },
  }));
  const autocompleteClasses = useAutocompleteStyles();

  const labelOffset = -6; // necessary to center default label text
  /** creates the MUI styles for the TextField and child Label component
   * Again, the docs are a little confusing: https://material-ui.com/components/text-fields/#textfield */
  const useLabelStyles = makeStyles(() => ({
    textField: {
      marginTop: 0
    },
    inputLabel: {
      color: themeStyles.optionFontColorSecondary,
      height: 8,      
      // necessary explicit typing when the TextField is changed to focus due to the Label margin issue
      top: `${labelOffset}px`,
      // updates the color on focus (click) and resets margin when label moves to outline of input box
      "&.focused": {
        color: themeStyles.optionFontColor,
        top: 0
      }
    }
  }));
  const labelClasses = useLabelStyles();

  /** Function that calls the API at every keystroke and rerenders the component with the updated `myOptions` */
  const getDataFromAPI = () => {
    console.log("Users Fetched from API")

    // TODO: performance enhancements. currently not smooth/immediately responsive
    getUsersList().then((response) => {
        console.log(response)
        var results: string[] = [];
        for (var i = 0; i < response.length; i++) {
          setMyOptions([]);
          results.push(response[i].username);
          results.push(response[i].real_name);
        }
        
        setMyOptions(results)
        console.log(myOptions)
    })
  }

  return (
    <div className="w-2/6 inline-block" >
      <Autocomplete
        classes={autocompleteClasses}
        freeSolo
        autoComplete
        autoHighlight
        selectOnFocus
        clearOnBlur
        handleHomeEndKeys
        size="small"
        options={myOptions}
        renderInput={(params) => (
          <div className="flex flex-row items-center">
            <TextField {...params}
              InputLabelProps={{classes: {
                root: labelClasses.inputLabel,
                focused: "focused",
              }}}
              onChange={getDataFromAPI}
              variant="outlined"
              label="Find users, channels, messages..."
              margin="dense"
              
            />
            <span className="pl-2 pt-0.5">
              <FontAwesomeIcon icon={faSearch}/>
            </span>
            </div>
        
        )}
          
      />
    </div>
  );
}

export default SearchBar
