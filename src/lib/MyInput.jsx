import React from 'react';
import { useInput } from './Form';

/** @typedef {React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>} InputAttributes */

/**
 * @typedef PropsI
 * @property {string} label
 * @property {string} name
 */

/**
 * @param {InputAttributes & PropsI} props
 */
const MyInput = ({ name, label, onBlur, ...rest }) => {
  const { value, setValue, error, validate } = useInput(name);

  /** @param {React.ChangeEvent<HTMLInputElement>} event */
  function handleChange(event) {
    if (!event.target || !(event.target instanceof HTMLInputElement)) {
      return;
    }

    setValue(event.target.value);

    // validate on input change only if there is an existing error
    if (!error) {
      return;
    }

    validate(event.target);
  }

  /** @param {React.FocusEvent<HTMLInputElement, Element>} event */
  function handleBlur(event) {
    if (!event.target || !(event.target instanceof HTMLInputElement)) {
      return;
    }

    if (onBlur) {
      onBlur(event);
    }

    validate(event.target);
  }

  return (
    <label
      style={{
        display: 'flex',
        gap: '6px',
        flexDirection: 'column',
        width: '400px',
      }}
    >
      {label}
      <input
        name={name}
        value={value || ''}
        onChange={handleChange}
        onBlur={handleBlur}
        {...rest}
      />
      {error && (
        <p style={{ color: 'darkred', margin: 0, padding: 0 }}>{error}</p>
      )}
    </label>
  );
};

export default MyInput;
