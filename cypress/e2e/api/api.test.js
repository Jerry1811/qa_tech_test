import supertest from 'supertest';
const request = supertest('https://fakerestapi.azurewebsites.net');

describe('API tests for users route', () => {
    test('Verify API status code is 200', async () => {
        await request.get('/api/v1/Users').expect(200);
    });

    test('Verify "User 6" is present in the response', async () => {
        const res = await request.get('/api/v1/Users').expect(200);
        const user6 = res.body.find((user) => user.userName === 'User 6');
        expect(user6.userName).toMatch('User 6');
    });

    test('Count the number of objects in the response', async () => {
        const res = await request.get('/api/v1/Users').expect(200);
        expect(res.body.length).toEqual(10);
    });
});
