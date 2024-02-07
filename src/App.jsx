import React, { useState } from 'react';
import MyInput from './lib/MyInput';
import Form from './lib/Form';
import { useForm } from './lib/Form';
import mockFetch from './lib/mockFetch';

/**
 * @param {object} props
 * @param {boolean} props.isLoading
 */
const SubmitButton = ({ isLoading }) => {
  const { isValid } = useForm();

  return (
    <button disabled={!isValid || isLoading}>
      {isLoading ? 'Loading...' : 'Submit'}
    </button>
  );
};

/** @type {import('./lib/Form').FormValues} */
const initialFormValues = {
  email: '',
  emailCc: '',
  website: '',
  name: '',
  puppies: 3,
};
/** @type {import('./lib/Form').FormErrors} */
const initialFormErrors = {
  email: '',
  emailCc: '',
  website: '',
  name: '',
  puppies: '',
};

function App() {
  const [formValues, setFormValues] = useState(initialFormValues);
  const [formErrors, setFormErrors] = useState(initialFormErrors);
  const [isLoading, setIsLoading] = useState(false);

  // @ts-ignore
  const handleSubmit = async (vals) => {
    setIsLoading(true);
    const res = await mockFetch(vals);
    setIsLoading(false);

    if (res.status === 'error') {
      setFormErrors(res.data);
    }
  };

  return (
    <Form
      noValidate
      values={formValues}
      onValuesChange={setFormValues}
      errors={formErrors}
      onErrorsChange={setFormErrors}
      onSubmit={handleSubmit}
      validators={{
        email: (emailValue) => {
          if (emailValue === 'llama@gmail.com') {
            return 'Pick a different email ya jabroni';
          }

          return '';
        },
        emailCc: (emailCcValue, formValues) => {
          if (emailCcValue === formValues?.email) {
            return 'please provide a different email than the main email';
          }
          return '';
        },
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        <MyInput
          label="Email"
          type="email"
          placeholder="enter your email"
          name="email"
          required
        />
        <MyInput
          label="CC Email"
          type="email"
          placeholder="enter an email to cc"
          name="emailCc"
        />
        <MyInput
          label="Website"
          type="url"
          placeholder="enter your website"
          name="website"
        />
        <MyInput
          label="Name"
          type="text"
          placeholder="enter your name"
          name="name"
          required
        />
        <MyInput
          label="Number of puppies"
          type="number"
          min={3}
          max={99}
          placeholder="how many do you need?"
          name="puppies"
          required
        />
        <SubmitButton isLoading={isLoading} />
      </div>
    </Form>
  );
}

export default App;
