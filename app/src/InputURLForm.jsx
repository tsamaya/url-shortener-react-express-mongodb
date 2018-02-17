import React from 'react';
import { Button, Control, Field, Input } from 'reactbulma';
import FontAwesome from 'react-fontawesome';
import './InputURLForm.css';

class InputURLForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: '' };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInputClick = this.handleInputClick.bind(this);
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  handleInputClick(event) {
    console.log(`Input value: ${this.state.value}`); // eslint-disable-line
    event.target.select();
  }

  handleSubmit(event) {
    console.log(`A url was submitted: ${this.state.value}`); // eslint-disable-line
    event.preventDefault();
  }

  render() {
    return (
      <form className="URLForm">
        <Field>
          <label className="label" htmlFor="url">
            <Control>
              <Input
                type="text"
                id="url"
                className="is-medium"
                placeholder="Paste a link..."
                value={this.state.value}
                onChange={this.handleChange}
                onClick={this.handleInputClick}
                autoComplete="off"
              />
            </Control>
            {/* <p className="help">This is a help text</p> */}
          </label>
        </Field>
        <Button className="is-medium" onClick={this.handleSubmit}>
          <FontAwesome name="link" />&nbsp;SHORTEN
        </Button>
      </form>
    );
  }
}

export default InputURLForm;
