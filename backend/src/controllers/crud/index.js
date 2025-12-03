const crud = require("./crud");

exports.crudController = ( Model ) => {
  let methods = {};
  const controller = crud(Model);
  
  methods.all = async (req, res) => {
    controller.all(req, res);
  };

  methods.create = async (req, res) => {
    controller.create(req, res);
  };

  methods.read = async (req, res) => {
    controller.read(req, res);
  };

  methods.update = async (req, res) => {
    controller.update(req, res);
  };

  methods.delete = async (req, res) => {
    controller.delete(req, res);
  };

  methods.list = async (req, res) => {
    controller.list(req, res);
  };

  methods.search = async (req, res) => {
    controller.search(req, res);
  };
  
  return methods;
};
