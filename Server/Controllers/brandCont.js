//brandController
const {Brand} = require("../Models/models");
const ApiError = require("../errors/apiError");



class BrandCont {

    async create(req, res, next) {
        try {
            const { name } = req.body;
            if (!name) {
                return next(ApiError.badRequest("Name is required"));
            }

            const existing = await Brand.findOne({ where: { name } });
            if (existing) {
                return next(ApiError.badRequest("Brand already exists"));
            }

            const brand = await Brand.create({ name });
            return res.json(brand);
        } catch (e) {
            console.error("BRAND CREATE ERROR:", e);
            return next(ApiError.internal("Failed to create brand"));
        }
    }

    async getAll(req, res, next) {
        try {
            const brands = await Brand.findAll();
            return res.json(brands);
        } catch (e) {
            console.error("BRAND GET ERROR:", e);
            return next(ApiError.internal("Failed to get brands"));
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

            // searching for the brand in the DB
            const brand = await Brand.findByPk(id);
            // if there is no such brand
            if (!brand) {
                return next(ApiError.badRequest(`Brand with id ${id} not found.`));
            }

            brand.name = name;
            await brand.save();

            return res.json({ message: `Brand with id ${id} updated successfully` });
        } catch (e) {
            console.error("BRAND UPDATE ERROR:", e);
            return next(ApiError.internal("Failed to update brand"));
        }
    }

    async delete(req, res, next) {
    try {
        const { id } = req.params;

        const deletedCount = await Brand.destroy({
            where: { id }
        });

        if (deletedCount === 0) {
            return next(ApiError.badRequest(`Brand with id ${id} not found.`));
        }

        return res.json({ message: `Brand with id ${id} has been deleted.` });
    } catch (error) {
        return next(ApiError.internal('deleting error'));
    }
}
}

module.exports = new BrandCont()