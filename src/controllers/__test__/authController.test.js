const axios = require('axios');

const {
  login
} = require('../authController')();

jest.mock('axios');

describe('Given authController', () => {
  describe('When it is called with login function', () => {
    const req = {
      body: {
        client_id: 'id',
        client_secret: 'secret'
      },
      json: jest.fn(),
      send: jest.fn()
    };
    const res = {
      json: jest.fn(),
      send: jest.fn(),
      status: jest.fn()
    };
    describe('And the promise is resolved', () => {
      test('Then the token', async () => {
        const token = {
          data: {
            token: 'batman',
            type: 'Bearer'
          }
        };
        axios.post.mockResolvedValueOnce(token);
        await login(req, res);

        expect(res.json).toHaveBeenCalledWith({ token: 'batman', type: 'Bearer' });
      });
    });

    describe('And the promise is rejected', () => {
      test('Then the status code 401 should be sent', async () => {
        axios.mockRejectedValueOnce();
        await login(req, res);
        expect(res.status).toHaveBeenCalledWith(401);
      });
    });
  });
});
