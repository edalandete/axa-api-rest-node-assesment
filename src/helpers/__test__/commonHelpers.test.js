const axios = require('axios');
require('dotenv').config();

const {
  getToken, isUser, isAdmin, isSameClient
} = require('../commonHelpers');

jest.mock('axios');

describe('Given getToken function', () => {
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

describe('Given a isUser function', () => {
  const scenarios = [
    {
      role: 'user',
      result: true
    },
    {
      role: 'admin',
      result: false
    }
  ];

  scenarios.forEach(({
    role, result
  }) => {
    describe(`When invoked with values role: ${role}`, () => {
      test(`Then return ${result}`, () => {
        const userRole = isUser(role);
        expect(userRole).toBe(result);
      });
    });
  });
});

describe('Given a isAdmin function', () => {
  const scenarios = [
    {
      role: 'admin',
      result: true
    },
    {
      role: 'user',
      result: false
    }
  ];

  scenarios.forEach(({
    role, result
  }) => {
    describe(`When invoked with values role: ${role}`, () => {
      test(`Then return ${result}`, () => {
        const userRole = isAdmin(role);
        expect(userRole).toBe(result);
      });
    });
  });
});

describe('Given a isSameClient function', () => {
  const scenarios = [
    {
      storedClientId: 'batman',
      clientFoundId: 'batman',
      result: true
    },
    {
      toredClientId: 'batman',
      clientFoundId: 'bruce',
      result: false
    }
  ];

  scenarios.forEach(({
    storedClientId, clientFoundId, result
  }) => {
    describe(`When invoked with values storedClientId: ${storedClientId}, clientFoundId: ${clientFoundId}`, () => {
      test(`Then return ${result}`, () => {
        const sameClient = isSameClient(storedClientId, clientFoundId);
        expect(sameClient).toBe(result);
      });
    });
  });
});
