var assert = require('assert');
var chai = require('chai');
var expect = chai.expect;
var generate = require('./../../../controllers/util/generate');

describe('Util', function() {

    describe('generate', function() {
        it('it should return a good uuid', function() {
            var uuid = generate.UUID();

            expect(uuid).to.have.length(36);
            expect(uuid).to.not.equal('xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx');
        });

        it('it should return a unique uuid', function() {
            var uuid = generate.UUID();
            var uuid2 = generate.UUID();

            return expect(uuid).to.not.equal(uuid2);
        });

        it('test the last generation', function() {
            var uuid = generate.oldUUID();

            expect(uuid).to.have.length(10);
            expect(uuid).to.not.equal('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz');
        });
    });

});