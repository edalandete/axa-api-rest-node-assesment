const axios = require('axios');

const {
  getAll, getById
} = require('../clientsController')();

jest.mock('axios');

describe('Given clientsController', () => {
  describe('When it is called with getAll function', () => {
    const req = {
      query: { limit: 10 }
    };

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
        await getAll(req, res);

        expect(res.json).toHaveBeenCalledWith({
          results: [
            {
              id: '1',
              name: 'Bruce Wayne'
            }
          ]
        });
      });
    });

    describe('And the promise is rejected', () => {
      test('Then the status code 401 should be sent', async () => {
        axios.mockRejectedValueOnce();
        await getAll(req, res);
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
      test('Then the client with the id 1 should be sent as response', async () => {
        const clients = {
          data:
            [
              {
                id: '1',
                name: 'Edgar'
              }
            ]
        };
        axios.get.mockResolvedValueOnce(clients);
        await getById(req, res);

        expect(res.json).toHaveBeenCalledWith(
          {
            id: '1',
            name: 'Edgar'
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
