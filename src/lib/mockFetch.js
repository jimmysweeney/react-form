/** @param {any} params */
export default function mockFetch(params) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        status: 'error',
        data: { email: 'Looks like this email is already used. So sorry' },
      });
    }, 2000);
  });
}
