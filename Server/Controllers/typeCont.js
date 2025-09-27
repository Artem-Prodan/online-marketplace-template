//typeController

const{Type} = require("../Models/models");
const ApiError = require("../errors/apiError");



class TypeCont {

    async create(req, res, next) {
        try {
            const { name } = req.body;
            if (!name) {
                return next(ApiError.badRequest("Name is required"));
            }

            const existing = await Type.findOne({ where: { name } });
            if (existing) {
                return next(ApiError.badRequest("Type already exists"));
            }

            const type = await Type.create({ name });
            return res.json(type);
        } catch (e) {
            console.error("TYPE CREATE ERROR:", e);
            return next(ApiError.internal("Failed to create type"));
        }
    }

    async getAll(req, res, next) {
        try {
            const types = await Type.findAll();
            return res.json(types);
        } catch (e) {
            console.error("TYPE GET ERROR:", e);
            return next(ApiError.internal("Failed to get types"));
        }
    }

    async update(req, res, next) {
        try {
            const { id } = req.params;
            const { name } = req.body;

            //name is required for update
            if (!name) {
                return next(ApiError.badRequest("Name is required"));
            }

            // searching for the type in the DB
            const type = await Type.findByPk(id);
            // if there is no such type
            if (!type) {
                return next(ApiError.badRequest(`Type with id ${id} not found.`));
            }

            type.name = name;
            await type.save();

            return res.json({ message: `Type with id ${id} updated successfully` });
        } catch (e) {
            console.error("TYPE UPDATE ERROR:", e);
            return next(ApiError.internal("Failed to update type"));
        }
    }


    async delete(req, res, next) {
    try {
        const { id } = req.params;

        const deletedCount = await Type.destroy({
            where: { id }
        });

        if (deletedCount === 0) {
            return next(ApiError.badRequest(`Type with id ${id} not found.`));
        }

        return res.json({ message: `Type with id ${id} has been deleted.` });
    } catch (error) {
        return next(ApiError.internal('deleting error'));
    }
}

}

module.exports = new TypeCont()