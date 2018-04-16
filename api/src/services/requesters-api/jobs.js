const Boom = require('boom');

const delegates = require(__base + 'delegates');
const managers = require(__base + 'managers');

const getProjectJobs = async ctx => {
  ctx.response.body = await delegates.jobs.getByProject(ctx.params.projectId);
};

const getById = async ctx => {
  ctx.response.body = await delegates.jobs.getById(ctx.params.id);
};

const getState = async ctx => {
  ctx.response.body = await managers.job.getState(ctx.params.id);
};

const post = async ctx => {
  ctx.response.body = await delegates.jobs.create(ctx.request.fields);
};

const put = async ctx => {
  ctx.response.body = await delegates.jobs.update(
    ctx.params.id,
    ctx.request.fields
  );
};

const copy = async ctx => {
  ctx.response.body = await delegates.jobs.copy(ctx.params.id);
};

const publish = async ctx => {
  ctx.response.body = await managers.job.publish(ctx.params.id);
};

exports.register = router => {
  router.get('/projects/:projectId/jobs', getProjectJobs);
  router.post('/jobs', post);
  router.put('/jobs/:id', put);
  router.get('/jobs/:id', getById);
  router.post('/jobs/:id/publish', publish);
  router.get('/jobs/:id/state', getState);
  router.post('/jobs/:id/copy', copy);
};
