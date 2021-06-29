const axios = require('axios');

const {
  getAll, getById
} = require('../policiesController')();

jest.mock('axios');

describe('Given policiesController', () => {
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
      test('Then all the policies should be sents', async () => {
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
        await getAll(req, res);

        expect(res.json).toHaveBeenCalledWith({
          results: [
            {
              id: '1',
              amountInsured: '1234'
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
      query: {
        limit: 10
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
      test('Then the policy with the id 1 should be found', async () => {
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
