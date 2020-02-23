import _ from 'lodash';
import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import clsx from 'clsx';
import Modal from '../Modal';
import { Column } from '../../types';
import { fieldType, fieldTypeMapping } from '../../constant';

interface ConfigModalProps {
  open: boolean;
  onClose: () => void;
  data: Column | null;
}

const useStyles = makeStyles((theme) => ({
  button: {
    margin: `0px ${theme.spacing()}px`
  }
  // nextButton: {
  //   color: 'white',
  //   backgroundColor: '#30475e'
  // }
}));

const ConfigModal: React.FC<ConfigModalProps> = ({ open, onClose, data }) => {
  const classes = useStyles();
  const [state, setState] = useState(data);

  useEffect(() => {
    setState(data);
  }, [data]);

  if (state === null) {
    return null;
  }

  console.log({ state, data });

  const generateDefaultValue = (type: fieldType) => {
    switch (type) {
      case fieldType.BOOLEAN:
        return (
          <TextField
            select
            label="Default value"
            helperText="The default value for this column"
            variant="outlined"
            value={state.defaultValue === '' ? '' : (state.defaultValue as boolean) ? 1 : 0}
            onChange={({ target }) =>
              setState({
                ...state,
                defaultValue: Boolean(target.value)
              })
            }
            fullWidth
          >
            <MenuItem value={1}>Yes</MenuItem>
            <MenuItem value={0}>No</MenuItem>
          </TextField>
        );
      case fieldType.NUMBER:
        const isError = state.defaultValue !== '' && _.isNaN(Number(state.defaultValue));
        return (
          <TextField
            label="Default value"
            helperText={isError ? 'The value must be a number' : 'The default value for this column'}
            variant="outlined"
            value={state.defaultValue}
            onChange={({ target }) =>
              setState({
                ...state,
                defaultValue: target.value
              })
            }
            fullWidth
            error={isError}
          />
        );
      case fieldType.STRING:
        return (
          <TextField
            label="Default value"
            helperText="The default value for this column"
            variant="outlined"
            value={state.defaultValue as string}
            onChange={({ target }) =>
              setState({
                ...state,
                defaultValue: target.value
              })
            }
            fullWidth
          />
        );
      default:
        return null;
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Column config"
      buttons={
        <>
          <Button className={classes.button} onClick={onClose}>
            Cancel
          </Button>
          <Button className={classes.button} variant="contained" color="primary">
            Save
          </Button>
          {/* <Button className={clsx(classes.button, classes.nextButton)} variant="contained">
            Save and next
          </Button> */}
        </>
      }
    >
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <TextField
            label="Name"
            variant="outlined"
            helperText="Type a name for this column"
            value={state.name}
            onChange={({ target }) =>
              setState({
                ...state,
                name: target.value
              })
            }
            fullWidth
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            select
            label="Type"
            helperText="Select a type for this column"
            variant="outlined"
            value={state.type}
            onChange={({ target }) =>
              setState({
                ...state,
                type: target.value as fieldType,
                defaultValue: ''
              })
            }
            fullWidth
          >
            {_.map(fieldType, (type) => (
              <MenuItem key={type} value={type}>
                {fieldTypeMapping[type]}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12}>
          {generateDefaultValue(state.type)}
        </Grid>
      </Grid>
    </Modal>
  );
};

export default ConfigModal;
