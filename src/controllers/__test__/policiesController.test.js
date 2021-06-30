const axios = require('axios');
const { isAdmin, isUser, isSameClient } = require('../../helpers/commonHelpers');

const {
  getAll, getById
} = require('../policiesController')();

jest.mock('axios');
jest.mock('../../helpers/commonHelpers', () => ({
  ...jest.requireActual('../../helpers/commonHelpers'),
  isAdmin: jest.fn(),
  isUser: jest.fn(),
  isSameClient: jest.fn()
}));

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
    describe('And the promise is resolved with admin role', () => {
      test('Then all the policies should be returned', async () => {
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
        isAdmin.mockReturnValue(true);
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

    describe('And the promise is resolved with user role', () => {
      test('Then all the policies matching the clientId should be returned', async () => {
        const policies = {
          data:
            [
              {
                id: '1',
                amountInsured: '1234',
                clientId: '1'
              }
            ]
        };
        axios.get.mockResolvedValueOnce(policies);
        isUser.mockReturnValue(true);
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

    describe('And the promise is resolved with role admin', () => {
      test('Then the policy with the id 1 should be found', async () => {
        const policies = {
          data:
            [
              {
                id: '1',
                amountInsured: '1234',
                clientId: '1'
              }
            ]
        };
        axios.get.mockResolvedValueOnce(policies);
        isAdmin.mockReturnValue(true);
        await getById(req, res);

        expect(res.json).toHaveBeenCalledWith(
          {
            id: '1',
            amountInsured: '1234',
            clientId: '1'
          }
        );
      });
    });

    describe('And the promise is resolved with role user', () => {
      describe('And the policy belongs to the user', () => {
        test('Then the policy with the id 1 should be found', async () => {
          const policies = {
            data:
              [
                {
                  id: '1',
                  amountInsured: '1234',
                  clientId: '1'
                }
              ]
          };
          axios.get.mockResolvedValueOnce(policies);
          isAdmin.mockReturnValue(false);
          isUser.mockReturnValue(true);
          isSameClient.mockReturnValue(true);
          await getById(req, res);

          expect(res.json).toHaveBeenCalledWith(
            {
              id: '1',
              amountInsured: '1234',
              clientId: '1'
            }
          );
        });
      });
      describe('And the policy does not belong to the user', () => {
        test('Then status 403 should be sent', async () => {
          const policies = {
            data:
              [
                {
                  id: '1',
                  amountInsured: '1234',
                  clientId: '1'
                }
              ]
          };
          axios.get.mockResolvedValueOnce(policies);
          isAdmin.mockReturnValue(false);
          isUser.mockReturnValue(true);
          isSameClient.mockReturnValue(false);
          await getById(req, res);

          expect(res.status).toHaveBeenCalledWith(403);
        });
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
