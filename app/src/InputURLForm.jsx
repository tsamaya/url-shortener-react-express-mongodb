import React from 'react';
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
      <form onSubmit={this.handleSubmit}>
        <label htmlFor="url">
          Long URL
          <input
            type="text"
            id="url"
            value={this.state.value}
            onChange={this.handleChange}
            onClick={this.handleInputClick}
            autoComplete="off"
          />
        </label>
        <span className="input-group-btn">
          <button
            className="btn btn-shorten"
            type="button"
            onClick={this.handleSubmit}
          >
            SHORTEN
          </button>
        </span>
      </form>
    );
  }
}

export default InputURLForm;
