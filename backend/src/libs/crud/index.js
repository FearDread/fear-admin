const crud = require("./crud");

exports.crudController = ( Model ) => {
  let methods = {};
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

  return methods;
};
