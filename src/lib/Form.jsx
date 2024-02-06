import React, { createContext, useState, useContext } from 'react';
import hasError from './hasError';

/** @typedef {string | number | readonly string[] | undefined} FormValue */

/**
 * @typedef FormContextValueI
 * @property {Record<string, FormValue>} values
 * @property {Record<string, string>} errors
 * @property {React.Dispatch<React.SetStateAction<Record<string, FormValue>>>} setValues
 * @property {React.Dispatch<React.SetStateAction<Record<string, string>>>} setErrors
 * @property {Record<string, (value: FormValue, formValues?: Record<string, FormValue>) => string>} validators
 * @property {boolean} isValid
 * */

/** @type {React.Context<FormContextValueI>} */
const formContext = createContext({
  values: {},
  setValues: (values) => {},
  errors: {},
  setErrors: (errors) => {},
  validators: {},
  isValid: true,
});

export const useForm = () => useContext(formContext);

/**
 * @param {string} inputName
 */
export const useInput = (inputName) => {
  const { values, setValues, errors, setErrors, validators } = useForm();

  /** @param {FormValue} value */
  const setValue = (value) => {
    setValues((prev) => ({ ...prev, [inputName]: value }));
  };
  /** @param {string} error */
  const setError = (error) => {
    setErrors((prev) => ({ ...prev, [inputName]: error }));
  };

  const error = errors[inputName];
  const value = values[inputName];

  const validator = validators[inputName] || function () {};

  /** @param {HTMLInputElement} inputElement */
  const validate = (inputElement) => {
    const error =
      validator(inputElement.value, values) || hasError(inputElement);
    setError(error);
  };

  return { setValue, value, error, validate };
};

/** @type {Record<string, FormValue>} */
const initialValues = {};
/** @type {Record<string, string>} */
const initialErrors = {};

/** @typedef {React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>} FormAttributes */

/**
 * @typedef FormPropsI
 * @property {React.ReactNode} children
 * @property {(values: Record<string, FormValue>) => void} onSubmit
 * @property {Record<string, (value: FormValue, formValues?: Record<string, FormValue>) => string>} validators
 */

/**
 * @param {FormAttributes & FormPropsI} props
 */
const Form = ({
  children,
  onSubmit,
  validators,
  noValidate = true,
  ...rest
}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState(initialErrors);

  /** @param {React.FormEvent<HTMLFormElement>} event */
  const handleSubmit = (event) => {
    event.preventDefault();

    /** @type {Record<string, string>} */
    const newErrors = {};

    // @ts-ignore
    event.target.querySelectorAll('input').forEach((inputEl) => {
      const validator = validators[inputEl.name] || function () {};

      const error = validator(inputEl.value, values) || hasError(inputEl);

      if (!error) {
        return;
      }
      if (Object.values(newErrors).every((err) => !err)) {
        inputEl.focus();
      }

      newErrors[inputEl.name] = error;
    });

    setErrors(newErrors);

    if (Object.values(newErrors).some((err) => Boolean(err))) {
      return;
    }

    onSubmit(values);
  };

  return (
    <formContext.Provider
      value={{
        values,
        setValues,
        errors,
        setErrors,
        validators,
        isValid: Object.values(errors).every((err) => !err),
      }}
    >
      <form onSubmit={handleSubmit} noValidate={noValidate} {...rest}>
        {children}
      </form>
    </formContext.Provider>
  );
};

export default Form;
