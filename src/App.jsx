import React from 'react';
import MyInput from './lib/MyInput';
import Form from './lib/Form';
import { useForm } from './lib/Form';

const SubmitButton = () => {
  const { isValid } = useForm();

  return <button disabled={!isValid}>Submit</button>;
};

function App() {
  return (
    <Form
      noValidate
      onSubmit={(values) => {
        console.log(values);
      }}
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
        <SubmitButton />
      </div>
    </Form>
  );
}

export default App;
