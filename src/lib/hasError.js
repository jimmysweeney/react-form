/**
 * @param {HTMLInputElement | null} field
 * @author Chris Fernandi https://css-tricks.com/form-validation-part-2-constraint-validation-api-javascript/
 * */
export default function hasError(field) {
  // Don't validate submits, buttons, file and reset inputs, and disabled fields
  if (
    !field ||
    field.disabled ||
    field.type === 'file' ||
    field.type === 'reset' ||
    field.type === 'submit' ||
    field.type === 'button'
  )
    return '';

  // Get validity
  const { validity } = field;

  // If valid, return null
  if (validity.valid) return '';

  // If field is required and empty
  if (validity.valueMissing) return 'This field is required';

  // If not the right type
  if (validity.typeMismatch) {
    // Email
    if (field.type === 'email') return 'Please enter an email address';

    // URL
    if (field.type === 'url') return 'Please enter a URL';
  }

  return 'Something else';
}
