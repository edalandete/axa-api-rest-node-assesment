const axios = require('axios');

const {
  getAll, getById
} = require('../clientsController')();

jest.mock('axios');

describe('Given clientsController', () => {
  describe('When it is called with getAll function', () => {
    const res = {
      json: jest.fn(),
      send: jest.fn(),
      status: jest.fn()
    };
    describe('And the promise is resolved', () => {
      test('Then the token', async () => {
        const clients = {
          data:
            [
              {
                id: '1',
                name: 'Bruce Wayne'
              }
            ]
        };
        axios.get.mockResolvedValueOnce(clients);
        await getAll(null, res);

        expect(res.json).toHaveBeenCalledWith([
          {
            id: '1',
            name: 'Bruce Wayne'
          }
        ]);
      });
    });

    describe('And the promise is rejected', () => {
      test('Then the status code 401 should be sent', async () => {
        axios.mockRejectedValueOnce();
        await getAll(null, res);
        expect(res.status).toHaveBeenCalledWith(401);
      });
    });
  });

  describe('When it is called with a getById function', () => {
    const req = {
      params: {
        id: '1'
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
        const policies = {
          data:
            [
              {
                id: '1',
                amountInsured: '1234'
              }
            ]
        };
        axios.get.mockResolvedValueOnce(policies);
        await getById(req, res);

        expect(res.json).toHaveBeenCalledWith(
          {
            id: '1',
            amountInsured: '1234'
          }
        );
      });
    });

    describe('And the promise is rejected', () => {
      test('Then the status code 401 should be sent', async () => {
        axios.mockRejectedValueOnce();
        await getById(req, res);
        expect(res.status).toHaveBeenCalledWith(401);
      });
    });
  });
});
