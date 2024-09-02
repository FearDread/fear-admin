const crud = require("./crud");
const mongoose = require("mongoose");

module.exports = ( Model, func ) => {
    let methods = {};

    methods[func] = async (req, res) => {
        crud[func](Model, req, res);
    }

    return methods;

  methods.create = async (req, res) => {
    crud.create(Model, req, res);
  };

  methods.read = async (req, res) => {
    crud.read(Model, req, res);
  };

  methods.update = async (req, res) => {
    crud.update(Model, req, res);
  };

  methods.delete = async (req, res) => {
    crud.delete(Model, req, res);
  };

  methods.list = async (req, res) => {
    crud.list(Model, req, res);
  };

  methods.search = async (req, res) => {
    crud.search(Model, req, res);
  };

};
