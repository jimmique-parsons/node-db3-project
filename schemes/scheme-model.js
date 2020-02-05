const db = require('./../data/db-config.js');
function find() {
    return db('schemes');
}
function findById(id) {
    return db('schemes').where({ id }).first();
}
function findSteps(id) {
    return db('steps')
        .join('schemes', 'schemes.id', 'steps.scheme_id')
        .select('steps.id', 'schemes.scheme_name', 'steps.step_number', 'steps.instructions')
        .where({ scheme_id: id })
        .orderBy('step_number');
}
async function add(schemeData) {
    try {
        const ids = await db('schemes').insert(schemeData);
        return findById(ids[0]);
    } catch (error) {
        throw error;
    }
}
async function addStep(stepData, id) {
    try {
        const ids = await db('steps').insert({ scheme_id: id, ...stepData });
        const step = await db('steps').where({ id: ids[0] }).first();
        return step;
    } catch (error) {
        throw error;
    }
}
async function update(changes, id) {
    try {
        const resId = await db('schemes').where({ id }).update(changes);
        const updatedScheme = await findById(id);
        return updatedScheme;
    } catch (error) {
        throw error;
    }
}
async function remove(id) {
    try {
        const scheme = await findById(id);
        if (scheme) {
            const result = await db('schemes').where({ id }).del();
            return scheme;
        } else {
            return null;
        }
    } catch (error) {
        throw error;
    }
}
module.exports = {
    find,
    findById,
    findSteps,
    add,
    addStep,
    update,
    remove
}