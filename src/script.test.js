const {add} = require('./script');

describe('SayHello Unit Test Suites' , () => {

    it('should return Hello, Antoine' , () => {
        expect(add(5,6)).toBe(11);
    });
})