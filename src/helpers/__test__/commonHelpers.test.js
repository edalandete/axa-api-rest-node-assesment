const axios = require('axios');

const {
  getToken
} = require('../commonHelpers');

jest.mock('axios');

describe('Given authController', () => {
  describe('When it is called with login function', () => {
    describe('And the promise is resolved', () => {
      test('Then the token should be returned', async () => {
        const token = {
          data: {
            token: 'batman',
            type: 'Bearer'
          }
        };
        axios.post.mockResolvedValueOnce(token);
        const result = await getToken();

        expect(result).toEqual({ token: 'batman', type: 'Bearer' });
      });
    });

    describe('And the promise is rejected', () => {
      test('Then the status code 401 should be sent', async () => {
        axios.mockRejectedValueOnce();
        const result = await getToken();
        expect(result).toEqual({ status: 401, message: 'Invalid client or secret id' });
      });
    });
  });
});
