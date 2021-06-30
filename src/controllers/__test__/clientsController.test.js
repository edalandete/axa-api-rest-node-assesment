const axios = require('axios');
const { isAdmin, isUser, isSameClient } = require('../../helpers/commonHelpers');

const {
  getAll, getById, getPoliciesFromClientId
} = require('../clientsController')();

jest.mock('axios');
jest.mock('../../helpers/commonHelpers', () => ({
  ...jest.requireActual('../../helpers/commonHelpers'),
  isAdmin: jest.fn(),
  isUser: jest.fn(),
  isSameClient: jest.fn()
}));

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
    describe('And the promise is resolved with a role admin', () => {
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
        isAdmin.mockReturnValueOnce(true);
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

    describe('And the promise is resolved with a role admin', () => {
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
        isAdmin.mockReturnValueOnce(false);
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

    describe('And the promise is resolved with a client matching the id and role admin', () => {
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
        isAdmin.mockReturnValueOnce(true);
        await getById(req, res);

        expect(res.json).toHaveBeenCalledWith(
          {
            id: '1',
            name: 'Edgar'
          }
        );
      });
    });

    describe('And the promise is resolved with a client matching the id and role user', () => {
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
        isAdmin.mockReturnValueOnce(false);
        isUser.mockReturnValueOnce(true);
        isSameClient.mockReturnValueOnce(true);
        await getById(req, res);

        expect(res.json).toHaveBeenCalledWith(
          {
            id: '1',
            name: 'Edgar'
          }
        );
      });
    });

    describe('And the promise is resolved without a client matching the id', () => {
      test('Then the status code 404 should be sent', async () => {
        const clients = {
          data:
            []
        };
        axios.get.mockResolvedValueOnce(clients);
        isAdmin.mockReturnValue(true);
        await getById(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
      });
    });

    describe('And the promise is resolved without an authorized user', () => {
      test('Then the status code 403 should be sent', async () => {
        const clients = {
          data:
            [{
              id: '1',
              name: 'Edgar'
            }]
        };
        axios.get.mockResolvedValueOnce(clients);
        isAdmin.mockReturnValue(false);
        isUser.mockReturnValue(true);
        isSameClient.mockReturnValue(false);
        await getById(req, res);

        expect(res.status).toHaveBeenCalledWith(403);
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
  describe('When it is called with a getPoliciesFromClientId function', () => {
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

    describe('And the promise is resolved with client having policies', () => {
      test('Then the client with the id 1 should be sent as response', async () => {
        const clients = {
          data:
            [
              {
                id: '12',
                name: 'Edgar',
                clientId: '1'
              }
            ]
        };
        axios.get.mockResolvedValueOnce(clients);
        isAdmin.mockReturnValueOnce(true);
        await getPoliciesFromClientId(req, res);

        expect(res.json).toHaveBeenCalledWith([{ clientId: '1', id: '12', name: 'Edgar' }]);
      });
    });

    describe('And the promise is resolved with client that has no policies', () => {
      test('Then the client with the id 1 should be sent as response', async () => {
        const clients = {
          data:
            []
        };
        axios.get.mockResolvedValueOnce(clients);
        isAdmin.mockReturnValueOnce(true);
        await getPoliciesFromClientId(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
      });
    });

    describe('And the promise is resolved with client that has no policies', () => {
      test('Then the client with the id 1 should be sent as response', async () => {
        const clients = {
          data:
            []
        };
        axios.get.mockResolvedValueOnce(clients);
        isAdmin.mockReturnValueOnce(false);
        isUser.mockReturnValueOnce(false);
        isSameClient.mockReturnValueOnce(false);
        await getPoliciesFromClientId(req, res);

        expect(res.status).toHaveBeenCalledWith(403);
      });
    });

    describe('And the promise is rejected', () => {
      test('Then the status code 401 should be sent', async () => {
        axios.mockRejectedValueOnce();
        await getPoliciesFromClientId(req, res);
        expect(res.status).toHaveBeenCalledWith(401);
      });
    });
  });
});
