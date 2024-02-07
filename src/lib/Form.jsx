import React, { createContext, useContext, useMemo } from 'react';
import hasError from './hasError';

/** @typedef {string | number | readonly string[] | undefined} FormValue */
/** @typedef {Record<string, FormValue>} FormValues */
/** @typedef {Record<string, string>} FormErrors */

/**
 * @typedef FormContextValueI
 * @property {FormErrors} errors
 * @property {boolean} isValid
 * @property {(errors: FormErrors) => void} onErrorsChange
 * @property {(values: FormValues) => void} onValuesChange
 * @property {Record<string, (value: FormValue, formValues?: FormValues) => string>} [validators]
 * @property {FormValues} values
 * */

/** @type {React.Context<FormContextValueI>} */
const formContext = createContext({
  errors: {},
  /** @type {boolean} */
  isValid: false,
  onErrorsChange: (errors) => {},
  onValuesChange: (values) => {},
  values: {},
});

export const useForm = () => useContext(formContext);

/**
 * @param {string} inputName
 */
export const useInput = (inputName) => {
  const { values, onValuesChange, errors, onErrorsChange, validators } =
    useForm();

  /** @param {string} error */
  const setError = (error) => {
    onErrorsChange({ ...errors, [inputName]: error });
  };

  /** @param {FormValue} value */
  const setValue = (value) => {
    onValuesChange({ ...values, [inputName]: value });
  };

  const error = errors[inputName];
  const value = values[inputName];

  const validator = validators?.[inputName] || function () {};

  /** @param {HTMLInputElement} inputElement */
  const validate = (inputElement) => {
    const error =
      validator(inputElement.value, values) || hasError(inputElement);
    setError(error);
  };

  return { error, setValue, validate, value };
};

/** @typedef {React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>} FormAttributes */

/**
 * @typedef FormPropsI
 * @property {React.ReactNode} children
 * @property {FormErrors} errors
 * @property {(values: FormValues) => void} onSubmit
 * @property {(errors: FormErrors) => void} onErrorsChange
 * @property {(values: FormValues) => void} onValuesChange
 * @property {Record<string, (value: FormValue, formValues?: FormValues) => string>} validators
 * @property {FormValues} values
 */

/**
 * @param {FormAttributes & FormPropsI} props
 */
const Form = ({
  children,
  errors,
  noValidate = true,
  onSubmit,
  onErrorsChange,
  onValuesChange,
  validators,
  values,
  ...rest
}) => {
  /** @param {React.FormEvent<HTMLFormElement>} event */
  const handleSubmit = (event) => {
    event.preventDefault();

    /** @type {FormErrors} */
    const newErrors = {};

    // @ts-ignore
    event.target.querySelectorAll('input').forEach((inputEl) => {
      const validator = validators?.[inputEl.name] || function () {};

      const error = validator(inputEl.value, values) || hasError(inputEl);

      if (!error) {
        return;
      }

      // focus the first input that has an error
      if (Object.values(newErrors).every((err) => !err)) {
        inputEl.focus();
      }

      newErrors[inputEl.name] = error;
    });

    onErrorsChange(newErrors);

    if (Object.values(newErrors).some((err) => Boolean(err))) {
      return;
    }

    onSubmit(values);
  };

  const value = useMemo(
    () => ({
      errors,
      isValid: Object.values(errors).every((err) => !err),
      onErrorsChange,
      onValuesChange,
      validators,
      values,
    }),
    [errors, onErrorsChange, onValuesChange, validators, values]
  );

  return (
    <formContext.Provider value={value}>
      <form onSubmit={handleSubmit} noValidate={noValidate} {...rest}>
        {children}
      </form>
    </formContext.Provider>
  );
};

export default Form;
