const crud = require("./crud");
const mongoose = require("mongoose");

module.exports = (app) => {
  //const Model = mongoose.Model[modelName];
  //const Model = app.models[modelName];
  const Model = {};
  let methods = {};

  methods.create = async (name, req, res) => {
    Model = app.models[name];
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

  return methods;
};
