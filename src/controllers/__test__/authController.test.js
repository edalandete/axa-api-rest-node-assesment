const axios = require('axios');
const { getToken } = require('../../helpers/commonHelpers');

const {
  login
} = require('../authController')();

jest.mock('axios');
jest.mock('../../helpers/commonHelpers', () => ({
  ...jest.requireActual('../../helpers/commonHelpers'),
  getToken: jest.fn()

}));

describe('Given authController', () => {
  describe('When it is called with login function', () => {
    const req = {
      body: {
        email: 'batman'
      },
      json: jest.fn(),
      send: jest.fn()
    };
    const res = {
      json: jest.fn(),
      send: jest.fn(),
      status: jest.fn()
    };
    describe('And the promise is resolved with an existing client', () => {
      test('Then the token should be returned', async () => {
        const clients = {
          data: [{
            email: 'batman',
            name: 'wane'
          }]
        };
        axios.get.mockResolvedValueOnce(clients);
        getToken.mockReturnValueOnce({ token: 'batman', type: 'bearer' });
        await login(req, res);

        expect(res.json).toHaveBeenCalledWith({
          token: 'batman',
          type: 'bearer'
        });
      });
    });

    describe('And the promise is resolved with no existing client', () => {
      test('Then the token should be returned', async () => {
        const clients = {
          data: [{
            email: 'alfred',
            name: 'wane'
          }]
        };
        axios.get.mockResolvedValueOnce(clients);
        getToken.mockReturnValueOnce({ token: 'batman', type: 'bearer' });
        await login(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
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
