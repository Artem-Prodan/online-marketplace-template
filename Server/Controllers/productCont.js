//productController

const {Product, ProductInfo} = require("../Models/models");
const ApiError = require("../errors/apiError");
const uuid = require("uuid");
const path = require("path");
const { title } = require("process");

class ProductCont {

    async create(req, res, next){
       try{
         const {name, price, brandId, typeId, info} = req.body
        const {img}  = req.files
        let fileName = uuid.v4()+".jpg"
        img.mv(path.resolve(__dirname, "..","static", fileName))
        const product = await Product.create({name, price, brandId, typeId, img: fileName})
        
            if(info){
            const parsedInfo = JSON.parse(info)
            for(const i of parsedInfo){
                await ProductInfo.create({
                    title: i.title,
                    description: i.description,
                    productId: product.id
                })
            }
        }

        return res.json(product)
       } catch (e){
            next(ApiError.badRequest(e.message))
       }
    }

    //getting products based on the speciffied ID (brand/type)
    async getAll(req, res){
        let {brandId, typeId, limit, page}=req.query
        page = page || 1
        limit = limit|| 9 
        let offset = page * limit - limit

        let product;
        if (!brandId && !typeId){
            product = await Product.findAndCountAll({limit, offset})
        }
        if (brandId && !typeId){
            product = await Product.findAndCountAll({where:{brandId}, limit, offset})
        }
        if (!brandId && typeId){
            product = await Product.findAndCountAll({where:{typeId}, limit, offset})
        }
        if (brandId && typeId){
            product = await Product.findAndCountAll({where:{brandId, typeId}, limit, offset})
        }
        return res.json(product)

    }

    async getOne(req,res){
        const {id} = req.params
        const product = await Product.findOne(
            {where: {id},
            include: [{model: ProductInfo, as: "info"}]
          },
        )
        return res.json(product)
    }



    async update(req, res, next) {
        try {
            const { id } = req.params;
            const { name, price, brandId, typeId, info } = req.body;

            // Find product by ID
        const product = await Product.findByPk(id, {
            include: [{ model: ProductInfo, as: "info" }]
        });
        if (!product) {
            return next(ApiError.badRequest(`Product with id ${id} not found.`));
        }

        // update fields if they are passed
        if (name) product.name = name;
        if (price) product.price = price;
        if (brandId) product.brandId = brandId;
        if (typeId) product.typeId = typeId;

        // update image if new
        if (req.files && req.files.img) {
            const { img } = req.files;
            const fileName = uuid.v4() + ".jpg";
            await img.mv(path.resolve(__dirname, "..", "static", fileName));
            product.img = fileName;
        }

        // info update
        if (info) {
            // delete previous info
            await ProductInfo.destroy({ where: { productId: product.id } });

            // add new
            const parsedInfo = JSON.parse(info);
            for (const i of parsedInfo) {
                await ProductInfo.create({
                    title: i.title,
                    description: i.description,
                    productId: product.id
                });
            }
        }

        await product.save();
        return res.json({ message: `Product with id ${id} updated successfully` });

    } catch (e) {
        console.error("PRODUCT UPDATE ERROR:", e);
        return next(ApiError.internal("Failed to update product"));
    }
 }


    
    async delete(req, res, next) {
    try {
        const { id } = req.params;

        const deletedCount = await Product.destroy({
            where: { id }
        });

        if (deletedCount === 0) {
            return next(ApiError.badRequest(`Product with id ${id} not found.`));
        }

        return res.json({ message: `Product with id ${id} has been deleted.` });
    } catch (error) {
        return next(ApiError.internal('deleting error'));
    }
}
}

module.exports = new ProductCont()