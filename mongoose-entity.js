module.exports = function(opts) {

  var seneca = this;
  var mongoose;

  seneca.add('init:mongoose-entity', init);
  seneca.add('role:mongoose-entity, cmd:findAll', findAll);
  seneca.add('role:mongoose-entity, cmd:create', create);
  seneca.add('role:mongoose-entity, cmd:findById', findById);
  seneca.add('role:mongoose-entity, cmd:updateById', updateById);
  seneca.add('role:mongoose-entity, cmd:destroyById', destroyById);

  return;

  function init(args, done) {
    mongoose = opts.mongoose;
    done();
  }

  function findAll(args, done) {
    var model = args.model;
    var Model = mongoose.model(model);

    var limit = args.limit;
    var skip = args.skip;
    var sort = args.sort;
    var filters = args.filters;
    // console.log('==========findall==========');
    // console.log(args);

    Promise.all([
      Model.count(filters),
      Model.find(filters).limit(limit).skip(skip).sort(sort)
    ]).then(function(results) {
      done(null, {
        count: results[0],
        entities: results[1]
      });
    }).catch(done);
  }

  function create(args, done) {
    var data = args.data;
    var model = args.model;
    var Model = mongoose.model(model);

    var entity = new Model(data);
    entity.save().then(function() {
      done(null, entity.toObject());
    }).catch(done);
  }

  function findById(args, done) {
    var id = args.id;
    var model = args.model;
    var Model = mongoose.model(model);

    Model.findById(id).then(function(entity) {
      if (!entity) throw new Error('not fount');
      done(null, entity.toObject())
    }).catch(done);
  }

  function updateById(args, done) {
    var id = args.id;
    var data = args.data;
    var model = args.model;
    var Model = mongoose.model(model);

    Model.findByIdAndUpdate(id, data).then(function(entity) {
      if (!entity) throw new Error('not fount');
      done(null, entity.toObject())
    }).catch(done);
  }

  function destroyById(args, done) {
    var id = args.id;
    var model = args.model;
    var Model = mongoose.model(model);

    Model.findByIdAndRemove(id).then(function(entity) {
      if (!entity) throw new Error('not fount');
      done(null, entity.toObject())
    }).catch(done);
  }

}
