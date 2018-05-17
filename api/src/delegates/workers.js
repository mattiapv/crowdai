const Boom = require('boom');

const db = require(__base + 'db');
const config = require(__base + 'config');

/**
 * Returns a worker record for the given ID.
 *
 * @param {String} id
 */
const getById = (exports.getById = async id => {
  try {
    let res = await db.query(
      `select * from ${db.TABLES.Worker} where id = $1`,
      [id]
    );
    return res.rowCount > 0 ? res.rows[0] : null;
  } catch (error) {
    console.error(error);
    throw Boom.badImplementation('Error while trying to fetch worker');
  }
});

/**
 * Returns a worker record for the given AMT ID.
 *
 * @param {String} turkId
 */
const getByTurkId = (exports.getByTurkId = async turkId => {
  try {
    let res = await db.query(
      `select * from ${db.TABLES.Worker} where turk_id = $1`,
      [turkId]
    );
    return res.rowCount > 0 ? res.rows[0] : null;
  } catch (error) {
    console.error(error);
    throw Boom.badImplementation('Error while trying to fetch worker');
  }
});

const create = (exports.create = async turkId => {
  try {
    let res = await db.query(
      `insert into ${
        db.TABLES.Worker
      }(turk_id, created_at) values($1, $2) returning *`,
      [turkId, new Date()]
    );
    return res.rows[0];
  } catch (error) {
    console.error(error);
    throw Boom.badImplementation('Error while trying to create worker');
  }
});

/**
 * Updates assigment data column.
 *
 * @param {string} uuid - The job UUID
 * @param {string} workerId
 * @param {Object} assignmentData - Attributes to update in data column
 */
const updateAssignment = (exports.updateAssignment = async (
  uuid,
  workerId,
  assignmentData
) => {
  try {
    let assigment = await getAssignment(uuid, workerId);
    assigment.data = {
      ...assigment.data,
      ...assignmentData
    };
    let res = await db.query(
      `update ${
        db.TABLES.WorkerAssignment
      } set updated_at = $1, data = $2 where id = $3 returning *`,
      [new Date(), assigment.data, assigment.id]
    );
    return res.rows[0];
  } catch (error) {
    console.error(error);
    throw Boom.badImplementation(
      'Error while trying to check assignment status'
    );
  }
});

/**
 * Returns the worker_assigment record
 *
 * @param {string} uuid - The job's UUID
 * @param {string} workerId - The worker's ID generated by CrowdRev.
 */
const getAssignment = (exports.getAssignment = async (uuid, workerId) => {
  try {
    const res = await db.query(
      `select * from ${
        db.TABLES.WorkerAssignment
      } where job_uuid = $1 and worker_id = $2`,
      [uuid, workerId]
    );
    return res.rowCount > 0 ? res.rows[0] : null;
  } catch (error) {
    console.error(error);
    throw Boom.badImplementation(
      'Error while trying to fetch assignment record'
    );
  }
});

/**
 * Returns the worker_assigment record.
 *
 * @param {string} uuid - The job's UUID
 * @param {string} workerTurkId - The worker's ID generated by CrowdRev.
 */
const getAssignmentByWorkerTurkId = (exports.getAssignmentByWorkerTurkId = async (
  uuid,
  workerTurkId
) => {
  try {
    let worker = await getByTurkId(workerTurkId);

    if (!worker) {
      return null;
    }
    const res = await db.query(
      `select * from ${
        db.TABLES.WorkerAssignment
      } where job_uuid = $1 and worker_id = $2`,
      [uuid, worker.id]
    );
    return res.rowCount > 0 ? res.rows[0] : null;
  } catch (error) {
    console.error(error);
    throw Boom.badImplementation(
      'Error while trying to fetch assignment record'
    );
  }
});

/**
 * Initializes the assignment record.
 *
 * @param {Object} assignment
 */
const createAssignment = (exports.createAssignment = async assignment => {
  let data = {
    ...assignment.data,
    finished: false,
    initialTestFailed: false,
    honeypotFailed: false,
    solvedMinTasks: false,
    finishedWithError: false,
    finishedByWorker: false,
    assignmentApproved: false,
    assignmentBonusSent: false,
    start: new Date()
  };

  try {
    let res = await db.query(
      `insert into ${
        db.TABLES.WorkerAssignment
      }(job_id, job_uuid, worker_id, created_at, data) values($1, $2, $3, $4, $5) returning *`,
      [
        assignment.job_id,
        assignment.job_uuid,
        assignment.worker_id,
        new Date(),
        data
      ]
    );
    return res.rows[0];
  } catch (error) {
    console.error(error);
    throw Boom.badImplementation(
      'Error while trying to create assignment record'
    );
  }
});
